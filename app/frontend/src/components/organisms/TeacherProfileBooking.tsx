import { useState } from "react";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import StarRating from "@/components/atoms/StarRating";
import BadgeTag from "@/components/atoms/BadgeTag";
import BookingFormGroup from "@/components/molecules/BookingFormGroup";
import BookingConfirmationToast from "@/components/molecules/BookingConfirmationToast";
import AuthModal from "@/components/organisms/AuthModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface LiveTeacher {
  id: string;
  name_ar: string;
  name_de: string;
  subjects: string[];
  price_per_hour: number;
  years_of_experience: number;
  image_url: string;
  rating?: number;
  reviews_count?: number;
  bio_ar?: string;
  bio_de?: string;
}

interface TeacherProfileBookingProps {
  teacher: LiveTeacher;
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
  const { t, lang, isAuthenticated, login } = useLanguage();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authWarning, setAuthWarning] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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

    setAuthWarning(false);
    setBookingError(null);
    setBookingLoading(true);

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          student_name: data.userName,
          teacher_id: teacher.id,
          date: data.selectedDate,
          time: `${data.startTime} - ${data.endTime}`,
          price: data.totalPrice,
          status: "Confirmed",
        },
      ]);

      if (error) {
        console.error("Booking insert failed", error);
        setBookingError(error.message);
        toast({
          title: "Booking failed",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Booking successful",
        description: "Your request has been saved.",
      });

      setConfirmation({
        teacherName: lang === "ar" ? teacher.name_ar : teacher.name_de,
        selectedDate: data.selectedDate,
        startTime: data.startTime,
        endTime: data.endTime,
        userName: data.userName,
        totalPrice: data.totalPrice,
      });
    } catch (err) {
      console.error("Unexpected booking error", err);
      setBookingError(t("auth.unexpectedError"));
      toast({
        title: "Booking failed",
        description: t("auth.unexpectedError"),
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAuthSuccess = (name: string, email?: string | null) => {
    login(name, email);
    setAuthModalOpen(false);
    setAuthWarning(false);
  };

  const rating = teacher.rating ?? 4.9;
  const reviewsCount = teacher.reviews_count ?? 120;
  const teacherBio = lang === "ar" ? teacher.bio_ar ?? "مدرس محترف مع سجل ممتاز في التدريس." : teacher.bio_de ?? "Professioneller Lehrer mit exzellentem Erfahrungshintergrund.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-start gap-6">
            <AvatarAtom src={teacher.image_url} alt={lang === "ar" ? teacher.name_ar : teacher.name_de} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">{lang === "ar" ? teacher.name_ar : teacher.name_de}</h1>
              <StarRating rating={rating} />
              <p className="text-sm text-gray-500 mt-1">{reviewsCount} {t("teacher.reviews")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject) => (
              <BadgeTag key={subject} text={subject} variant="green" />
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <span className="font-semibold">{teacher.years_of_experience} {t("teacher.yearsExp")}</span>
            <span className="font-bold text-[#2F7A5B] text-lg">${teacher.price_per_hour} {t("profile.perHour")}</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">{t("profile.about")}</h2>
            <p className="text-gray-600 leading-relaxed">{teacherBio}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">{t("booking.title")}</h2>
            <BookingFormGroup
              hourlyRate={teacher.price_per_hour}
              onConfirm={handleBookingConfirm}
              loading={bookingLoading}
            />
          </div>
        </div>
      </div>

      {authWarning && !isAuthenticated && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-50 px-5 py-3 text-amber-800 shadow-lg">
          <span className="font-semibold">{t("auth.loginRequiredTitle")}:</span> {t("auth.loginRequired")}
        </div>
      )}

      <BookingConfirmationToast
        open={confirmation !== null}
        onClose={() => setConfirmation(null)}
        data={confirmation}
      />

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
