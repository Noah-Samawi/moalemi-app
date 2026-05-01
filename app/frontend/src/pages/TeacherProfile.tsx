import { useParams } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import TeacherProfileBooking from "@/components/organisms/TeacherProfileBooking";
import { useLanguage } from "@/i18n/LanguageContext";
import { teachers } from "@/data/mockData";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const teacher = teachers.find((t) => t.id === Number(id));
  const { t } = useLanguage();

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
      <TeacherProfileBooking teacher={teacher} />
    </div>
  );
}