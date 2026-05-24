import { useState } from "react";
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
import { LayoutDashboard, Eye } from "lucide-react";

interface TeacherProfileBookingProps {
  teacher: Teacher;
}

interface BookingConfirmation {
  teacherName: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  userName: string;
  totalPrice: number;
}

export default function TeacherProfileBooking({ teacher }: TeacherProfileBookingProps) {
  const { t, lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);

  // Guard: the logged-in user is viewing their own teacher profile
  const isOwnProfile =
    !!user?.id &&
    !!teacher.user_id &&
    user.id === teacher.user_id;

  const handleBookingConfirm = (data: {
    selectedDate: string;
    startTime: string;
    endTime: string;
    userName: string;
    notes: string;
    totalPrice: number;
  }) => {
    if (!isAuthenticated) {
      setAuthWarning(true);
      setAuthModalOpen(true);
      return;
    }
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

  const handleAuthSuccess = (_name: string) => {
    setAuthModalOpen(false);
    setAuthWarning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Bio Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start gap-6">
            <AvatarAtom src={teacher.avatar} alt={teacher.name[lang]} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">{teacher.name[lang]}</h1>
              <StarRating rating={teacher.rating} />
              <p className="text-sm text-gray-500 mt-1">{teacher.reviewsCount} {t("teacher.reviews")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {teacher.specializations.map((spec) => (
              <BadgeTag key={spec.ar} text={spec[lang]} variant="green" />
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="font-semibold">{teacher.experience} {t("teacher.yearsExp")}</span>
            <span className="font-bold text-[#2F7A5B] text-lg">${teacher.hourlyRate}{t("profile.perHour")}</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">{t("profile.about")}</h2>
            <p className="text-gray-600 leading-relaxed">{teacher.bio[lang]}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">{t("profile.services")}</h2>
            <div className="space-y-4">
              {teacher.services.map((service) => (
                <div
                  key={service.name.ar}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeTag text={service.name[lang]} variant="gold" />
                  </div>
                  <p className="text-sm text-gray-600">{service.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking / Preview-Mode Section */}
        <div className="lg:col-span-2">
          {isOwnProfile ? (
            /* ── Own-profile preview banner ── */
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
                So sehen Schüler dein öffentliches Profil. Die Buchungsfunktion ist für dich
                ausgeblendet.
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
            /* ── Normal booking form ── */
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

      {/* Auth Warning Banner */}
      {authWarning && !isAuthenticated && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-5 py-3 shadow-lg flex items-center gap-2">
          <span className="font-semibold">{t("auth.loginRequiredTitle")}:</span>
          <span>{t("auth.loginRequired")}</span>
        </div>
      )}

      {/* Booking Confirmation Toast */}
      <BookingConfirmationToast
        open={confirmation !== null}
        onClose={() => setConfirmation(null)}
        data={confirmation}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={(open) => {
          setAuthModalOpen(open);
          if (!open) setAuthWarning(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
