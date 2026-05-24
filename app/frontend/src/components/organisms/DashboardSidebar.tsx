import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, History, Settings, ChevronRight, ChevronLeft, LayoutDashboard, GraduationCap, Video } from "lucide-react";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";

interface DashboardSidebarProps {
  userName?: string;
  userAvatar?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function DashboardSidebar({
  userName: userNameProp,
  userAvatar = "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
  activeTab = "upcoming",
  onTabChange,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { t, dir } = useLanguage();
  const { userName: contextUserName } = useAuth();
  const location = useLocation();

  const navItems = [
    { id: "upcoming", label: t("dashboard.upcoming"), icon: BookOpen },
    { id: "history", label: t("dashboard.history"), icon: History },
    { id: "classroom", label: t("dashboard.classroom", { defaultValue: "Virtual Classroom" }), icon: Video },
    { id: "settings", label: t("dashboard.settings"), icon: Settings },
  ];

  const displayName = contextUserName || userNameProp || t("dashboard.user");

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white ${dir === "rtl" ? "border-l" : "border-r"} border-gray-100 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`p-4 border-b border-gray-100 ${collapsed ? "px-3" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarAtom src={userAvatar} alt={displayName} size="sm" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[#1A1A2E] text-sm truncate">{displayName}</span>
              <span className="text-xs text-[#2F7A5B]">Online</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === "/dashboard" && !activeTab
              ? "bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-lg shadow-[#2F7A5B]/20"
              : "text-gray-600 hover:bg-[#FDF8F0] hover:text-[#1A1A2E]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("dashboard.home", { defaultValue: "Home" })}</span>}
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white shadow-lg shadow-[#2F7A5B]/20"
                  : "text-gray-600 hover:bg-[#FDF8F0] hover:text-[#1A1A2E]"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`p-3 border-t border-gray-100 space-y-2 ${collapsed ? "px-2" : ""}`}>
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t("dashboard.quickLinks", { defaultValue: "Quick Links" })}</p>
          </div>
        )}
        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-[#FDF8F0] hover:text-[#1A1A2E] transition-all duration-200"
          >
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{t("nav.teachers")}</span>}
          </Link>
        </div>
      </div>

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