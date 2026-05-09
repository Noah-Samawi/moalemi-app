import StarRating from "@/components/atoms/StarRating";
import type { ReviewRow } from "@/services/reviewService";
import { useLanguage } from "@/i18n/LanguageContext";

interface ReviewCardProps {
  review: ReviewRow;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { lang, t } = useLanguage();
  const locale = lang === "ar" ? "ar-EG" : lang === "de" ? "de-DE" : "en-US";
  const dateStr = new Date(review.created_at).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#2F7A5B]/10 flex items-center justify-center text-[#2F7A5B] font-bold text-sm">
              {review.user_name?.charAt(0) || "?"}
            </div>
            <span className="font-medium text-[#1A1A2E] text-sm">
              {review.user_name || t("review.userFallback")}
            </span>
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{dateStr}</span>
      </div>
      {review.comment && (
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}