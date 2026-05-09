import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByStudent, getBookingsByTeacher, type BookingRow } from "@/services/bookingService";
import { getTeacherByUserId } from "@/services/teacherService";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [infoToast, setInfoToast] = useState("");
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadDashboard() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const myTeacher = await getTeacherByUserId(user.id);
        if (!cancelled) setTeacherId(myTeacher?.id ?? null);

        const rows = myTeacher
          ? await getBookingsByTeacher(myTeacher.id)
          : await getBookingsByStudent(user.id);
        if (!cancelled) setBookings(rows);
      } catch (err) {
        console.error("[Dashboard] loadDashboard error:", err);
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const roleLabel = teacherId ? t("dashboard.teacher") : t("dashboard.student");
  const totalLessons = bookings.length;
  const completedLessons = useMemo(
    () => bookings.filter((row) => row.status === "completed").length,
    [bookings]
  );

  const renderBookingCard = (booking: BookingRow) => (
    <div
      key={booking.id}
      className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="space-y-1">
        <p className="font-bold text-[#1A1A2E]">
          {lang === "ar" ? booking.subject_ar : lang === "de" ? booking.subject_de : booking.subject_en}
        </p>
        <p className="text-sm text-gray-600">
          {t("dashboard.status")}: {booking.status}
        </p>
        <p className="text-sm text-gray-500">
          {booking.date} • {booking.time} • {lang === "ar" ? booking.duration_ar : lang === "de" ? booking.duration_de : booking.duration_en}
        </p>
      </div>
      <PrimaryButton
        className="self-start sm:self-center"
        onClick={() => {
          setInfoToast(t("dashboard.joinSoon"));
          setTimeout(() => setInfoToast(""), 2500);
        }}
      >
        {t("dashboard.joinLesson")}
      </PrimaryButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">{t("dashboard.title")}</h1>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <p className="text-sm text-gray-500 mb-1">{t("dashboard.role")}</p>
            <p className="text-xl font-bold text-[#1A1A2E]">{roleLabel}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#FDF8F0] rounded-lg p-3">
                <p className="text-xs text-gray-500">{t("dashboard.totalLessons")}</p>
                <p className="text-lg font-bold text-[#2F7A5B]">{totalLessons}</p>
              </div>
              <div className="bg-[#FDF8F0] rounded-lg p-3">
                <p className="text-xs text-gray-500">{t("dashboard.completedLessons")}</p>
                <p className="text-lg font-bold text-[#2F7A5B]">{completedLessons}</p>
              </div>
            </div>
          </div>

          {!teacherId && (
            <div className="mb-6">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#DCA842] text-[#1A1A2E] font-semibold hover:bg-[#c9972e]"
              >
                {t("dashboard.becomeTeacher")}
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : bookings.length > 0 ? (
              bookings.map(renderBookingCard)
            ) : (
              <p className="text-gray-500 text-center py-8">{t("dashboard.noLessons")}</p>
            )}
          </div>
        </main>
      </div>
      {infoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2F7A5B] text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50">
          {infoToast}
        </div>
      )}
    </div>
  );
}