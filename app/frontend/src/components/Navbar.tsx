import { useState } from 'react';
import { ChefHat, Search, X, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Navbar = ({ onSearch, searchQuery }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-dark font-arabic">
              مطبخنا
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن وصفة..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pr-10 pl-4 bg-cream/50 border-green/20 focus:border-green font-arabic"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 font-arabic">
            <a href="#recipes" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
              الوصفات
            </a>
            <a href="#categories" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
              التصنيفات
            </a>
            <a href="#about" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
              عن المطبخ
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن وصفة..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pr-10 pl-4 bg-cream/50 border-green/20 focus:border-green font-arabic"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-3">
            <div className="flex flex-col gap-3 font-arabic">
              <a href="#recipes" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
                الوصفات
              </a>
              <a href="#categories" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
                التصنيفات
              </a>
              <a href="#about" className="text-foreground/70 hover:text-green transition-colors text-sm font-medium">
                عن المطبخ
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;