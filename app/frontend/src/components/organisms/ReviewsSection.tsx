import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getReviewsByTeacher, getUserReviewForTeacher, type ReviewRow } from "@/services/reviewService";
import ReviewCard from "@/components/molecules/ReviewCard";
import ReviewForm from "@/components/molecules/ReviewForm";
import { supabase } from "@/lib/supabase";

interface ReviewsSectionProps {
  teacherId: string;
  rating: number;
  reviewsCount: number;
}

export default function ReviewsSection({ teacherId, rating, reviewsCount }: ReviewsSectionProps) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [userReview, setUserReview] = useState<ReviewRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const [reviewList, existing] = await Promise.all([
        getReviewsByTeacher(teacherId),
        getUserReviewForTeacher(teacherId),
      ]);
      setReviews(reviewList);
      setUserReview(existing);
      if (existing) setShowForm(false);
    } catch {
      // silently fail — reviews are non-critical
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitted = () => {
    setShowForm(false);
    fetchReviews();
  };

  const displayRating = rating > 0 ? rating.toFixed(1) : "—";

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#1A1A2E]">{displayRating}</p>
          <p className="text-xs text-gray-500 mt-1">
            {reviewsCount} {t("review.reviews")}
          </p>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Write review button / form */}
      {isAuthenticated && !userReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-[#2F7A5B]/30 rounded-lg py-3 text-[#2F7A5B] font-medium text-sm hover:bg-[#2F7A5B]/5 transition-colors"
        >
          {t("review.writeReview")}
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-[#1A1A2E] mb-3">{t("review.writeReview")}</h4>
          <ReviewForm teacherId={teacherId} onSubmitted={handleSubmitted} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t("review.cancel")}
          </button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#2F7A5B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">{t("review.noReviews")}</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}