import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import TeacherProfile from "@/pages/TeacherProfile";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { LiveDataProvider } from "@/context/LiveDataContext";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";

function AppContent() {
  const { dir } = useLanguage();

  return (
    <div dir={dir} className={dir === "rtl" ? "font-arabic" : "font-sans"}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/teacher/:id" element={<TeacherProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <LiveDataProvider>
          <AppContent />
          <Toaster />
        </LiveDataProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}