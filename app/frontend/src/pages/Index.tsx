import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import HeroSection from "@/components/organisms/HeroSection";
import FeaturedTeachersGrid from "@/components/organisms/FeaturedTeachersGrid";
import FeatureItem from "@/components/molecules/FeatureItem";
import { features } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { getLatestContentByType } from "@/services/contentService";

export default function Index() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [showTeacherToast, setShowTeacherToast] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [advertisingTitle, setAdvertisingTitle] = useState("");
  const [advertisingBody, setAdvertisingBody] = useState("");
  const [extraFeatureTitle, setExtraFeatureTitle] = useState("");
  const [extraFeatureBody, setExtraFeatureBody] = useState("");

  const handleJoinAsTeacher = () => {
    setShowTeacherToast(true);
    navigate("/onboarding");
  };

  useEffect(() => {
    if (!showTeacherToast) return;
    const timer = setTimeout(() => setShowTeacherToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showTeacherToast]);

  useEffect(() => {
    let cancelled = false;
    async function loadContent() {
      try {
        const [announcementItem, featureItem, adItem] = await Promise.all([
          getLatestContentByType("announcement", lang as any),
          getLatestContentByType("feature", lang as any),
          getLatestContentByType("advertising", lang as any),
        ]);
        if (cancelled) return;
        setAnnouncement(lang === "ar" ? (announcementItem?.body_ar || "") : (announcementItem?.body_de || ""));
        setAdvertisingTitle(lang === "ar" ? (adItem?.title_ar || "") : (adItem?.title_de || ""));
        setAdvertisingBody(lang === "ar" ? (adItem?.body_ar || "") : (adItem?.body_de || ""));
        setExtraFeatureTitle(lang === "ar" ? (featureItem?.title_ar || "") : (featureItem?.title_de || ""));
        setExtraFeatureBody(lang === "ar" ? (featureItem?.body_ar || "") : (featureItem?.body_de || ""));
      } catch (err) {
        console.error("[Index] loadContent error:", err);
      }
    }
    loadContent();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      {announcement && (
        <section className="bg-[#2F7A5B] text-white py-3 px-4 text-center text-sm font-medium">
          {announcement}
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
              />
            ))}
          </div>
          {extraFeatureTitle && (
            <div className="mt-8 bg-[#F7F1E4] border border-[#DCA842]/30 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{extraFeatureTitle}</h3>
              <p className="text-sm text-gray-700">{extraFeatureBody}</p>
            </div>
          )}
        </div>
      </section>

      <FeaturedTeachersGrid />

      {/* ── Premium Hero CTA ── */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#0f2d1f] to-[#1A1A2E]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #2F7A5B 0%, transparent 60%), radial-gradient(circle at 80% 50%, #DCA842 0%, transparent 60%)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-8 left-12 w-32 h-32 rounded-full border border-[#2F7A5B]/20 opacity-40" />
        <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full border border-[#DCA842]/20 opacity-40" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#DCA842]/20 border border-[#DCA842]/30 text-[#DCA842] text-sm font-semibold tracking-wide uppercase">
            {lang === "ar" ? "انضم إلينا" : lang === "en" ? "Join Us" : "Jetzt starten"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white font-bold text-base rounded-2xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-xl shadow-[#2F7A5B]/30 hover:shadow-[#2F7A5B]/50 hover:-translate-y-0.5"
            >
              {lang === "ar" ? "تصفح المعلمين" : lang === "en" ? "Browse Teachers" : "Lehrer entdecken"}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={handleJoinAsTeacher}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-[#DCA842]/60 text-[#DCA842] font-bold text-base rounded-2xl hover:bg-[#DCA842]/10 hover:border-[#DCA842] transition-all duration-300"
            >
              {t("cta.button")}
            </button>
          </div>
          {showTeacherToast && (
            <div className="mt-8 inline-block bg-[#2F7A5B] text-white px-6 py-3 rounded-xl shadow-lg">
              {t("cta.teacherRegisterSuccess")}
            </div>
          )}
        </div>
      </section>

      {advertisingTitle && (
        <section className="bg-white py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-xl border border-[#2F7A5B]/20 bg-[#FDF8F0] p-6">
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">{advertisingTitle}</h3>
              <p className="text-gray-700">{advertisingBody}</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-gray-400 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          {lang === "ar" ? (
            <>
              <span className="text-[#2F7A5B]">معلم</span>
              <span className="text-[#DCA842]">ي</span>
            </>
          ) : lang === "en" ? (
            <>
              <span className="text-[#2F7A5B]">My </span>
              <span className="text-[#DCA842]">Teacher</span>
            </>
          ) : (
            <>
              <span className="text-[#2F7A5B]">Mein </span>
              <span className="text-[#DCA842]">Lehrer</span>
            </>
          )}
          . {t("footer.rights")}
        </p>
      </footer>
    </div>
  );
}