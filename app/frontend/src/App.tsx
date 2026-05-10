import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import TeacherProfile from "@/pages/TeacherProfile";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TeacherOnboarding from "@/pages/TeacherOnboarding";
import VirtualClassroom from "@/pages/VirtualClassroom";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import "@/index.css";

function AppContent() {
  const { dir } = useLanguage();

  return (
    <div dir={dir} className={dir === "rtl" ? "font-arabic app-shell" : "font-sans app-shell"}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/teacher/:id" element={<TeacherProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/onboarding" element={<TeacherOnboarding />} />
        <Route path="/classroom" element={<VirtualClassroom />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}