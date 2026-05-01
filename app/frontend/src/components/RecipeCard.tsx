import { Clock, Users, Flame, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-green/10 text-green',
  medium: 'bg-gold/10 text-gold',
  hard: 'bg-red-500/10 text-red-500',
};

const RecipeCard = ({ recipe, onSelect }: RecipeCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-green/5 cursor-pointer bg-white">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.titleAr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge
          className={`absolute top-3 right-3 font-arabic text-xs ${difficultyColor[recipe.difficulty] || 'bg-gray-100 text-gray-600'}`}
        >
          {recipe.difficultyAr}
        </Badge>
        <Badge className="absolute top-3 left-3 font-arabic text-xs bg-white/90 text-green backdrop-blur-sm">
          {recipe.categoryAr}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-dark font-arabic mb-2 group-hover:text-green transition-colors">
          {recipe.titleAr}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/60 font-arabic mb-4 line-clamp-2 leading-relaxed">
          {recipe.descriptionAr}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-foreground/50 font-arabic mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{recipe.servings} أشخاص</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {recipe.tagsAr.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 rounded-full bg-cream text-foreground/60 font-arabic"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View button */}
        <Button
          variant="ghost"
          className="w-full text-green hover:text-green hover:bg-green/5 font-arabic group/btn"
          onClick={() => onSelect(recipe)}
        >
          عرض الوصفة
          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover/btn:-translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;