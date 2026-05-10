import { supabase } from '@/lib/supabase';

// Interfaces
export interface Channel {
  id: string;
  booking_id: string;
  student_id: string;
  teacher_id: string;
  name: string;
  pinned_goals: string | null;
  jitsi_room: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string | null;
  sender_name: string | null;
  content: string;
  type: 'text' | 'file' | 'system' | 'bot';
  metadata: Record<string, any>;
  is_pinned: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

// ============================================
// CHANNEL OPERATIONS
// ============================================

/**
 * Get all channels for the current user (both as student and teacher)
 */
export async function getUserChannels(): Promise<Channel[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw userError || new Error('User not authenticated');

  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Channel[]) || [];
}

/**
 * Get a specific channel by ID
 */
export async function getChannelById(channelId: string): Promise<Channel | null> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', channelId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return (data as Channel) || null;
}

/**
 * Get channel by booking ID
 */
export async function getChannelByBookingId(bookingId: string): Promise<Channel | null> {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return (data as Channel) || null;
}

// ============================================
// MESSAGE OPERATIONS
// ============================================

/**
 * Get all messages for a channel (paginated)
 */
export async function getChannelMessages(
  channelId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Message[]) || [];
}

/**
 * Send a message to a channel
 */
export async function sendMessage(channelId: string, content: string): Promise<Message> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw userError || new Error('User not authenticated');

  const senderName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        channel_id: channelId,
        sender_id: user.id,
        sender_name: senderName,
        content: content.trim(),
        type: 'text',
        metadata: {},
        is_pinned: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Delete a message (only own messages)
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', messageId);

  if (error) throw error;
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to messages in a channel in real-time
 */
export function subscribeToChannelMessages(
  channelId: string,
  callback: (message: Message) => void
) {
  const subscription = supabase
    .channel(`messages:${channelId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      },
      (payload: any) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to channel updates (when messages are added)
 */
export function subscribeToChannelUpdates(
  channelId: string,
  callback: (channel: Channel) => void
) {
  const subscription = supabase
    .channel(`channel:${channelId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'channels',
        filter: `id=eq.${channelId}`,
      },
      (payload: any) => {
        callback(payload.new as Channel);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to all user channels for real-time updates
 */
export function subscribeToUserChannels(
  callback: (channel: Channel) => void
) {
  const subscription = supabase
    .channel('user-channels')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'channels',
      },
      (payload: any) => {
        callback(payload.new as Channel);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'channels',
      },
      (payload: any) => {
        callback(payload.new as Channel);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user profile information
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  return {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  };
}

/**
 * Get channel participants (student and teacher info)
 */
export async function getChannelParticipants(channelId: string) {
  const channel = await getChannelById(channelId);
  if (!channel) return null;

  // Get student info
  const { data: studentData } = await supabase.auth.admin.getUserById(
    channel.student_id
  );

  // Get teacher info
  const { data: teacherData } = await supabase.auth.admin.getUserById(
    channel.teacher_id
  );

  return {
    student: studentData?.user,
    teacher: teacherData?.user,
  };
}

/**
 * Check if user has access to a channel
 */
export async function hasChannelAccess(channelId: string): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return false;

  const channel = await getChannelById(channelId);
  if (!channel) return false;

  return user.id === channel.student_id || user.id === channel.teacher_id;
}
