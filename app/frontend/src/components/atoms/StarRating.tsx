import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export default function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-[#DCA842] text-[#DCA842]" />
      ))}
      {hasHalf && (
        <div className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-300 absolute" />
          <div className="overflow-hidden w-2 h-4">
            <Star className="w-4 h-4 fill-[#DCA842] text-[#DCA842]" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="text-sm text-gray-600 mr-1">({rating})</span>
    </div>
  );
}