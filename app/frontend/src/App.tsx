import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import TeacherProfile from "@/pages/TeacherProfile";
import Dashboard from "@/pages/Dashboard";
import "@/index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div dir="rtl" className="font-arabic">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teacher/:id" element={<TeacherProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}