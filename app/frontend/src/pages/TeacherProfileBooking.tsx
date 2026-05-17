import { useState } from "react";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import StarRating from "@/components/atoms/StarRating";
import BadgeTag from "@/components/atoms/BadgeTag";
import BookingFormGroup from "@/components/molecules/BookingFormGroup";
import BookingConfirmationToast from "@/components/molecules/BookingConfirmationToast";
import AuthModal from "@/components/organisms/AuthModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { Teacher } from "@/data/mockData";

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
  const { isAuthenticated } = useAuth();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);

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

        {/* Booking Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">{t("booking.title")}</h2>
            <BookingFormGroup
              hourlyRate={teacher.hourlyRate}
              onConfirm={handleBookingConfirm}
            />
          </div>
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
