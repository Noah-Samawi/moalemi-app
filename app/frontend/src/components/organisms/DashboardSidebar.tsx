import { useState } from "react";
import { BookOpen, History, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import AvatarAtom from "@/components/atoms/AvatarAtom";

interface DashboardSidebarProps {
  userName?: string;
  userAvatar?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "upcoming", label: "الدروس القادمة", icon: BookOpen },
  { id: "history", label: "سجل الدروس", icon: History },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export default function DashboardSidebar({
  userName = "مستخدم",
  userAvatar = "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
  activeTab = "upcoming",
  onTabChange,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-l border-gray-200 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <AvatarAtom src={userAvatar} alt={userName} size="sm" />
          {!collapsed && (
            <span className="font-semibold text-[#1A1A2E] truncate">{userName}</span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2F7A5B] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center"
      >
        {collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </aside>
  );
}