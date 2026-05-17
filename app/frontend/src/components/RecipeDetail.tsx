import { ArrowRight, Clock, Flame, Users, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/data/recipes';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-green/10 text-green border-green/20',
  medium: 'bg-gold/10 text-gold border-gold/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const RecipeDetail = ({ recipe, onClose }: RecipeDetailProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        {/* Hero image */}
        <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.titleAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 right-6 left-6">
            <Badge className={`font-arabic text-xs mb-3 ${difficultyColor[recipe.difficulty] || 'bg-gray-100 text-gray-600'}`}>
              {recipe.difficultyAr}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-arabic mb-2">
              {recipe.titleAr}
            </h2>
            <p className="text-white/80 font-arabic text-sm md:text-base">
              {recipe.descriptionAr}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-cream rounded-lg px-4 py-2">
              <Clock className="h-4 w-4 text-green" />
              <div>
                <div className="text-xs text-foreground/50 font-arabic">وقت التحضير</div>
                <div className="text-sm font-bold font-arabic">{recipe.prepTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cream rounded-lg px-4 py-2">
              <Flame className="h-4 w-4 text-gold" />
              <div>
                <div className="text-xs text-foreground/50 font-arabic">وقت الطبخ</div>
                <div className="text-sm font-bold font-arabic">{recipe.cookTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cream rounded-lg px-4 py-2">
              <Users className="h-4 w-4 text-dark" />
              <div>
                <div className="text-xs text-foreground/50 font-arabic">عدد الحصص</div>
                <div className="text-sm font-bold font-arabic">{recipe.servings} أشخاص</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tagsAr.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-green/5 text-green font-arabic border border-green/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dark font-arabic mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-green text-sm">1</span>
              المقادير
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredientsAr.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 hover:bg-cream transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-green shrink-0" />
                  <span className="text-sm font-arabic text-foreground/80">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Steps */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-dark font-arabic mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-sm">2</span>
              خطوات التحضير
            </h3>
            <div className="space-y-4">
              {recipe.stepsAr.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-border/50 hover:border-green/20 transition-colors"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green text-white flex items-center justify-center text-sm font-bold font-arabic">
                    {index + 1}
                  </div>
                  <p className="text-sm font-arabic text-foreground/80 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Back button */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-arabic border-green/30 text-green hover:bg-green/5"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للوصفات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;