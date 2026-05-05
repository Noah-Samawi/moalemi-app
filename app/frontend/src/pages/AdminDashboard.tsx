import { useState, useEffect } from "react";
import Navbar from "@/components/organisms/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { teachers as mockTeachers } from "@/data/mockData";
import type { Teacher } from "@/data/mockData";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { ShieldX, Trash2, Check, X } from "lucide-react";
import {
  getTeachers,
  getAllTeachers,
  updateTeacher,
  deleteTeacher as deleteTeacherService,
} from "@/services/teacherService";
import type { TeacherRow } from "@/services/teacherService";

function mapRowToTeacher(row: TeacherRow, index: number): Teacher {
  return {
    id: index,
    name: { ar: row.name_ar, en: row.name_en, de: row.name_de },
    avatar: row.avatar || "",
    specializations: row.specializations || [],
    experience: row.experience,
    hourlyRate: row.hourly_rate,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    bio: { ar: row.bio_ar || "", en: row.bio_en || "", de: row.bio_de || "" },
    services: row.services || [],
    is_pro: row.is_pro,
    featured: row.featured,
  };
}

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const { userName, user } = useAuth();
  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>([]);
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const rows = await getAllTeachers();
        if (!cancelled) {
          setTeacherRows(rows);
          if (rows.length > 0) {
            setTeacherList(rows.map((r, i) => mapRowToTeacher(r, i)));
          } else {
            setTeacherList(mockTeachers);
          }
        }
      } catch {
        if (!cancelled) {
          setTeacherList(mockTeachers);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  if (user?.email !== "noahalsamawi688@gmail.com") {
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

  const findRowId = (index: number): string | null => {
    return teacherRows[index]?.id ?? null;
  };

  const togglePro = async (index: number) => {
    const rowId = findRowId(index);
    const teacher = teacherList[index];
    if (!teacher) return;

    const newValue = !teacher.is_pro;
    setTeacherList((prev) =>
      prev.map((t, i) => (i === index ? { ...t, is_pro: newValue } : t))
    );

    if (rowId) {
      try {
        await updateTeacher(rowId, { is_pro: newValue });
        setToast("Teacher updated");
      } catch {
        setTeacherList((prev) =>
          prev.map((t, i) => (i === index ? { ...t, is_pro: !newValue } : t))
        );
      }
    }
  };

  const toggleFeatured = async (index: number) => {
    const rowId = findRowId(index);
    const teacher = teacherList[index];
    if (!teacher) return;

    const newValue = !teacher.featured;
    setTeacherList((prev) =>
      prev.map((t, i) => (i === index ? { ...t, featured: newValue } : t))
    );

    if (rowId) {
      try {
        await updateTeacher(rowId, { featured: newValue });
        setToast("Teacher updated");
      } catch {
        setTeacherList((prev) =>
          prev.map((t, i) => (i === index ? { ...t, featured: !newValue } : t))
        );
      }
    }
  };

  const approveTeacher = async (index: number) => {
    const rowId = findRowId(index);
    if (!rowId) return;

    try {
      await updateTeacher(rowId, { approved: true });
      setToast("Teacher approved");
      setTeacherRows((prev) =>
        prev.map((r, i) => (i === index ? { ...r, approved: true } : r))
      );
    } catch {
      // silently fail
    }
  };

  const deleteTeacher = async (index: number) => {
    const rowId = findRowId(index);
    if (!rowId) {
      setTeacherList((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await deleteTeacherService(rowId);
      setToast("Teacher deleted");
      setTeacherList((prev) => prev.filter((_, i) => i !== index));
      setTeacherRows((prev) => prev.filter((_, i) => i !== index));
    } catch {
      // silently fail
    }
  };

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
                {teacherList.map((teacher, index) => (
                  <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={teacher.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-medium text-[#1A1A2E]">{teacher.name[lang]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePro(index)}
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
                        onClick={() => toggleFeatured(index)}
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
                        onClick={() => approveTeacher(index)}
                      >
                        <Check className="w-3 h-3 me-1" />
                        {t("admin.approve")}
                      </SecondaryButton>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteTeacher(index)}
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
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2F7A5B] text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}