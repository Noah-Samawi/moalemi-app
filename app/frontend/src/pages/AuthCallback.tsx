import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Supabase OAuth redirect-callback page.
 * The browser lands here after a provider redirect (Google, GitHub…).
 * supabase-js v2 with detectSessionInUrl:true handles the token exchange
 * automatically — we just need to wait for the session and redirect.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase JS v2 automatically exchanges the code in the URL for a session.
    // We only need to read the resulting session state.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[AuthCallback] getSession error:', error.message);
        navigate(`/auth/error?msg=${encodeURIComponent(error.message)}`, { replace: true });
        return;
      }
      if (session) {
        navigate('/dashboard', { replace: true });
      } else {
        // Session not yet ready — listen once for the auth state change
        const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
          listener.subscription.unsubscribe();
          if (newSession) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/auth/error?msg=Kein+Sitzungstoken+gefunden', { replace: true });
          }
        });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-[3px] border-[#2F7A5B]/20 border-t-[#2F7A5B] rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm font-medium">Authentifizierung wird verarbeitet…</p>
      </div>
    </div>
  );
}
