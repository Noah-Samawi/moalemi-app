import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import StarRating from "@/components/atoms/StarRating";
import BadgeTag from "@/components/atoms/BadgeTag";
import BookingFormGroup from "@/components/molecules/BookingFormGroup";
import BookingConfirmationToast from "@/components/molecules/BookingConfirmationToast";
import AuthModal from "@/components/organisms/AuthModal";
import ReviewsSection from "@/components/organisms/ReviewsSection";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Teacher } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/bookingService";

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
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const { id: teacherIdParam } = useParams<{ id: string }>();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const canEditTeacherProfile =
    user?.email === "noahalsamawi688@gmail.com" ||
    (isAuthenticated && !!teacher.user_id && teacher.user_id === user?.id);

  const handleBookingConfirm = async (data: {
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

    if (!user?.id || !teacherIdParam) {
      setErrorToast(t("booking.error"));
      setTimeout(() => setErrorToast(""), 3000);
      return;
    }

    try {
      const startMinutes = Number(data.startTime.split(":")[0]) * 60 + Number(data.startTime.split(":")[1]);
      const endMinutes = Number(data.endTime.split(":")[0]) * 60 + Number(data.endTime.split(":")[1]);
      const durationHours = Math.max((endMinutes - startMinutes) / 60, 0.5);

      await createBooking({
        student_id: user.id,
        teacher_id: teacherIdParam,
        subject_ar: teacher.services[0]?.name.ar || teacher.specializations[0]?.ar || "درس",
        subject_en: teacher.services[0]?.name.en || teacher.specializations[0]?.en || "Lesson",
        subject_de: teacher.services[0]?.name.de || teacher.specializations[0]?.de || "Unterricht",
        date: data.selectedDate,
        time: `${data.startTime} - ${data.endTime}`,
        duration_ar: `${durationHours} ساعة`,
        duration_en: `${durationHours} hour(s)`,
        duration_de: `${durationHours} Stunde(n)`,
      });
    } catch (err) {
      console.error("[Booking] createBooking error:", err);
      setErrorToast(t("booking.error"));
      setTimeout(() => setErrorToast(""), 3000);
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

  const handleAuthSuccess = (name: string) => {
    login(name);
    setAuthModalOpen(false);
    setAuthWarning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {teacher.banner && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-[#2F7A5B]/10">
          <img src={teacher.banner} alt={teacher.name[lang]} className="w-full h-52 object-cover" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Bio Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start gap-6">
            <AvatarAtom src={teacher.avatar} alt={teacher.name[lang]} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">{teacher.name[lang]}</h1>
              {canEditTeacherProfile && (
                <button
                  type="button"
                  onClick={() => navigate("/onboarding?edit=1")}
                  className="mt-2 text-sm text-[#2F7A5B] font-semibold hover:underline"
                >
                  {t("profile.edit")}
                </button>
              )}
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

      {/* Reviews Section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-[#1A1A2E] mb-6">{t("review.reviews")}</h2>
        <ReviewsSection
          teacherId={String(teacher.id)}
          teacherUserId={teacher.user_id}
          rating={teacher.rating}
          reviewsCount={teacher.reviewsCount}
        />
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
        onClose={() => {
          setConfirmation(null);
          navigate("/dashboard");
        }}
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

      {errorToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50">
          {errorToast}
        </div>
      )}
    </div>
  );
}