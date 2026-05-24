import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string; // = auth.uid()
  name: string | null;
  avatar_url: string | null;
  phone: string | null;
  last_seen: string | null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, phone, last_seen")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" });
  if (error) throw error;
}

export async function uploadProfileAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}

/** Call this on mount and on a 30s heartbeat so other users can see "Online" status. */
export async function updateLastSeen(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, last_seen: new Date().toISOString() }, { onConflict: "id" });
  if (error) console.warn("[Presence] updateLastSeen error:", error);
}

/** Returns true if the user's last_seen is within the last 2 minutes. */
export async function getOnlineStatus(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("last_seen")
    .eq("id", userId)
    .maybeSingle();
  if (!data?.last_seen) return false;
  const lastSeen = new Date(data.last_seen).getTime();
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  return lastSeen > twoMinutesAgo;
}
