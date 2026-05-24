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
  getAllTeachers,
  updateTeacher,
  deleteTeacher as deleteTeacherService,
} from "@/services/teacherService";
import type { TeacherRow } from "@/services/teacherService";
import { createContentItem, getLatestContentByType } from "@/services/contentService";
import { deleteTeacherImage, extractStoragePathFromUrl, uploadTeacherImage } from "@/services/storageService";

const ADMIN_EMAIL = "noahalsamawi688@gmail.com";

function mapRowToTeacher(row: TeacherRow, index: number): Teacher {
  return {
    id: row.id,
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
  const { user, loading: authLoading } = useAuth();
  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>([]);
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [announcementAr, setAnnouncementAr] = useState("");
  const [featureTitleAr, setFeatureTitleAr] = useState("");
  const [featureTitleDe, setFeatureTitleDe] = useState("");
  const [featureBodyAr, setFeatureBodyAr] = useState("");
  const [featureBodyDe, setFeatureBodyDe] = useState("");
  const [adTitleAr, setAdTitleAr] = useState("");
  const [adTitleDe, setAdTitleDe] = useState("");
  const [adBodyAr, setAdBodyAr] = useState("");
  const [adBodyDe, setAdBodyDe] = useState("");
  const [savingContent, setSavingContent] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    // Don't fetch until auth is resolved
    if (authLoading) return;
    if (user?.email !== ADMIN_EMAIL) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function fetchAll() {
      try {
        const [rows, announcementItem, featureItem, adItem] = await Promise.all([
          getAllTeachers(),
          getLatestContentByType("announcement").catch(() => null),
          getLatestContentByType("feature").catch(() => null),
          getLatestContentByType("advertising").catch(() => null),
        ]);
        if (!cancelled) {
          setTeacherRows(rows);
          setTeacherList(rows.length > 0 ? rows.map((r, i) => mapRowToTeacher(r, i)) : mockTeachers);
          setAnnouncement(announcementItem?.body_de || "");
          setAnnouncementAr(announcementItem?.body_ar || "");
          setFeatureTitleAr(featureItem?.title_ar || "");
          setFeatureTitleDe(featureItem?.title_de || "");
          setFeatureBodyAr(featureItem?.body_ar || "");
          setFeatureBodyDe(featureItem?.body_de || "");
          setAdTitleAr(adItem?.title_ar || "");
          setAdTitleDe(adItem?.title_de || "");
          setAdBodyAr(adItem?.body_ar || "");
          setAdBodyDe(adItem?.body_de || "");
        }
      } catch (err) {
        console.error('[Admin] fetchAll error:', err);
        if (!cancelled) setTeacherList(mockTeachers);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  // Show spinner while auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8956C]"></div>
        </div>
      </div>
    );
  }

  // Only block AFTER auth has loaded
  if (user?.email !== ADMIN_EMAIL) {
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

  // Gibt die UUID des Lehrers zurück — prüft teacherRows zuerst, dann teacherList als Fallback
  const findRowId = (index: number): string | null => {
    const fromRow = teacherRows[index]?.id;
    if (fromRow) return fromRow;
    const fromList = teacherList[index]?.id;
    if (fromList) return String(fromList);
    return null;
  };

  const togglePro = async (index: number) => {
    const rowId = findRowId(index);
    const teacher = teacherList[index];
    if (!teacher) return;
    const newValue = !teacher.is_pro;
    setTeacherList((prev) => prev.map((t, i) => (i === index ? { ...t, is_pro: newValue } : t)));
    if (rowId) {
      try {
        await updateTeacher(rowId, { is_pro: newValue });
        showToast(t("admin.teacherUpdated"));
      } catch (err) {
        console.error('[Admin] togglePro error:', err);
        setTeacherList((prev) => prev.map((t, i) => (i === index ? { ...t, is_pro: !newValue } : t)));
      }
    }
  };

  const toggleFeatured = async (index: number) => {
    const rowId = findRowId(index);
    const teacher = teacherList[index];
    if (!teacher) return;
    const newValue = !teacher.featured;
    setTeacherList((prev) => prev.map((t, i) => (i === index ? { ...t, featured: newValue } : t)));
    if (rowId) {
      try {
        await updateTeacher(rowId, { featured: newValue });
        showToast(t("admin.teacherUpdated"));
      } catch (err) {
        console.error('[Admin] toggleFeatured error:', err);
        setTeacherList((prev) => prev.map((t, i) => (i === index ? { ...t, featured: !newValue } : t)));
      }
    }
  };

  const approveTeacher = async (index: number) => {
    const rowId = findRowId(index);
    if (!rowId) return;
    try {
      await updateTeacher(rowId, { approved: true });
      showToast(t("admin.teacherApproved"));
      setTeacherRows((prev) => prev.map((r, i) => (i === index ? { ...r, approved: true } : r)));
    } catch (err) {
      console.error('[Admin] approveTeacher error:', err);
      showToast(t("admin.actionFailed"));
    }
  };

  // Accepts the UUID directly (from teacherRows[index].id) so no integer mock-ID
  // can ever be forwarded to Supabase as a uuid parameter.
  const deleteTeacher = async (rowUuid: string, index: number) => {
    const confirmed = window.confirm('Lehrer wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.');
    if (!confirmed) return;
    try {
      await deleteTeacherService(rowUuid);
      showToast(t("admin.teacherDeleted"));
      setTeacherList((prev) => prev.filter((_, i) => i !== index));
      setTeacherRows((prev) => prev.filter((_, i) => i !== index));
    } catch (err: unknown) {
      console.error('[Admin] deleteTeacher error:', err);
      const msg = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'message' in err)
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);
      showToast(`Fehler beim Löschen: ${msg}`);
    }
  };

  const saveAnnouncement = async () => {
    setSavingContent(true);
    try {
      await createContentItem({
        content_type: "announcement",
        body_ar: announcementAr || announcement,
        body_de: announcement || announcementAr,
        created_by: user?.email ?? ADMIN_EMAIL,
      });
      showToast(t("admin.contentSaved"));
    } catch (err) {
      console.error("[Admin] saveAnnouncement error:", err);
      showToast(t("admin.actionFailed"));
    } finally {
      setSavingContent(false);
    }
  };

  const saveFeature = async () => {
    setSavingContent(true);
    try {
      await createContentItem({
        content_type: "feature",
        title_ar: featureTitleAr,
        title_de: featureTitleDe,
        body_ar: featureBodyAr,
        body_de: featureBodyDe,
        created_by: user?.email ?? ADMIN_EMAIL,
      });
      showToast(t("admin.contentSaved"));
    } catch (err) {
      console.error("[Admin] saveFeature error:", err);
      showToast(t("admin.actionFailed"));
    } finally {
      setSavingContent(false);
    }
  };

  const saveAd = async () => {
    setSavingContent(true);
    try {
      await createContentItem({
        content_type: "advertising",
        title_ar: adTitleAr,
        title_de: adTitleDe,
        body_ar: adBodyAr,
        body_de: adBodyDe,
        created_by: user?.email ?? ADMIN_EMAIL,
      });
      showToast(t("admin.contentSaved"));
    } catch (err) {
      console.error("[Admin] saveAd error:", err);
      showToast(t("admin.actionFailed"));
    } finally {
      setSavingContent(false);
    }
  };

  const uploadTeacherAvatar = async (index: number, file?: File) => {
    if (!file) return;
    const row = teacherRows[index];
    if (!row) return;
    try {
      const ownerId = row.user_id || row.id;
      const { publicUrl } = await uploadTeacherImage({ userId: ownerId, file, type: "avatar" });
      await updateTeacher(row.id, { avatar: publicUrl });
      setTeacherList((prev) => prev.map((item, i) => (i === index ? { ...item, avatar: publicUrl } : item)));
      setTeacherRows((prev) => prev.map((item, i) => (i === index ? { ...item, avatar: publicUrl } : item)));
      showToast(t("admin.teacherUpdated"));
    } catch (err) {
      console.error("[Admin] uploadTeacherAvatar error:", err);
      showToast(t("admin.actionFailed"));
    }
  };

  const deleteTeacherAvatar = async (index: number) => {
    const row = teacherRows[index];
    if (!row || !row.avatar) return;
    try {
      const path = extractStoragePathFromUrl(row.avatar);
      if (path) await deleteTeacherImage(path);
      await updateTeacher(row.id, { avatar: null });
      setTeacherList((prev) => prev.map((item, i) => (i === index ? { ...item, avatar: "" } : item)));
      setTeacherRows((prev) => prev.map((item, i) => (i === index ? { ...item, avatar: null } : item)));
      showToast(t("admin.teacherUpdated"));
    } catch (err) {
      console.error("[Admin] deleteTeacherAvatar error:", err);
      showToast(t("admin.actionFailed"));
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
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[#1A1A2E]">{teacher.name[lang]}</span>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-[#2F7A5B] cursor-pointer hover:underline">
                              {t("admin.uploadImage")}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => uploadTeacherAvatar(index, e.target.files?.[0])}
                              />
                            </label>
                            <button
                              onClick={() => deleteTeacherAvatar(index)}
                              className="text-xs text-red-600 hover:underline"
                              type="button"
                            >
                              {t("admin.deleteImage")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePro(index)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          teacher.is_pro ? "bg-[#DCA842] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                          teacher.featured ? "bg-[#2F7A5B] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {teacher.featured ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {t("admin.featured")}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <SecondaryButton className="text-xs px-3 py-1" onClick={() => approveTeacher(index)}>
                        <Check className="w-3 h-3 me-1" />
                        {t("admin.approve")}
                      </SecondaryButton>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          // Read the UUID from teacherRows — never from teacherList,
                          // which may contain mock teachers with integer IDs.
                          const rowUuid = teacherRows[index]?.id;
                          if (!rowUuid) {
                            showToast('Fehler: Lehrer-ID nicht gefunden. Nur gespeicherte Datenbankeinträge können gelöscht werden.');
                            return;
                          }
                          deleteTeacher(rowUuid, index);
                        }}
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4">{t("admin.announcements")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              value={announcementAr}
              onChange={(e) => setAnnouncementAr(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              placeholder={t("admin.announcementAr")}
              dir="rtl"
            />
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              placeholder={t("admin.announcementDe")}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={saveAnnouncement} disabled={savingContent}>
              {t("admin.save")}
            </PrimaryButton>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4">{t("admin.features")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
              placeholder={t("admin.titleAr")}
              value={featureTitleAr}
              onChange={(e) => setFeatureTitleAr(e.target.value)}
              dir="rtl"
            />
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
              placeholder={t("admin.titleDe")}
              value={featureTitleDe}
              onChange={(e) => setFeatureTitleDe(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              rows={3}
              placeholder={t("admin.bodyAr")}
              value={featureBodyAr}
              onChange={(e) => setFeatureBodyAr(e.target.value)}
              dir="rtl"
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              rows={3}
              placeholder={t("admin.bodyDe")}
              value={featureBodyDe}
              onChange={(e) => setFeatureBodyDe(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={saveFeature} disabled={savingContent}>
              {t("admin.save")}
            </PrimaryButton>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4">{t("admin.advertising")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
              placeholder={t("admin.titleAr")}
              value={adTitleAr}
              onChange={(e) => setAdTitleAr(e.target.value)}
              dir="rtl"
            />
            <input
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
              placeholder={t("admin.titleDe")}
              value={adTitleDe}
              onChange={(e) => setAdTitleDe(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              rows={3}
              placeholder={t("admin.bodyAr")}
              value={adBodyAr}
              onChange={(e) => setAdBodyAr(e.target.value)}
              dir="rtl"
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
              rows={3}
              placeholder={t("admin.bodyDe")}
              value={adBodyDe}
              onChange={(e) => setAdBodyDe(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={saveAd} disabled={savingContent}>
              {t("admin.save")}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2F7A5B] text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
