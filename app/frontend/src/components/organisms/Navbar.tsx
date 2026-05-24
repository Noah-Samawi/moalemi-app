import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, LayoutDashboard, Shield, GraduationCap, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Language } from "@/i18n/translations";
import AuthModal from "@/components/organisms/AuthModal";
import { getTeacherByUserId } from "@/services/teacherService";

const languages: { code: Language; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isTeacher, setIsTeacher] = useState(false);
  const { lang, t, setLanguage, dir } = useLanguage();
  const { isAuthenticated, userName, user, logout } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function loadTeacherStatus() {
      if (!user?.id) {
        setIsTeacher(false);
        return;
      }
      try {
        const teacher = await getTeacherByUserId(user.id);
        if (!cancelled) setIsTeacher(!!teacher);
      } catch {
        if (!cancelled) setIsTeacher(false);
      }
    }
    loadTeacherStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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

  const isAdmin = user?.email === "noahalsamawi688@gmail.com";

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
              {!isTeacher && (
                <Link
                  to="/onboarding"
                  className="text-[#1A1A2E] hover:text-[#2F7A5B] font-medium transition-colors flex items-center gap-1"
                >
                  <GraduationCap className="w-4 h-4" />
                  {t("nav.onboarding")}
                </Link>
              )}

              <div className="text-sm text-gray-600 flex items-center gap-2">
                {languages.map((item, index) => (
                  <span key={item.code} className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={lang === item.code ? "text-[#2F7A5B] font-semibold" : "hover:text-[#2F7A5B]"}
                    >
                      {item.label}
                    </button>
                    {index < languages.length - 1 && <span className="text-gray-300">|</span>}
                  </span>
                ))}
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

                  {/* ── Bell notification ── */}
                  <button
                    className="relative p-1.5 text-gray-500 hover:text-[#2F7A5B] transition-colors duration-200 rounded-lg hover:bg-[#2F7A5B]/10"
                    title="Benachrichtigungen"
                    aria-label="Benachrichtigungen"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  </button>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full bg-[#2F7A5B] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 select-none"
                      title={userName}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{userName}</span>
                  </div>
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
              <div className="text-xs text-gray-600 flex items-center gap-1">
                {languages.map((item, index) => (
                  <span key={item.code} className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={lang === item.code ? "text-[#2F7A5B] font-semibold" : ""}
                    >
                      {item.label}
                    </button>
                    {index < languages.length - 1 && <span className="text-gray-300">|</span>}
                  </span>
                ))}
              </div>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-[#1A1A2E]">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-64">
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
                    {!isTeacher && (
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
                    )}

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