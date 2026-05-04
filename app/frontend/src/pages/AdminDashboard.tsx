import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { teachers as initialTeachers } from "@/data/mockData";
import type { Teacher } from "@/data/mockData";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { ShieldX, Trash2, Check, X } from "lucide-react";

export default function AdminDashboard() {
  const { t, lang, userName } = useLanguage();
  const [teacherList, setTeacherList] = useState<Teacher[]>(initialTeachers);
  const [announcement, setAnnouncement] = useState("");

  if (!userName?.toLowerCase().includes("noah")) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t("admin.accessDenied")}</h1>
          <p className="text-gray-500">{t("admin.accessDeniedDesc")}</p>
        </div>
      </div>
    );
  }

  const togglePro = (id: number) => {
    setTeacherList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_pro: !t.is_pro } : t))
    );
  };

  const toggleFeatured = (id: number) => {
    setTeacherList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
    );
  };

  const deleteTeacher = (id: number) => {
    setTeacherList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8">{t("admin.title")}</h1>

        {/* Teachers Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#1A1A2E]">{t("admin.teachers")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-start">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">{t("admin.teachers")}</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">{t("admin.pro")}</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">{t("admin.featured")}</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">{t("admin.approve")}</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">{t("admin.delete")}</th>
                </tr>
              </thead>
              <tbody>
                {teacherList.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={teacher.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-medium text-[#1A1A2E]">{teacher.name[lang]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePro(teacher.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          teacher.is_pro
                            ? "bg-[#DCA842] text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {teacher.is_pro ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {t("admin.pro")}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(teacher.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          teacher.featured
                            ? "bg-[#2F7A5B] text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {teacher.featured ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {t("admin.featured")}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <SecondaryButton
                        className="text-xs px-3 py-1"
                        onClick={() => {}}
                      >
                        <Check className="w-3 h-3 me-1" />
                        {t("admin.approve")}
                      </SecondaryButton>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteTeacher(teacher.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        {t("admin.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4">{t("admin.announcements")}</h2>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
            placeholder={t("admin.announcements")}
          />
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={() => {}}>
              {t("admin.save")}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}