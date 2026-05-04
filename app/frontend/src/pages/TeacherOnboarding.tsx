import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { GraduationCap } from "lucide-react";

export default function TeacherOnboarding() {
  const { t } = useLanguage();
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
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="w-8 h-8 text-[#2F7A5B]" />
          <h1 className="text-3xl font-bold text-[#1A1A2E]">{t("onboarding.title")}</h1>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 rounded-lg text-[#2F7A5B] font-medium">
            {t("onboarding.success")}
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
                />
              </div>
            </div>
          </div>

          {/* Bio Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.bioAr")}</label>
                <textarea
                  value={form.bioAr}
                  onChange={(e) => handleChange("bioAr", e.target.value)}
                  rows={3}
                  dir="rtl"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.bioEn")}</label>
                <textarea
                  value={form.bioEn}
                  onChange={(e) => handleChange("bioEn", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("onboarding.bioDe")}</label>
                <textarea
                  value={form.bioDe}
                  onChange={(e) => handleChange("bioDe", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B] focus:border-transparent resize-none"
                  required
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
              />
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton type="submit" className="w-full py-3">
              {t("onboarding.submit")}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}