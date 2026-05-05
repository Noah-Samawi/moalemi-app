import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Globe, LogOut, LayoutDashboard, Shield, GraduationCap, Check } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Language } from "@/i18n/translations";
import AuthModal from "@/components/organisms/AuthModal";

const languages: { code: Language; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [langDropdown, setLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, t, setLanguage } = useLanguage();
  const { isAuthenticated, userName, user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogin = () => {
    setAuthTab("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthTab("register");
    setAuthOpen(true);
  };

  const handleAuthSuccess = (_name: string) => {
    // Auth state is managed by Supabase via AuthContext
  };

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = isAuthenticated && (userName?.toLowerCase().includes("noah") || user?.email?.includes("noah"));

  const brandName = (
    <>
      {lang === "ar" ? (
        <>
          <span className="text-[#2F7A5B]">معلم</span>
          <span className="text-[#DCA842]">ي</span>
        </>
      ) : lang === "en" ? (
        <>
          <span className="text-[#2F7A5B]">My </span>
          <span className="text-[#DCA842]">Teacher</span>
        </>
      ) : (
        <>
          <span className="text-[#2F7A5B]">Mein </span>
          <span className="text-[#DCA842]">Lehrer</span>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">
              {brandName}
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors"
              >
                {t("nav.home")}
              </Link>
              <a
                href="/#teachers"
                className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors"
              >
                {t("nav.teachers")}
              </a>
              <Link
                to="/onboarding"
                className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors flex items-center gap-1"
              >
                <GraduationCap className="w-4 h-4" />
                {t("nav.onboarding")}
              </Link>

              {/* Language Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#2F7A5B] hover:bg-[#2F7A5B]/5 transition-all text-sm font-medium text-[#1A1A2E]"
                >
                  <Globe className="w-4 h-4" />
                  {languages.find((l) => l.code === lang)?.label}
                </button>
                {langDropdown && (
                  <div className="absolute top-full mt-1 end-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangDropdown(false); }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={lang === l.code ? "text-[#2F7A5B] font-semibold" : "text-[#1A1A2E]"}>
                          {l.label}
                        </span>
                        {lang === l.code && <Check className="w-4 h-4 text-[#2F7A5B]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-[#DCA842] font-medium hover:underline"
                >
                  <Shield className="w-4 h-4" />
                  {t("nav.admin")}
                </Link>
              )}

              {isAuthenticated && userName ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-[#2F7A5B] font-medium hover:underline"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t("nav.dashboard")}
                  </Link>
                  <span className="text-sm text-gray-600">{userName}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SecondaryButton onClick={openLogin}>
                    {t("nav.login")}
                  </SecondaryButton>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 text-sm font-semibold text-[#2F7A5B] hover:text-[#25694A] transition-colors"
                  >
                    {t("nav.register")}
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="p-2 text-[#1A1A2E] hover:text-[#2F7A5B] transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </button>
                {langDropdown && (
                  <div className="absolute top-full mt-1 end-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangDropdown(false); }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <span className={lang === l.code ? "text-[#2F7A5B] font-semibold" : "text-[#1A1A2E]"}>
                          {l.label}
                        </span>
                        {lang === l.code && <Check className="w-4 h-4 text-[#2F7A5B]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-[#1A1A2E]">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-6 mt-8">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium text-lg"
                        onClick={() => setOpen(false)}
                      >
                        {t("nav.home")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="/#teachers"
                        className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium text-lg"
                        onClick={() => setOpen(false)}
                      >
                        {t("nav.teachers")}
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/onboarding"
                        className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium text-lg flex items-center gap-1"
                        onClick={() => setOpen(false)}
                      >
                        <GraduationCap className="w-4 h-4" />
                        {t("nav.onboarding")}
                      </Link>
                    </SheetClose>

                    {isAdmin && (
                      <SheetClose asChild>
                        <Link
                          to="/admin"
                          className="text-[#DCA842] font-medium text-lg flex items-center gap-1"
                          onClick={() => setOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          {t("nav.admin")}
                        </Link>
                      </SheetClose>
                    )}

                    {isAuthenticated && userName ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            className="text-[#2F7A5B] font-medium text-lg"
                            onClick={() => setOpen(false)}
                          >
                            {t("nav.dashboard")}
                          </Link>
                        </SheetClose>
                        <button
                          onClick={() => { handleLogout(); setOpen(false); }}
                          className="text-red-500 font-medium text-lg text-start"
                        >
                          {t("nav.logout")}
                        </button>
                      </>
                    ) : (
                      <>
                        <SecondaryButton
                          className="w-full"
                          onClick={() => { setOpen(false); openLogin(); }}
                        >
                          {t("nav.login")}
                        </SecondaryButton>
                        <button
                          onClick={() => { setOpen(false); openRegister(); }}
                          className="text-[#2F7A5B] font-semibold text-lg"
                        >
                          {t("nav.register")}
                        </button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}