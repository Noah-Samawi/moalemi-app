import { createContext, useContext, type ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  userName: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading, isAuthenticated, userName, signIn, signUp, signOut } = useSupabaseAuth();

  // Legacy compat: login/logout are no-ops since Supabase handles state
  const login = (_name: string) => {
    // Auth state is managed by Supabase; this is kept for interface compat
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAuthenticated, userName, signIn, signUp, signOut, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}