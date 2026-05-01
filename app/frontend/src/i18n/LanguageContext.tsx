import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Language } from "./translations";

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const dir = lang === "ar" ? "rtl" : "ltr";

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

  const login = useCallback((name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserName(null);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLanguage, setLanguage, isAuthenticated, userName, login, logout }}>
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