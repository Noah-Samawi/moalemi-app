import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import HeroSection from "@/components/organisms/HeroSection";
import FeaturedTeachersGrid from "@/components/organisms/FeaturedTeachersGrid";
import FeatureItem from "@/components/molecules/FeatureItem";
import SecondaryButton from "@/components/atoms/SecondaryButton";
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
          getLatestContentByType("announcement"),
          getLatestContentByType("feature"),
          getLatestContentByType("advertising"),
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

      {/* CTA Banner */}
      <section
        className="relative py-20 text-center"
        style={{
          backgroundImage:
            "url('https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/cta-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1A1A2E]/70" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">{t("cta.title")}</h2>
          <p className="text-lg text-gray-200 mb-8">
            {t("cta.subtitle")}
          </p>
          <SecondaryButton
            className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-[#1A1A2E]"
            onClick={handleJoinAsTeacher}
          >
            {t("cta.button")}
          </SecondaryButton>
          {showTeacherToast && (
            <div className="mt-6 inline-block bg-[#2F7A5B] text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
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