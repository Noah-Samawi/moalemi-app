import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import StarRating from "@/components/atoms/StarRating";
import BadgeTag from "@/components/atoms/BadgeTag";
import BookingFormGroup from "@/components/molecules/BookingFormGroup";
import BookingConfirmationToast from "@/components/molecules/BookingConfirmationToast";
import AuthModal from "@/components/organisms/AuthModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Teacher } from "@/data/mockData";
import { LayoutDashboard, Eye, Star, Loader, MessageSquare, User, Send } from "lucide-react";
import {
  getReviewsByTeacherId,
  submitReview,
  getUserReviewForTeacher,
  type Review,
} from "@/services/reviewsService";

interface TeacherProfileBookingProps {
  teacher: Teacher;
  /** Called after a review is submitted so the parent can refetch */
  onReviewSubmitted?: () => void;
}

interface BookingConfirmation {
  teacherName: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  userName: string;
  totalPrice: number;
}

// ── Inline star picker ──────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform duration-100 hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              n <= (hovered || value)
                ? "fill-[#DCA842] text-[#DCA842]"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TeacherProfileBooking({
  teacher,
  onReviewSubmitted,
}: TeacherProfileBookingProps) {
  const { t, lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // ── Booking state ──
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authWarning, setAuthWarning]     = useState(false);

  // ── Reviews state ──
  const [reviews,      setReviews]      = useState<Review[]>([]);
  const [loadingRevs,  setLoadingRevs]  = useState(true);
  const [userExisting, setUserExisting] = useState<Review | null>(null);
  const [newRating,    setNewRating]    = useState(5);
  const [newComment,   setNewComment]   = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [submitErr,    setSubmitErr]    = useState("");
  const [submitOk,     setSubmitOk]     = useState(false);
  // Live counts (overrides static teacher props after reviews load)
  const [liveCount,    setLiveCount]    = useState<number | null>(null);
  const [liveRating,   setLiveRating]   = useState<number | null>(null);

  // Guard: teacher viewing their own profile
  const isOwnProfile =
    !!user?.id && !!teacher.user_id && user.id === teacher.user_id;

  // ── Load reviews ──────────────────────────────────────────────────────────
  const loadReviews = async () => {
    if (!teacher.id) return;
    setLoadingRevs(true);
    try {
      const rows = await getReviewsByTeacherId(teacher.id);
      setReviews(rows);
      setLiveCount(rows.length);
      if (rows.length > 0) {
        const avg = rows.reduce((s, r) => s + r.rating, 0) / rows.length;
        setLiveRating(Math.round(avg * 10) / 10);
      } else {
        setLiveRating(0);
      }
      if (user?.id) {
        const mine = rows.find((r) => r.user_id === user.id) ?? null;
        setUserExisting(mine);
      }
    } catch (err) {
      console.error("[reviews] load error:", err);
    } finally {
      setLoadingRevs(false);
    }
  };

  useEffect(() => { loadReviews(); }, [teacher.id, user?.id]);

  // ── Submit review ─────────────────────────────────────────────────────────
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !teacher.id) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      await submitReview(teacher.id, user.id, newRating, newComment.trim());
      setSubmitOk(true);
      setNewComment("");
      setNewRating(5);
      await loadReviews();
      onReviewSubmitted?.();
      setTimeout(() => setSubmitOk(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      setSubmitErr(
        msg.includes("duplicate") || msg.includes("unique")
          ? "Du hast diesen Lehrer bereits bewertet."
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Booking handlers ──────────────────────────────────────────────────────
  const handleBookingConfirm = (data: {
    selectedDate: string;
    startTime: string;
    endTime: string;
    userName: string;
    notes: string;
    totalPrice: number;
  }) => {
    if (!isAuthenticated) { setAuthWarning(true); setAuthModalOpen(true); return; }
    setAuthWarning(false);
    setConfirmation({
      teacherName: teacher.name[lang],
      selectedDate: data.selectedDate,
      startTime: data.startTime,
      endTime: data.endTime,
      userName: data.userName,
      totalPrice: data.totalPrice,
    });
  };

  const displayCount  = liveCount  ?? teacher.reviewsCount;
  const displayRating = liveRating ?? teacher.rating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Bio / Info section ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            <AvatarAtom src={teacher.avatar} alt={teacher.name[lang]} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">{teacher.name[lang]}</h1>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={displayRating} />
                <span className="text-sm font-semibold text-[#DCA842]">{displayRating}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {displayCount}{" "}
                {displayCount === 1 ? t("teacher.review") : t("teacher.reviews")}
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2">
            {teacher.specializations.map((spec) => (
              <BadgeTag key={spec.ar} text={spec[lang]} variant="green" />
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="font-semibold">
              {teacher.experience} {t("teacher.yearsExp")}
            </span>
            <span className="font-bold text-[#2F7A5B] text-lg">
              ${teacher.hourlyRate}{t("profile.perHour")}
            </span>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">{t("profile.about")}</h2>
            <p className="text-gray-600 leading-relaxed">{teacher.bio[lang]}</p>
          </div>

          {/* Services */}
          {teacher.services.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">{t("profile.services")}</h2>
              <div className="space-y-3">
                {teacher.services.map((service) => (
                  <div
                    key={service.name.ar}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#2F7A5B]/20 transition-colors"
                  >
                    <BadgeTag text={service.name[lang]} variant="gold" />
                    <p className="text-sm text-gray-600 mt-2">{service.description[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Reviews section ─────────────────────────────────────────── */}
          <div id="reviews" className="pt-2">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2F7A5B]" />
              {t("profile.reviews", { defaultValue: "Bewertungen" })}
              {!loadingRevs && (
                <span className="ml-1 text-sm font-normal text-gray-400">
                  ({displayCount})
                </span>
              )}
            </h2>

            {/* ── Submit form (authenticated, not own profile) ── */}
            {isAuthenticated && !isOwnProfile && !userExisting && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-[#FDF8F0] border border-[#DCA842]/20 rounded-2xl p-5 mb-6 space-y-4"
              >
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  {t("profile.writeReview", { defaultValue: "Bewertung schreiben" })}
                </p>
                <StarPicker value={newRating} onChange={setNewRating} />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder={t("profile.reviewPlaceholder", {
                    defaultValue: "Teile deine Erfahrung mit diesem Lehrer…",
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/30 focus:border-[#2F7A5B] transition-all resize-none"
                />
                {submitErr && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                    {submitErr}
                  </p>
                )}
                {submitOk && (
                  <p className="text-xs text-[#2F7A5B] bg-[#2F7A5B]/10 px-3 py-2 rounded-lg border border-[#2F7A5B]/20 font-medium">
                    ✓ Bewertung erfolgreich abgegeben!
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting || newRating === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl text-sm font-semibold hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 disabled:opacity-50"
                >
                  {submitting
                    ? <Loader className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  {t("profile.submitReview", { defaultValue: "Bewertung abgeben" })}
                </button>
              </form>
            )}

            {/* Already reviewed notice */}
            {userExisting && (
              <div className="mb-4 px-4 py-3 bg-[#2F7A5B]/8 border border-[#2F7A5B]/20 rounded-xl text-sm text-[#2F7A5B] font-medium">
                ✓ Du hast diesen Lehrer bereits bewertet.
              </div>
            )}

            {/* Not logged in — invite to login */}
            {!isAuthenticated && !isOwnProfile && (
              <div className="mb-4 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-[#2F7A5B] font-semibold hover:underline"
                >
                  Anmelden
                </button>{" "}
                um eine Bewertung zu schreiben.
              </div>
            )}

            {/* Review list */}
            {loadingRevs ? (
              <div className="flex justify-center py-8">
                <Loader className="w-5 h-5 animate-spin text-[#2F7A5B]" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                <p className="text-sm">
                  {t("profile.noReviews", { defaultValue: "Noch keine Bewertungen." })}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1A1A2E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {review.reviewer_name
                          ? review.reviewer_name.charAt(0).toUpperCase()
                          : <User className="w-4 h-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[#1A1A2E]">
                            {review.reviewer_name ?? "Anonym"}
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`w-3.5 h-3.5 ${
                                  n <= review.rating
                                    ? "fill-[#DCA842] text-[#DCA842]"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Booking / Preview-Mode Section ── */}
        <div className="lg:col-span-2">
          {isOwnProfile ? (
            <div className="bg-white rounded-2xl border-2 border-[#2F7A5B]/20 shadow-sm p-6 sticky top-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2F7A5B]/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-[#2F7A5B]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A2E] text-sm">Vorschau-Modus</p>
                  <p className="text-xs text-gray-500">Das ist dein eigenes Profil.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                So sehen Schüler dein öffentliches Profil. Die Buchungsfunktion ist für dich ausgeblendet.
              </p>
              <button
                onClick={() => navigate("/dashboard?tab=settings")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl font-semibold text-sm hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                Profil bearbeiten
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">{t("booking.title")}</h2>
              <BookingFormGroup
                hourlyRate={teacher.hourlyRate}
                onConfirm={handleBookingConfirm}
              />
            </div>
          )}
        </div>
      </div>

      {/* Auth Warning */}
      {authWarning && !isAuthenticated && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-5 py-3 shadow-lg flex items-center gap-2">
          <span className="font-semibold">{t("auth.loginRequiredTitle")}:</span>
          <span>{t("auth.loginRequired")}</span>
        </div>
      )}

      <BookingConfirmationToast
        open={confirmation !== null}
        onClose={() => setConfirmation(null)}
        data={confirmation}
      />

      <AuthModal
        open={authModalOpen}
        onOpenChange={(open) => { setAuthModalOpen(open); if (!open) setAuthWarning(false); }}
        onAuthSuccess={(_name) => { setAuthModalOpen(false); setAuthWarning(false); }}
      />
    </div>
  );
}
