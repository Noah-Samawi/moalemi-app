import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useLanguage } from "@/i18n/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  const scrollToTeachers = () => {
    const el = document.getElementById("teachers");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full min-h-[500px] flex items-center justify-center text-center"
      style={{
        backgroundImage:
          "url('https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/hero-islamic-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#1A1A2E]/75" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <PrimaryButton onClick={scrollToTeachers} className="text-lg px-8 py-3">
          {t("hero.cta")}
        </PrimaryButton>
      </div>
    </section>
  );
}