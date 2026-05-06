import { useState } from "react";
import StarRating from "@/components/atoms/StarRating";
import { useLanguage } from "@/i18n/LanguageContext";
import { createReview } from "@/services/reviewService";

interface ReviewFormProps {
  teacherId: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ teacherId, onSubmitted }: ReviewFormProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(t("review.selectRating"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createReview({
        teacher_id: teacherId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment("");
      onSubmitted();
    } catch (err: any) {
      if (err?.code === "23505") {
        setError(t("review.alreadyReviewed"));
      } else {
        setError(t("review.submitError"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          {t("review.yourRating")}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span
                className={
                  star <= (hoverRating || rating)
                    ? "text-amber-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          {t("review.yourComment")}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("review.commentPlaceholder")}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F7A5B] focus:ring-1 focus:ring-[#2F7A5B] outline-none resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-[#2F7A5B] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[#256b4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {submitting ? t("review.submitting") : t("review.submit")}
      </button>
    </form>
  );
}