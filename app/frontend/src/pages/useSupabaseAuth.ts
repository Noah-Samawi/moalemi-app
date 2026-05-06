import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  onAuthStateChange,
  getUserName,
  getSession,
} from '@/services/authService';

interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userName: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate session immediately on mount (critical for page refresh)
    getSession()
      .then(({ user, session }) => {
        setUser(user);
        setSession(session);
      })
      .catch((err) => console.error('[Auth] getSession error:', err))
      .finally(() => setLoading(false));

    // Also subscribe to future auth state changes
    const { data: { subscription } } = onAuthStateChange((user, session) => {
      setUser(user);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await authSignIn(email, password);
    } catch (err) {
      console.error('[Auth] signIn error:', err);
      throw err;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      await authSignUp(email, password, name);
    } catch (err) {
      console.error('[Auth] signUp error:', err);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
    } catch (err) {
      console.error('[Auth] signOut error:', err);
      throw err;
    }
  }, []);

  const userName = getUserName(user);
  const isAuthenticated = !!user;

  return { user, session, loading, userName, isAuthenticated, signIn, signUp, signOut };
}
