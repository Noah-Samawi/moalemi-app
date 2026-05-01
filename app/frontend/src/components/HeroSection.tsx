import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-green/10 via-cream to-gold/10 py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-green/20">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-green font-arabic">وصفات أصيلة من قلب المطبخ العربي</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-dark mb-6 font-arabic leading-tight">
            اكتشف أشهى
            <span className="text-green"> الوصفات </span>
            العربية
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 mb-8 font-arabic max-w-2xl mx-auto leading-relaxed">
            مجموعة مختارة من أطباق المطبخ العربي التقليدي، من الكبسة السعودية إلى الكنافة النابلسية، مع خطوات سهلة ومقادير دقيقة
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center font-arabic">
            <Button
              size="lg"
              className="bg-green hover:bg-green/90 text-white font-arabic text-base px-8"
              onClick={() => document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' })}
            >
              تصفّح الوصفات
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green/30 text-green hover:bg-green/5 font-arabic text-base px-8"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              التصنيفات
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-12 font-arabic">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-dark">+50</div>
              <div className="text-sm text-foreground/60">وصفة عربية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-dark">7</div>
              <div className="text-sm text-foreground/60">تصنيفات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-dark">+20</div>
              <div className="text-sm text-foreground/60">دولة عربية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;