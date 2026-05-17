import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByStudent, getBookingsByTeacher, type BookingRow } from "@/services/bookingService";
import { getTeacherByUserId } from "@/services/teacherService";
import { getChannelByBookingId } from "@/services/channelService";
import { BookOpen, History, Settings, Video, Clock, CheckCircle, Calendar, Users, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [infoToast, setInfoToast] = useState("");
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningBookingId, setJoiningBookingId] = useState<string | null>(null);
  const navigate = useNavigate();

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
      cancelled = false;
    };
  }, [user?.id]);

  const handleJoinLesson = async (booking: BookingRow) => {
    setJoiningBookingId(booking.id);
    try {
      const channel = await getChannelByBookingId(booking.id);
      if (channel) {
        navigate(`/classroom?bookingId=${booking.id}`);
      } else {
        setInfoToast(t("dashboard.noChannel"));
        setTimeout(() => setInfoToast(""), 3000);
      }
    } catch (err) {
      console.error("[Dashboard] handleJoinLesson error:", err);
      setInfoToast(t("dashboard.joinError"));
      setTimeout(() => setInfoToast(""), 3000);
    } finally {
      setJoiningBookingId(null);
    }
  };

  const roleLabel = teacherId ? t("dashboard.teacher") : t("dashboard.student");
  const totalLessons = bookings.length;
  const completedLessons = useMemo(
    () => bookings.filter((row) => row.status === "completed").length,
    [bookings]
  );
  const upcomingLessons = useMemo(
    () => bookings.filter((row) => row.status === "upcoming" || row.status === "scheduled").length,
    [bookings]
  );

  const renderBookingCard = (booking: BookingRow) => {
    const isUpcoming = booking.status === "upcoming" || booking.status === "scheduled";
    const isCompleted = booking.status === "completed";
    const isJoining = joiningBookingId === booking.id;

    return (
      <div
        key={booking.id}
        className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#2F7A5B]/30 hover:shadow-xl hover:shadow-[#2F7A5B]/5 transition-all duration-300"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="space-y-3 flex-1">
            <h3 className="font-bold text-[#1A1A2E] text-lg leading-tight">
              {lang === "ar" ? booking.subject_ar : lang === "de" ? booking.subject_de : booking.subject_en}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-green-100 text-[#2F7A5B]"
                  : isUpcoming
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
              }`}>
                {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {t("dashboard.status")}: {booking.status}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {booking.date}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {booking.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                {lang === "ar" ? booking.duration_ar : lang === "de" ? booking.duration_de : booking.duration_en}
              </span>
            </div>
          </div>

          {isUpcoming && (
            <button
              onClick={() => handleJoinLesson(booking)}
              disabled={isJoining}
              className="self-start sm:self-center group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl font-semibold hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20 hover:shadow-[#2F7A5B]/30 disabled:opacity-60"
            >
              {isJoining ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Video className="w-4 h-4" />
              )}
              <span>{t("dashboard.joinLesson")}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-[#f5f0e8] to-[#ede5d8]">
      <Navbar />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">{t("dashboard.title")}</h1>
            <p className="text-gray-500">{t("dashboard.welcomeBack", { defaultValue: "Welcome back to your learning dashboard" })}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center shadow-lg shadow-[#2F7A5B]/20">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("dashboard.role")}</p>
                <p className="text-xl font-bold text-[#1A1A2E]">{roleLabel}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#FDF8F0] to-[#f5f0e8] rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{t("dashboard.totalLessons")}</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{totalLessons}</p>
              </div>
              <div className="bg-gradient-to-br from-[#FDF8F0] to-[#f5f0e8] rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{t("dashboard.completedLessons")}</p>
                <p className="text-2xl font-bold text-[#2F7A5B]">{completedLessons}</p>
              </div>
              <div className="bg-gradient-to-br from-[#FDF8F0] to-[#f5f0e8] rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{t("dashboard.upcomingShort", { defaultValue: "Upcoming" })}</p>
                <p className="text-2xl font-bold text-[#DCA842]">{upcomingLessons}</p>
              </div>
            </div>
          </div>

          {!teacherId && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#DCA842]/10 to-[#C49535]/10 border border-[#DCA842]/20 rounded-xl">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DCA842] to-[#C49535] text-[#1A1A2E] font-semibold hover:from-[#C49535] hover:to-[#b88930] transition-all duration-300 shadow-lg shadow-[#DCA842]/15"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("dashboard.becomeTeacher")}
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-[#2F7A5B]/20 border-t-[#2F7A5B] rounded-full animate-spin" />
              </div>
            ) : bookings.length > 0 ? (
              bookings.map(renderBookingCard)
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-[#FDF8F0] flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 text-lg">{t("dashboard.noLessons")}</p>
                <p className="text-gray-300 text-sm mt-1">{t("dashboard.noLessonsHint", { defaultValue: "Book a lesson with a teacher to get started" })}</p>
              </div>
            )}
          </div>
        </main>
      </div>
      {infoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-50 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {infoToast}
        </div>
      )}
    </div>
  );
}