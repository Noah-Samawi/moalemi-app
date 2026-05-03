import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import TeacherProfileBooking from "@/components/organisms/TeacherProfileBooking";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLiveData } from "@/context/LiveDataContext";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { teachers, loadingTeachers } = useLiveData();

  const teacher = useMemo(
    () => teachers.find((teacher) => teacher.id === id),
    [teachers, id]
  );

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      {loadingTeachers && !teacher ? (
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 rounded-3xl bg-white p-10 shadow-sm">
            <div className="h-10 w-1/3 rounded-full bg-slate-200" />
            <div className="h-80 rounded-3xl bg-slate-200" />
          </div>
        </div>
      ) : !teacher ? (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-4">{t("profile.notFound")}</h1>
          <p className="text-gray-600">{t("profile.notFoundDesc")}</p>
        </div>
      ) : (
        <TeacherProfileBooking teacher={teacher} />
      )}
    </div>
  );
}
