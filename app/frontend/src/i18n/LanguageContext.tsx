import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, type Language } from "./translations";
import { supabase } from "@/lib/supabase";

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
  isAdmin: boolean;
  login: (name: string, email?: string | null) => void;
  logout: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const dir = lang === "ar" ? "rtl" : "ltr";
  const isAdmin = userEmail === "noah.alsamawi@gmail.com";

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "de" : "ar"));
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
  }, []);

  const login = useCallback((name: string, email?: string | null) => {
    setIsAuthenticated(true);
    setUserName(name);
    setUserEmail(email ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase logout failed", error);
    } finally {
      setIsAuthenticated(false);
      setUserName(null);
      setUserEmail(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        const user = session?.user;

        if (user) {
          setIsAuthenticated(true);
          setUserName(user.email ?? user.user_metadata?.full_name ?? null);
          setUserEmail(user.email ?? null);
        }
      } catch (error) {
        console.error("Failed to initialize Supabase auth session", error);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        setIsAuthenticated(true);
        setUserName(user.email ?? user.user_metadata?.full_name ?? null);
        setUserEmail(user.email ?? null);
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        setUserEmail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir,
        t,
        toggleLanguage,
        setLanguage,
        isAuthenticated,
        userName,
        userEmail,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}