import { categories } from '@/data/recipes';
import { UtensilsCrossed, Soup, Salad, Cookie, Sandwich, Bread } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  all: <UtensilsCrossed className="h-4 w-4" />,
  main: <Sandwich className="h-4 w-4" />,
  appetizer: <Cookie className="h-4 w-4" />,
  dessert: <Cookie className="h-4 w-4" />,
  soup: <Soup className="h-4 w-4" />,
  salad: <Salad className="h-4 w-4" />,
  bread: <Bread className="h-4 w-4" />,
};

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div id="categories" className="py-8">
      <h2 className="text-2xl font-bold text-dark mb-6 font-arabic">التصنيفات</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium font-arabic transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-green text-white shadow-md shadow-green/25 scale-105'
                : 'bg-white text-foreground/70 border border-border hover:border-green/30 hover:text-green hover:bg-green/5'
            }`}
          >
            {categoryIcons[category.id]}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;