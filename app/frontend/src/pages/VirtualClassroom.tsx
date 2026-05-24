import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import {
  getUserChannels,
  getChannelById,
  getChannelByBookingId,
  getChannelMessages,
  sendMessage,
  subscribeToChannelMessages,
  subscribeToUserChannels,
  hasChannelAccess,
  getUserProfile,
  Channel,
  Message,
  UserProfile,
} from '@/services/channelService';
import { Send, LogOut, MessageCircle, Video, Loader, ArrowLeft, PhoneCall, PhoneOff } from 'lucide-react';

// ─── Ring helpers ────────────────────────────────────────────────────────────

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [0, 0.55, 1.1].forEach((delay) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.45, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.45);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.45);
    });
  } catch { /* ignore AudioContext restrictions */ }
}

function playRingTone() {
  try {
    const audio = new Audio('/ringtone.mp3');
    audio.volume = 0.7;
    audio.play().catch(() => playBeep());
  } catch {
    playBeep();
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RingState {
  visible: boolean;
  callerName: string;
}

export default function VirtualClassroom() {
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();
  const { user }    = useSupabaseAuth();

  const [channels,        setChannels]        = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages,        setMessages]        = useState<Message[]>([]);
  const [newMessage,      setNewMessage]      = useState('');
  const [loading,         setLoading]         = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [userProfile,     setUserProfile]     = useState<UserProfile | null>(null);
  const [jitsiReady,      setJitsiReady]      = useState(false);
  const [showVideo,       setShowVideo]       = useState(false);
  const [ringState,       setRingState]       = useState<RingState>({ visible: false, callerName: '' });

  const messagesEndRef         = useRef<HTMLDivElement>(null);
  const jitsiContainerRef      = useRef<HTMLDivElement>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const unsubscribeChannelsRef = useRef<(() => void) | null>(null);
  const broadcastRef           = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const ringTimerRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bookingIdFromUrl = searchParams.get('bookingId');

  // ── Load user profile ──────────────────────────────────────────────────────
  useEffect(() => {
    getUserProfile()
      .then((p) => setUserProfile(p))
      .catch((err) => console.error('[VC] profile load error:', err));
  }, []);

  // ── Load channels ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        const userChannels = await getUserChannels();
        setChannels(userChannels);

        if (bookingIdFromUrl) {
          const found = userChannels.find((c) => c.booking_id === bookingIdFromUrl);
          if (found) {
            setSelectedChannel(found);
          } else {
            const fresh = await getChannelByBookingId(bookingIdFromUrl);
            if (fresh) setSelectedChannel(fresh);
          }
        } else if (userChannels.length > 0) {
          setSelectedChannel((prev) => prev ?? userChannels[0]);
        }
      } catch (err) {
        console.error('[VC] load channels error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();

    const unsubscribe = subscribeToUserChannels((updated) => {
      setChannels((prev) => {
        const exists = prev.find((c) => c.id === updated.id);
        if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
        return [updated, ...prev].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    });

    unsubscribeChannelsRef.current = unsubscribe;
    return () => unsubscribe();
  }, [bookingIdFromUrl]);

  // ── Load messages when channel changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedChannel) return;

    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const ok = await hasChannelAccess(selectedChannel!.id);
        if (!ok) { console.error('[VC] no channel access'); return; }
        const msgs = await getChannelMessages(selectedChannel!.id, 100);
        setMessages(msgs);
      } catch (err) {
        console.error('[VC] load messages error:', err);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();

    // Real-time subscription — deduplicate against optimistic messages
    const unsub = subscribeToChannelMessages(selectedChannel.id, (incoming) => {
      setMessages((prev) => {
        // Replace a matching optimistic placeholder with the real server row
        const optimisticIdx = prev.findIndex(
          (m) =>
            m.id.startsWith('optimistic-') &&
            m.sender_id === incoming.sender_id &&
            m.content === incoming.content
        );
        if (optimisticIdx !== -1) {
          const next = [...prev];
          next[optimisticIdx] = incoming;
          return next;
        }
        // Skip exact ID duplicate (shouldn't happen, but guard anyway)
        if (prev.find((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });

    unsubscribeMessagesRef.current = unsub;
    return () => unsub();
  }, [selectedChannel?.id]);

  // ── Broadcast channel for video-call ringing ──────────────────────────────
  useEffect(() => {
    if (!selectedChannel || !user) return;

    // Tear down any previous broadcast channel
    if (broadcastRef.current) {
      broadcastRef.current.unsubscribe();
      broadcastRef.current = null;
    }

    const ch = supabase
      .channel(`vc-ring:${selectedChannel.id}`)
      .on('broadcast', { event: 'call:ring' }, (payload) => {
        // Ignore our own broadcast echo
        if (payload.payload?.callerId === user.id) return;

        const callerName = payload.payload?.callerName ?? 'Dein Gesprächspartner';
        setRingState({ visible: true, callerName });
        playRingTone();

        // Auto-dismiss after 20 s
        if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
        ringTimerRef.current = setTimeout(() => {
          setRingState({ visible: false, callerName: '' });
        }, 20_000);
      })
      .subscribe();

    broadcastRef.current = ch;

    return () => {
      ch.unsubscribe();
      broadcastRef.current = null;
      if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    };
  }, [selectedChannel?.id, user?.id]);

  // ── Auto-scroll to latest message ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Jitsi script loader ───────────────────────────────────────────────────
  useEffect(() => {
    if (!showVideo) return;

    const scriptId = 'jitsi-meet-external-api';
    if (document.getElementById(scriptId)) { setJitsiReady(true); return; }

    const script      = document.createElement('script');
    script.id         = scriptId;
    script.src        = 'https://meet.jit.si/external_api.js';
    script.async      = true;
    script.onload     = () => setJitsiReady(true);
    script.onerror    = () => console.error('[VC] Failed to load Jitsi');
    document.body.appendChild(script);

    return () => {
      if (document.getElementById(scriptId)) document.body.removeChild(script);
    };
  }, [showVideo]);

  // ── Initialize Jitsi ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!jitsiReady || !showVideo || !jitsiContainerRef.current || !selectedChannel) return;

    const roomName    = (selectedChannel.jitsi_room ?? `moalemi-${selectedChannel.id}`).replace(/-/g, '');
    const displayName = userProfile?.user_metadata?.name || userProfile?.email || 'User';

    // @ts-ignore — Jitsi loaded dynamically
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName,
      parentNode: jitsiContainerRef.current,
      userInfo: { displayName },
      configOverwrite:          { startWithAudioMuted: true, startWithVideoMuted: true },
      interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false },
    });

    return () => api.dispose();
  }, [jitsiReady, showVideo, selectedChannel?.id, userProfile]);

  // ── Send message (optimistic) ─────────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel || !user) return;

    const optimisticId  = `optimistic-${Date.now()}`;
    const senderName    = userProfile?.user_metadata?.name || userProfile?.email?.split('@')[0] || 'You';
    const optimisticMsg: Message = {
      id:          optimisticId,
      channel_id:  selectedChannel.id,
      sender_id:   user.id,
      sender_name: senderName,
      content:     newMessage.trim(),
      type:        'text',
      metadata:    {},
      is_pinned:   false,
      created_at:  new Date().toISOString(),
    };

    // Show immediately
    setMessages((prev) => [...prev, optimisticMsg]);
    const msgText = newMessage;
    setNewMessage('');

    try {
      await sendMessage(selectedChannel.id, msgText);
    } catch (err) {
      console.error('[VC] send message error:', err);
      // Rollback optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setNewMessage(msgText);
    }
  };

  // ── Toggle video + broadcast ring ─────────────────────────────────────────
  const handleToggleVideo = useCallback(async () => {
    if (!showVideo && selectedChannel && user && broadcastRef.current) {
      // Ring the other participant before opening video
      try {
        const callerName = userProfile?.user_metadata?.name || userProfile?.email || 'User';
        await broadcastRef.current.send({
          type:    'broadcast',
          event:   'call:ring',
          payload: { callerId: user.id, callerName, channelId: selectedChannel.id },
        });
      } catch (err) {
        console.warn('[VC] broadcast ring error:', err);
      }
    }
    setShowVideo((v) => !v);
  }, [showVideo, selectedChannel?.id, user?.id, userProfile]);

  // ── Answer ring ───────────────────────────────────────────────────────────
  const handleAnswerCall = () => {
    setRingState({ visible: false, callerName: '' });
    if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    setShowVideo(true);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut().catch(console.error);
    navigate('/');
  };

  // ── Auth guard ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] to-[#2F7A5B]">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-white mb-4 text-lg">You must be logged in to access the classroom</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#DCA842] text-[#1A1A2E] rounded-lg font-semibold hover:bg-[#C49535] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex bg-gradient-to-br from-[#1A1A2E] via-[#1e1e3a] to-[#2a2a4a] text-white">

      {/* ── Sidebar ── */}
      <div className="w-72 bg-[#16162a] border-r border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Virtual Classroom</h1>
              <p className="text-sm text-white/70 mt-1">{userProfile?.email}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader className="w-5 h-5 animate-spin mx-auto text-[#2F7A5B]" />
            </div>
          ) : channels.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-white/50">No channels yet</p>
              <p className="text-xs text-white/30 mt-2">Book a lesson with a teacher to create a channel</p>
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedChannel?.id === channel.id
                      ? 'bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-lg shadow-[#2F7A5B]/25'
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{channel.name}</p>
                      <p className="text-xs text-white/50">
                        {new Date(channel.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User section */}
        <div className="border-t border-white/10 p-4 bg-[#12122a]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col relative">

        {/* ── Incoming call notification overlay ── */}
        {ringState.visible && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#1A1A2E] border border-[#2F7A5B]/50 rounded-2xl px-6 py-4 shadow-2xl shadow-black/60 backdrop-blur-md">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center animate-pulse flex-shrink-0">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">📹 Eingehender Videoanruf</p>
              <p className="text-white/60 text-xs">{ringState.callerName} ruft an…</p>
            </div>
            <button
              onClick={handleAnswerCall}
              className="px-4 py-2 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white text-xs font-bold rounded-xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all"
            >
              Annehmen
            </button>
            <button
              onClick={() => {
                setRingState({ visible: false, callerName: '' });
                if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
              }}
              className="px-4 py-2 bg-white/10 text-white/70 text-xs font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedChannel ? (
          <>
            {/* Top bar */}
            <div className="border-b border-white/10 p-5 flex items-center justify-between bg-[#1A1A2E]/60 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedChannel.name}</h2>
                <p className="text-sm text-white/50">
                  Started {new Date(selectedChannel.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleToggleVideo}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                  showVideo
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
                    : 'bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] hover:from-[#3a8b6a] hover:to-[#4a9b7a] shadow-[#2F7A5B]/25'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm">{showVideo ? 'End Video' : 'Start Video'}</span>
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Jitsi */}
              {showVideo && (
                <div className="w-1/2 border-r border-white/10 bg-black/30">
                  <div ref={jitsiContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
                </div>
              )}

              {/* Chat */}
              <div className={`flex flex-col ${showVideo ? 'w-1/2' : 'w-full'}`}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#16162a]/30">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader className="w-6 h-6 animate-spin text-[#2F7A5B]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-white/40">
                      <MessageCircle className="w-12 h-12 mb-4 text-white/20" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender_id === user?.id;
                      const isBot = msg.type === 'bot';
                      const isPending = msg.id.startsWith('optimistic-');
                      return (
                        <div key={msg.id} className={`flex ${isBot ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'}`}>
                          {isBot ? (
                            <div className="max-w-sm px-5 py-3 rounded-2xl text-xs bg-[#2F7A5B]/20 border border-[#2F7A5B]/30 text-white/70 text-center">
                              {msg.content}
                            </div>
                          ) : (
                            <div
                              className={`max-w-xs px-5 py-3 rounded-2xl text-sm shadow-lg transition-opacity ${
                                isPending ? 'opacity-60' : 'opacity-100'
                              } ${
                                isOwn
                                  ? 'bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-br-sm'
                                  : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/10'
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <p className={`text-xs mt-1.5 ${isOwn ? 'text-white/60' : 'text-white/40'}`}>
                                {isPending
                                  ? 'Sending…'
                                  : new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="border-t border-white/10 p-5 bg-[#1A1A2E]/60 backdrop-blur-md">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message…"
                      className="flex-1 bg-white/10 border border-white/15 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#2F7A5B] focus:bg-white/15 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] hover:from-[#3a8b6a] hover:to-[#4a9b7a] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center bg-gradient-to-br from-[#1A1A2E] to-[#16162a]">
            <div className="p-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2F7A5B]/20 to-[#3a8b6a]/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-[#2F7A5B]" />
              </div>
              <p className="text-2xl text-white/70 mb-3 font-medium">No channel selected</p>
              <p className="text-white/40">Book a lesson to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
