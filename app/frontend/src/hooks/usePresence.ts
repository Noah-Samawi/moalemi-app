import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateLastSeen } from "@/services/profileService";

/**
 * Heartbeat hook — call at the top of any authenticated page/layout.
 * Updates the current user's `profiles.last_seen` immediately on mount
 * and then every 30 seconds, enabling live online-status indicators.
 */
export function usePresence() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    updateLastSeen(user.id);
    const interval = setInterval(() => updateLastSeen(user.id), 30_000);
    return () => clearInterval(interval);
  }, [user?.id]);
}
