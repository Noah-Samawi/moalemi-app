import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, History, Settings, ChevronRight, ChevronLeft,
  LayoutDashboard, GraduationCap, Video, MessageCircle,
  Sparkles, Brain,
} from "lucide-react";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getProfile } from "@/services/profileService";
import { usePresence } from "@/hooks/usePresence";
import { getTeacherByUserId } from "@/services/teacherService";
import { supabase } from "@/lib/supabase";

interface DashboardSidebarProps {
  userName?: string;
  userAvatar?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// Admin email (same guard used throughout the app)
const ADMIN_EMAIL = "noahalsamawi688@gmail.com";

export default function DashboardSidebar({
  userName: userNameProp,
  userAvatar = "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
  activeTab = "upcoming",
  onTabChange,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { t, dir } = useLanguage();
  const { userName: contextUserName, user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<{
    name: string | null;
    avatar_url: string | null;
    last_seen: string | null;
  } | null>(null);
  const [isTeacherOrAdmin, setIsTeacherOrAdmin] = useState(false);

  usePresence();

  useEffect(() => {
    if (!user?.id) return;
    getProfile(user.id).then(setProfile).catch(() => {});

    // Check if teacher or admin
    const checkRole = async () => {
      if (user.email === ADMIN_EMAIL) { setIsTeacherOrAdmin(true); return; }
      try {
        const t = await getTeacherByUserId(user.id);
        setIsTeacherOrAdmin(!!t);
      } catch { /* ignore */ }
    };
    checkRole();

    // Subscribe to profile updates for live name/avatar sync
    const channel = supabase
      .channel(`sidebar-profile:${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        (payload) => {
          setProfile((prev) => ({ ...prev, ...(payload.new as typeof prev) }));
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [user?.id]);

  const isOnline = profile?.last_seen
    ? Date.now() - new Date(profile.last_seen).getTime() < 2 * 60 * 1000
    : false;
  const realAvatar  = profile?.avatar_url ?? userAvatar;
  const displayName = profile?.name ?? contextUserName ?? userNameProp ?? t("dashboard.user");

  // ── Core nav items (all users) ──
  const navItems = [
    { id: "upcoming",  label: t("dashboard.upcoming"),                                         icon: BookOpen },
    { id: "history",   label: t("dashboard.history"),                                          icon: History  },
    { id: "classroom", label: t("dashboard.classroom", { defaultValue: "Virtual Classroom" }), icon: Video   },
    { id: "settings",  label: t("dashboard.settings"),                                         icon: Settings },
  ];

  const btnClass = (id: string) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      activeTab === id
        ? "bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-lg shadow-[#2F7A5B]/20"
        : "text-gray-600 hover:bg-[#FDF8F0] hover:text-[#1A1A2E]"
    }`;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white ${dir === "rtl" ? "border-l" : "border-r"} border-gray-100 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ── User profile block ── */}
      <div className={`p-4 border-b border-gray-100 ${collapsed ? "px-3" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarAtom src={realAvatar} alt={displayName} size="sm" />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              } border-2 border-white rounded-full`}
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[#1A1A2E] text-sm truncate">{displayName}</span>
              <span className={`text-xs ${isOnline ? "text-[#2F7A5B]" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === "/" && !activeTab
              ? "bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-lg shadow-[#2F7A5B]/20"
              : "text-gray-600 hover:bg-[#FDF8F0] hover:text-[#1A1A2E]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("dashboard.home", { defaultValue: "Home" })}</span>}
        </Link>

        {/* Core items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={btnClass(item.id)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* ── Separator ── */}
        {!collapsed && (
          <div className="pt-3 pb-1 px-3">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              KI-Tools
            </p>
          </div>
        )}
        {collapsed && <div className="my-1 border-t border-gray-100" />}

        {/* ── AI ASSISTANT (students) ── */}
        <button
          onClick={() => onTabChange?.("ai-assistant")}
          className={btnClass("ai-assistant")}
          title="KI-Assistent"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 text-[#DCA842]" />
          {!collapsed && (
            <span className="flex items-center gap-2">
              KI-Assistent
              <span className="ml-auto text-[10px] bg-[#DCA842]/15 text-[#DCA842] font-bold px-1.5 py-0.5 rounded-full">
                NEU
              </span>
            </span>
          )}
        </button>

        {/* ── AI KNOWLEDGE BASE (admin + teachers only) ── */}
        {isTeacherOrAdmin && (
          <button
            onClick={() => onTabChange?.("ai-knowledge")}
            className={btnClass("ai-knowledge")}
            title="KI-Wissensbasis"
          >
            <Brain className="w-5 h-5 flex-shrink-0 text-[#7C3AED]" />
            {!collapsed && (
              <span className="flex items-center gap-2">
                KI-Wissensbasis
                <span className="ml-auto text-[10px] bg-[#7C3AED]/15 text-[#7C3AED] font-bold px-1.5 py-0.5 rounded-full">
                  ADMIN
                </span>
              </span>
            )}
          </button>
        )}
      </nav>

      {/* ── Mein Chat quick-access ── */}
      <div className={`px-3 pt-2 pb-1 ${collapsed ? "px-2" : ""}`}>
        <Link
          to="/classroom"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-md shadow-[#2F7A5B]/25
            hover:from-[#3a8b6a] hover:to-[#4a9b7a]"
          title="Mein Chat"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <span className="truncate">
              Mein Chat{" "}
              <span className="opacity-75 text-xs font-normal">(Ustadh Ahmad)</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Quick links footer ── */}
      <div className={`p-3 border-t border-gray-100 space-y-2 ${collapsed ? "px-2" : ""}`}>
        {!collapsed && (
          <div className="px-3 py-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {t("dashboard.quickLinks", { defaultValue: "Quick Links" })}
            </p>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-[#FDF8F0] hover:text-[#1A1A2E] transition-all duration-200"
        >
          <GraduationCap className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>{t("nav.teachers")}</span>}
        </Link>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-gray-100 text-gray-400 hover:text-[#2F7A5B] hover:bg-[#FDF8F0] flex items-center justify-center transition-colors duration-200"
      >
        {collapsed ? (
          dir === "rtl" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
        ) : (
          dir === "rtl" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
