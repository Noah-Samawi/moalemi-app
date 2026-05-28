import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import UserProfileSettings from "@/components/organisms/UserProfileSettings";
import AiAssistant from "@/components/organisms/AiAssistant";
import AdminKnowledgeBase from "@/components/organisms/AdminKnowledgeBase";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByStudent, getBookingsByTeacher, type BookingRow } from "@/services/bookingService";
import { getTeacherByUserId, getTeacherRowById, updateTeacher, type TeacherRow } from "@/services/teacherService";
import { getChannelByBookingId } from "@/services/channelService";
import {
  BookOpen, History, Settings, Video, Clock, CheckCircle,
  Calendar, Users, ArrowRight, User, Bell, MessageCircle, Save,
  Sparkles,
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

  // ── Teacher profile inline editor state ──
  const [teacherRow, setTeacherRow]       = useState<TeacherRow | null>(null);
  const [tBioEn, setTBioEn]             = useState("");
  const [tBioDe, setTBioDe]             = useState("");
  const [tBioAr, setTBioAr]             = useState("");
  const [tRate, setTRate]               = useState("");
  const [tExp, setTExp]                 = useState("");
  const [tPhone, setTPhone]             = useState("");
  const [tEmail, setTEmail]             = useState("");
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [teacherSaveOk, setTeacherSaveOk] = useState(false);
  const [teacherSaveErr, setTeacherSaveErr] = useState("");

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
        if (!cancelled) {
          setTeacherId(myTeacher?.id ?? null);
          if (myTeacher?.id) {
            const row = await getTeacherRowById(myTeacher.id);
            if (!cancelled && row) {
              setTeacherRow(row);
              setTBioEn(row.bio_en ?? "");
              setTBioDe(row.bio_de ?? "");
              setTBioAr(row.bio_ar ?? "");
              setTRate(String(row.hourly_rate ?? ""));
              setTExp(String(row.experience ?? ""));
              setTPhone(row.phone ?? "");
              setTEmail(row.contact_email ?? "");
            }
          }
        }

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

  // ── Save teacher profile inline ──
  const handleSaveTeacher = async () => {
    if (!teacherId) return;
    setSavingTeacher(true);
    setTeacherSaveErr("");
    try {
      await updateTeacher(teacherId, {
        bio_en: tBioEn,
        bio_de: tBioDe,
        bio_ar: tBioAr,
        hourly_rate: Number(tRate) || 0,
        experience: Number(tExp) || 0,
        phone: tPhone || null,
        contact_email: tEmail || null,
      } as Partial<TeacherRow>);
      setTeacherSaveOk(true);
      setTimeout(() => setTeacherSaveOk(false), 3000);
    } catch (err: unknown) {
      setTeacherSaveErr(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSavingTeacher(false);
    }
  };

  // ── Settings panel (inline) ──
  const renderSettings = () => (
    <div className="space-y-6">
      <UserProfileSettings />

      {/* ── Teacher profile editor (only if user is a teacher) ── */}
      {teacherId && teacherRow && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2F7A5B]" />
            Lehrerprofil bearbeiten
          </h2>

          {/* Bio fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Biografie (Englisch)
            </label>
            <textarea
              value={tBioEn}
              onChange={(e) => setTBioEn(e.target.value)}
              rows={3}
              placeholder="Write your bio in English..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Biografie (Deutsch)
            </label>
            <textarea
              value={tBioDe}
              onChange={(e) => setTBioDe(e.target.value)}
              rows={3}
              placeholder="Schreibe deine Biografie auf Deutsch..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              السيرة الذاتية (عربي)
            </label>
            <textarea
              value={tBioAr}
              onChange={(e) => setTBioAr(e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="اكتب سيرتك الذاتية بالعربي..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Stundensatz (€)
              </label>
              <input
                type="number"
                min={0}
                value={tRate}
                onChange={(e) => setTRate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Jahre Erfahrung
              </label>
              <input
                type="number"
                min={0}
                value={tExp}
                onChange={(e) => setTExp(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Telefonnummer
              </label>
              <input
                type="tel"
                value={tPhone}
                onChange={(e) => setTPhone(e.target.value)}
                placeholder="+49 123 456 7890"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Kontakt-E-Mail
              </label>
              <input
                type="email"
                value={tEmail}
                onChange={(e) => setTEmail(e.target.value)}
                placeholder="teacher@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all"
              />
            </div>
          </div>

          {teacherSaveOk && (
            <div className="p-3 bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 rounded-xl text-[#2F7A5B] text-sm font-medium">
              ✓ Lehrerprofil erfolgreich gespeichert!
            </div>
          )}
          {teacherSaveErr && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {teacherSaveErr}
            </div>
          )}

          <button
            onClick={handleSaveTeacher}
            disabled={savingTeacher}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl font-semibold hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20 disabled:opacity-60"
          >
            {savingTeacher ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lehrerprofil speichern
          </button>
        </div>
      )}

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
          ) : activeTab === "ai-assistant" ? (
            user ? <AiAssistant /> : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-[#2F7A5B]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[#2F7A5B]" />
                </div>
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">KI-Assistent</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                  Melde dich an, um den KI-Assistenten für Arabisch, Quran und Tajweed zu nutzen.
                </p>
              </div>
            )
          ) : activeTab === "ai-knowledge" ? (
            <AdminKnowledgeBase />
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

              {/* ── PRO Status card ── */}
              <div className="relative overflow-hidden mb-6 rounded-2xl p-5 bg-gradient-to-br from-[#1A1A2E] to-[#2d1c00]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#DCA842]/20 via-transparent to-[#DCA842]/10 pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#DCA842]/10 blur-3xl pointer-events-none" />
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#DCA842] to-[#C49535] text-[#1A1A2E] text-xs font-black tracking-wider shadow-lg">
                  ★ PRO
                </span>
                <div className="relative z-10">
                  <p className="text-[#DCA842] text-xs font-semibold uppercase tracking-widest mb-1">Premium Zugang</p>
                  <h3 className="text-white text-xl font-bold mb-1">Alle Funktionen freigeschaltet</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unbegrenzte Buchungen · Virtuelles Klassenzimmer · Prioritätssupport
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#DCA842] animate-pulse inline-block" />
                    <span className="text-[#DCA842] text-xs font-semibold">PRO aktiv</span>
                  </div>
                </div>
              </div>

              {/* ── Letzte Aktivitäten ── */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                  Letzte Aktivitäten
                </h3>
                <div className="bg-white rounded-xl border border-[#2F7A5B]/20 shadow-sm p-4 flex items-start gap-3 hover:border-[#2F7A5B]/40 transition-all duration-200 cursor-default">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E]">Neue Nachricht von Ustadh Ahmad</p>
                    <p className="text-xs text-gray-400 mt-0.5">vor 5 Minuten</p>
                  </div>
                  <button
                    onClick={() => navigate("/classroom")}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white text-xs font-bold rounded-lg hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-200 shadow-sm whitespace-nowrap"
                  >
                    <MessageCircle className="w-3 h-3" />
                    💬 Live Chat öffnen
                  </button>
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
