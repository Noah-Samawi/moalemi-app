import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import UserProfileSettings from "@/components/organisms/UserProfileSettings";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByStudent, getBookingsByTeacher, type BookingRow } from "@/services/bookingService";
import { getTeacherByUserId } from "@/services/teacherService";
import { getChannelByBookingId } from "@/services/channelService";
import {
  BookOpen, History, Settings, Video, Clock, CheckCircle,
  Calendar, Users, ArrowRight, User, Bell, LogOut,
} from "lucide-react";

// ── Upcoming = pending / scheduled / confirmed; History = completed / cancelled ──
const UPCOMING_STATUSES = ["pending", "upcoming", "scheduled", "confirmed"];
const HISTORY_STATUSES  = ["completed", "cancelled"];

export default function Dashboard() {
  const [activeTab, setActiveTab]       = useState("upcoming");
  const [infoToast, setInfoToast]       = useState("");
  const { t, lang }                     = useLanguage();
  const { user }                        = useAuth();
  const [bookings, setBookings]         = useState<BookingRow[]>([]);
  const [teacherId, setTeacherId]       = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);
  const [joiningBookingId, setJoiningBookingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // ── Tab change: redirect to /classroom for classroom tab ──
  const handleTabChange = (tab: string) => {
    if (tab === "classroom") {
      navigate("/classroom");
      return;
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    let cancelled = false;
    async function loadDashboard() {
      if (!user?.id) { setLoading(false); return; }
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
    return () => { cancelled = true; };
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

  // ── Stats ──
  const totalLessons      = bookings.length;
  const completedLessons  = useMemo(() => bookings.filter(r => r.status === "completed").length, [bookings]);
  const upcomingLessons   = useMemo(() => bookings.filter(r => UPCOMING_STATUSES.includes(r.status)).length, [bookings]);

  // ── Tab-filtered bookings ──
  const filteredBookings = useMemo(() => {
    if (activeTab === "upcoming") return bookings.filter(r => UPCOMING_STATUSES.includes(r.status));
    if (activeTab === "history")  return bookings.filter(r => HISTORY_STATUSES.includes(r.status));
    return bookings;
  }, [bookings, activeTab]);

  // ── Booking card (new schema: booking_date / start_time / end_time / notes / total_price) ──
  const renderBookingCard = (booking: BookingRow) => {
    const isUpcoming = UPCOMING_STATUSES.includes(booking.status);
    const isCompleted = booking.status === "completed";
    const isJoining = joiningBookingId === booking.id;
    const title = booking.notes || t("dashboard.lesson", { defaultValue: "Stunde" });
    const dateStr = booking.booking_date || "—";
    const timeStr = booking.start_time
      ? booking.end_time
        ? `${booking.start_time} – ${booking.end_time}`
        : booking.start_time
      : "—";

    return (
      <div
        key={booking.id}
        className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#2F7A5B]/30 hover:shadow-xl hover:shadow-[#2F7A5B]/5 transition-all duration-300"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="space-y-3 flex-1">
            <h3 className="font-bold text-[#1A1A2E] text-lg leading-tight">{title}</h3>
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
                {dateStr}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {timeStr}
              </span>
              {booking.total_price != null && (
                <span className="font-medium text-[#2F7A5B]">{booking.total_price} €</span>
              )}
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

  // ── Settings panel (inline) ──
  const renderSettings = () => (
    <div className="space-y-6">
      <UserProfileSettings />

      <div className="border-t border-gray-100 pt-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#2F7A5B]" />
            {t("dashboard.settings", { defaultValue: "Einstellungen" })}
          </h2>

          <div className="space-y-4">
            {/* Account */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FDF8F0] border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#2F7A5B]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#2F7A5B]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("auth.email", { defaultValue: "E-Mail" })}</p>
                <p className="font-semibold text-[#1A1A2E]">{user?.email ?? "—"}</p>
              </div>
            </div>

            {/* Edit teacher profile */}
            {teacherId && (
              <Link
                to={`/teacher/${teacherId}?edit=1`}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#2F7A5B]/20 hover:bg-[#2F7A5B]/5 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-[#2F7A5B]" />
                <span className="font-medium text-[#1A1A2E]">
                  {t("dashboard.editTeacherProfile", { defaultValue: "Lehrerprofil bearbeiten" })}
                </span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-400" />
              </Link>
            )}

            {/* Become teacher */}
            {!teacherId && (
              <Link
                to="/onboarding"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#DCA842]/30 hover:bg-[#DCA842]/5 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-[#DCA842]" />
                <span className="font-medium text-[#1A1A2E]">
                  {t("dashboard.becomeTeacher", { defaultValue: "Lehrer werden" })}
                </span>
                <ArrowRight className="w-4 h-4 ml-auto text-gray-400" />
              </Link>
            )}

            {/* Notifications placeholder */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">
                {t("dashboard.notifications", { defaultValue: "Benachrichtigungen" })}
              </span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                {t("dashboard.comingSoon", { defaultValue: "Bald verfügbar" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Empty state per tab ──
  const renderEmpty = () => {
    const isHistory = activeTab === "history";
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#FDF8F0] flex items-center justify-center mx-auto mb-4">
          {isHistory
            ? <History className="w-8 h-8 text-gray-300" />
            : <Calendar className="w-8 h-8 text-gray-300" />
          }
        </div>
        <p className="text-gray-400 text-lg">
          {isHistory
            ? t("dashboard.noHistory", { defaultValue: "Kein Stundenverlauf vorhanden" })
            : t("dashboard.noLessons")
          }
        </p>
        {!isHistory && (
          <p className="text-gray-300 text-sm mt-1">
            {t("dashboard.noLessonsHint", { defaultValue: "Buche eine Stunde bei einem Lehrer" })}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-[#f5f0e8] to-[#ede5d8]">
      <Navbar />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Header ── */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">{t("dashboard.title")}</h1>
            <p className="text-gray-500">
              {t("dashboard.welcomeBack", { defaultValue: "Willkommen in deinem Lern-Dashboard" })}
            </p>
          </div>

          {/* ── Settings tab ── */}
          {activeTab === "settings" ? (
            renderSettings()
          ) : (
            <>
              {/* ── Stats card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center shadow-lg shadow-[#2F7A5B]/20">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("dashboard.role")}</p>
                    <p className="text-xl font-bold text-[#1A1A2E]">
                      {teacherId ? t("dashboard.teacher") : t("dashboard.student")}
                    </p>
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
                    <p className="text-xs text-gray-500 mb-1">
                      {t("dashboard.upcomingShort", { defaultValue: "Bevorstehend" })}
                    </p>
                    <p className="text-2xl font-bold text-[#DCA842]">{upcomingLessons}</p>
                  </div>
                </div>
              </div>

              {/* ── Become teacher banner ── */}
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

              {/* ── Booking list ── */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-[#2F7A5B]/20 border-t-[#2F7A5B] rounded-full animate-spin" />
                  </div>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map(renderBookingCard)
                ) : (
                  renderEmpty()
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── Toast ── */}
      {infoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium z-50 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {infoToast}
        </div>
      )}
    </div>
  );
}
