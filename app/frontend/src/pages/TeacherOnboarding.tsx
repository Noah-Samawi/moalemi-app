import { useEffect, useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { GraduationCap, LogIn } from "lucide-react";
import { createTeacher, getTeacherByUserId, updateTeacher } from "@/services/teacherService";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/organisms/AuthModal";
import { deleteTeacherImage, uploadTeacherImage } from "@/services/storageService";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function TeacherOnboarding() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [existingTeacherId, setExistingTeacherId] = useState<string | null>(null);
  const [loadingExistingTeacher, setLoadingExistingTeacher] = useState(true);
  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    nameDe: "",
    bioAr: "",
    bioEn: "",
    bioDe: "",
    specializations: "",
    hourlyRate: "",
    experience: "",
    phone: "",
    contactEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPath, setAvatarPath] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPath, setBannerPath] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadExistingTeacher() {
      if (!user?.id) {
        setLoadingExistingTeacher(false);
        return;
      }
      try {
        const teacher = await getTeacherByUserId(user.id);
        if (!teacher || cancelled) return;
        setExistingTeacherId(teacher.id || null);
        setForm({
          nameAr: teacher.name_ar || "",
          nameEn: teacher.name_en || "",
          nameDe: teacher.name_de || "",
          bioAr: teacher.bio_ar || "",
          bioEn: teacher.bio_en || "",
          bioDe: teacher.bio_de || "",
          specializations: (teacher.specializations || [])
            .map((spec) => spec.en || spec.ar || spec.de)
            .filter(Boolean)
            .join(", "),
          hourlyRate: String(teacher.hourly_rate ?? ""),
          experience: String(teacher.experience ?? ""),
          phone: teacher.phone || "",
          contactEmail: teacher.contact_email || "",
        });
        setAvatarUrl(teacher.avatar || "");
        setBannerUrl(teacher.banner || "");

        // Only navigate if the teacher has a valid id and we're not already in edit mode
        if (!isEditMode && teacher.id) {
          navigate(`/teacher/${teacher.id}?edit=1`, { replace: true });
        }
      } catch (err) {
        console.error("[Onboarding] loadExistingTeacher error:", err);
      } finally {
        if (!cancelled) setLoadingExistingTeacher(false);
      }
    }
    loadExistingTeacher();
    return () => {
      cancelled = true;
    };
  }, [user?.id, isEditMode, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const specs = form.specializations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ ar: s, en: s, de: s }));

      if (existingTeacherId) {
        // UPDATE existing teacher
        await updateTeacher(existingTeacherId, {
          name_ar: form.nameAr,
          name_en: form.nameEn,
          name_de: form.nameDe,
          bio_ar: form.bioAr,
          bio_en: form.bioEn,
          bio_de: form.bioDe,
          specializations: specs,
          hourly_rate: Number(form.hourlyRate),
          experience: Number(form.experience),
          avatar: avatarUrl || null,
          banner: bannerUrl || null,
          phone: form.phone || null,
          contact_email: form.contactEmail || null,
        });
      } else {
        // CREATE new teacher
        const created = await createTeacher({
          user_id: user!.id,
          name_ar: form.nameAr,
          name_en: form.nameEn,
          name_de: form.nameDe,
          bio_ar: form.bioAr,
          bio_en: form.bioEn,
          bio_de: form.bioDe,
          specializations: specs,
          hourly_rate: Number(form.hourlyRate),
          experience: Number(form.experience),
          avatar: avatarUrl || undefined,
          banner: bannerUrl || undefined,
          phone: form.phone || undefined,
          contact_email: form.contactEmail || undefined,
        });

        // created?.id may be empty string when RLS blocks the post-insert SELECT
        // (teacher row was created, but can't be read yet because approved=false).
        // The insert itself succeeded — show success either way.
        if (created?.id) {
          setExistingTeacherId(created.id);
        }
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: unknown) {
      // Show the exact Supabase / JS error so the user (or dev) can debug
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Unbekannter Fehler. Bitte erneut versuchen.";
      console.error("[TeacherOnboarding] handleSubmit error:", err);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (type: "avatar" | "banner", file?: File) => {
    if (!file || !user?.id) return;
    try {
      const { path, publicUrl } = await uploadTeacherImage({ userId: user.id, file, type });
      if (type === "avatar") {
        setAvatarPath(path);
        setAvatarUrl(publicUrl);
      } else {
        setBannerPath(path);
        setBannerUrl(publicUrl);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Image upload failed.");
    }
  };

  const handleImageDelete = async (type: "avatar" | "banner") => {
    try {
      const path = type === "avatar" ? avatarPath : bannerPath;
      if (path) await deleteTeacherImage(path);
      if (type === "avatar") {
        setAvatarPath("");
        setAvatarUrl("");
      } else {
        setBannerPath("");
        setBannerUrl("");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Image delete failed.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <GraduationCap className="w-16 h-16 text-[#2F7A5B] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t("onboarding.title")}</h1>
          <p className="text-gray-500 mb-6">{t("onboarding.loginRequired")}</p>
          <PrimaryButton onClick={() => setAuthModalOpen(true)}>
            <LogIn className="w-4 h-4 me-2" />
            {t("onboarding.loginRegister")}
          </PrimaryButton>
          <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab="register" />
        </div>
      </div>
    );
  }

  if (loadingExistingTeacher) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-500">
          {t("dashboard.settings")}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="w-8 h-8 text-[#2F7A5B]" />
          <h1 className="text-3xl font-bold text-[#1A1A2E]">
            {existingTeacherId ? t("onboarding.editTitle") : t("onboarding.title")}
          </h1>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 rounded-lg text-[#2F7A5B] font-medium">
            {t("onboarding.success")}
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Name Fields */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E] border-b border-gray-100 pb-2">
              {t("onboarding.nameAr").replace("(Arabic)", "")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.nameAr")}</label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                  dir="rtl"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.nameEn")}</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.nameDe")}</label>
                <input
                  type="text"
                  value={form.nameDe}
                  onChange={(e) => handleChange("nameDe", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Bio Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  اكتب نبذة تعريفية عنك
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.bioAr}
                  onChange={(e) => handleChange("bioAr", e.target.value)}
                  rows={5}
                  dir="rtl"
                  placeholder="اكتب نبذة عنك لا تقل عن ٢٠ كلمة تشرح فيها خبرتك، أسلوبك في التدريس، وكيف تساعد الطلاب على تحقيق أهدافهم..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] resize-none transition-all"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Write a brief introduction about yourself
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.bioEn}
                  onChange={(e) => handleChange("bioEn", e.target.value)}
                  rows={5}
                  placeholder="Write at least 20 words describing your teaching experience, methods, and how you can help students succeed..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] resize-none transition-all"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Schreiben Sie eine kurze Biografie über sich
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.bioDe}
                  onChange={(e) => handleChange("bioDe", e.target.value)}
                  rows={5}
                  placeholder="Schreiben Sie mindestens 20 Wörter über Ihre Unterrichtserfahrung, Ihre Methoden und wie Sie Schülern zum Erfolg verhelfen..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] resize-none transition-all"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.specializations")}</label>
            <input
              type="text"
              value={form.specializations}
              onChange={(e) => handleChange("specializations", e.target.value)}
              placeholder="Quran, Tajweed, Arabic"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
              required
              disabled={submitting}
            />
          </div>

          {/* Rate & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.hourlyRate")}</label>
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.experience")}</label>
              <input
                type="number"
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                required
                disabled={submitting}
              />
            </div>
          </div>

          {/* Kontaktdaten */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E] border-b border-gray-100 pb-2">
              Kontaktdaten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+49 123 456 7890"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontakt-E-Mail *</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="kontakt@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("avatar", e.target.files?.[0])}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                disabled={submitting}
              />
              {avatarUrl && (
                <div className="mt-2">
                  <img src={avatarUrl} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover border" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete("avatar")}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Delete avatar
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("banner", e.target.files?.[0])}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                disabled={submitting}
              />
              {bannerUrl && (
                <div className="mt-2">
                  <img src={bannerUrl} alt="Banner preview" className="h-20 w-full rounded-lg object-cover border" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete("banner")}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Delete banner
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" className="w-full py-3" disabled={submitting || !form.phone || !form.contactEmail}>
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {t("onboarding.submit")}
                </span>
              ) : (
                t("onboarding.submit")
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}