import Navbar from "@/components/organisms/Navbar";
import HeroSection from "@/components/organisms/HeroSection";
import FeaturedTeachersGrid from "@/components/organisms/FeaturedTeachersGrid";
import FeatureItem from "@/components/molecules/FeatureItem";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { features } from "@/data/mockData";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">
            لماذا معلمي؟
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
          <h2 className="text-3xl font-bold text-white mb-4">انضم كمعلم</h2>
          <p className="text-lg text-gray-200 mb-8">
            شارك علمك وانضم لفريق المعلمين
          </p>
          <SecondaryButton className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-[#1A1A2E]">
            سجّل كمعلم
          </SecondaryButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-gray-400 py-8 text-center">
        <p className="text-sm">© {new Date().getFullYear()} معلمي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}