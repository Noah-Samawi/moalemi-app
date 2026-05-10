import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import {
  getUserChannels,
  getChannelById,
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
import { Send, LogOut, MessageCircle, Video, Loader } from 'lucide-react';

export default function VirtualClassroom() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [jitsiReady, setJitsiReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const unsubscribeChannelsRef = useRef<(() => void) | null>(null);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    }
    loadProfile();
  }, []);

  // Load channels
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        const userChannels = await getUserChannels();
        setChannels(userChannels);
        if (userChannels.length > 0 && !selectedChannel) {
          setSelectedChannel(userChannels[0]);
        }
      } catch (err) {
        console.error('Error loading channels:', err);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();

    // Subscribe to new channels
    const unsubscribe = subscribeToUserChannels((newChannel) => {
      setChannels((prev) => {
        const exists = prev.find((c) => c.id === newChannel.id);
        if (exists) {
          return prev.map((c) => (c.id === newChannel.id ? newChannel : c));
        }
        return [...prev, newChannel].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    });

    unsubscribeChannelsRef.current = unsubscribe;
    return () => unsubscribe();
  }, []);

  // Load messages for selected channel
  useEffect(() => {
    if (!selectedChannel) return;

    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const hasAccess = await hasChannelAccess(selectedChannel.id);
        if (!hasAccess) {
          console.error('No access to this channel');
          return;
        }

        const channelMessages = await getChannelMessages(selectedChannel.id, 100);
        setMessages(channelMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadMessages();

    // Subscribe to new messages
    const unsubscribe = subscribeToChannelMessages(selectedChannel.id, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    unsubscribeMessagesRef.current = unsubscribe;
    return () => unsubscribe();
  }, [selectedChannel]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load Jitsi Script
  useEffect(() => {
    if (!showVideo) return;

    const scriptId = 'jitsi-meet-external-api';
    if (document.getElementById(scriptId)) {
      setJitsiReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setJitsiReady(true);
    script.onerror = () => console.error('Failed to load Jitsi');
    document.body.appendChild(script);

    return () => {
      if (document.getElementById(scriptId)) {
        document.body.removeChild(script);
      }
    };
  }, [showVideo]);

  // Initialize Jitsi
  useEffect(() => {
    if (!jitsiReady || !showVideo || !jitsiContainerRef.current || !selectedChannel) {
      return;
    }

    const roomName = `moalemi-${selectedChannel.id}`.replace(/-/g, '');
    const displayName = userProfile?.user_metadata?.name || userProfile?.email || 'User';

    // @ts-ignore - Jitsi is loaded dynamically
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName,
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    });

    return () => {
      api.dispose();
    };
  }, [jitsiReady, showVideo, selectedChannel, userProfile]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    try {
      await sendMessage(selectedChannel.id, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-white mb-4">You must be logged in to access the classroom</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-900 text-white">
      {/* Sidebar - Channels List */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-blue-400">Virtual Classroom</h1>
          <p className="text-sm text-slate-400 mt-1">{userProfile?.email}</p>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : channels.length === 0 ? (
            <div className="p-4">
              <p className="text-sm text-slate-400">No channels yet</p>
              <p className="text-xs text-slate-500 mt-2">
                Book a lesson with a teacher to create a channel
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{channel.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {new Date(channel.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="border-t border-slate-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Top Bar */}
            <div className="border-b border-slate-700 p-4 flex items-center justify-between bg-slate-800">
              <div>
                <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
                <p className="text-sm text-slate-400">
                  Started {new Date(selectedChannel.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showVideo
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm">
                  {showVideo ? 'End Video' : 'Start Video'}
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
              {/* Video Area */}
              {showVideo && (
                <div className="w-1/2 border-r border-slate-700 bg-slate-800">
                  <div
                    ref={jitsiContainerRef}
                    className="w-full h-full"
                    style={{ minHeight: '400px' }}
                  />
                </div>
              )}

              {/* Chat Area */}
              <div
                className={`flex flex-col ${showVideo ? 'w-1/2' : 'w-full'}`}
              >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader className="w-6 h-6 animate-spin text-blue-400" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-slate-400">
                      <MessageCircle className="w-12 h-12 mb-4 text-slate-600" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isOwn = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-100'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn
                                  ? 'text-blue-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-slate-700 p-4 bg-slate-800">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-xl text-slate-300 mb-2">No channel selected</p>
              <p className="text-slate-400">
                Book a lesson to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
