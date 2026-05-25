import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import TeacherProfileBooking from "@/components/organisms/TeacherProfileBooking";
import { useLanguage } from "@/i18n/LanguageContext";
import { teachers as mockTeachers } from "@/data/mockData";
import { getTeacherById } from "@/services/teacherService";
import type { Teacher } from "@/data/mockData";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchTeacher() {
      try {
        const data = await getTeacherById(id);
        if (!cancelled) {
          if (data) {
            setTeacher(data);
          } else {
            const fallback = mockTeachers.find((t) => String(t.id) === String(id) || t.id === Number(id));
            setTeacher(fallback || null);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = mockTeachers.find((t) => String(t.id) === String(id) || t.id === Number(id));
          setTeacher(fallback || null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchTeacher();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8956C]"></div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4">{t("profile.notFound")}</h1>
          <p className="text-gray-600">{t("profile.notFoundDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <TeacherProfileBooking
        teacher={teacher}
        onReviewSubmitted={async () => {
          const refreshed = await getTeacherById(id ?? "").catch(() => null);
          if (refreshed) setTeacher(refreshed);
        }}
      />
    </div>
  );
}