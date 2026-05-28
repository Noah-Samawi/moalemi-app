import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/organisms/Navbar";
import HeroSection from "@/components/organisms/HeroSection";
import FeaturedTeachersGrid from "@/components/organisms/FeaturedTeachersGrid";
import FeatureItem from "@/components/molecules/FeatureItem";
import AuthModal from "@/components/organisms/AuthModal";
import { features } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { getLatestContentByType } from "@/services/contentService";
import { sendAiMessage, type ChatMessage } from "@/services/aiService";
import { Sparkles, BookOpen, MessageCircle, Star, ArrowRight, Send, Loader, Bot } from "lucide-react";

export default function Index() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [showTeacherToast, setShowTeacherToast] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [advertisingTitle, setAdvertisingTitle] = useState("");
  const [advertisingBody, setAdvertisingBody] = useState("");
  const [extraFeatureTitle, setExtraFeatureTitle] = useState("");
  const [extraFeatureBody, setExtraFeatureBody] = useState("");
  // Auth modal (for AI CTA)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Homepage mini-chat state
  const [chatInput,    setChatInput]    = useState("");
  const [chatHistory,  setChatHistory]  = useState<ChatMessage[]>([]);
  const [chatLoading,  setChatLoading]  = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleJoinAsTeacher = () => {
    setShowTeacherToast(true);
    navigate("/onboarding");
  };

  useEffect(() => {
    if (!showTeacherToast) return;
    const timer = setTimeout(() => setShowTeacherToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showTeacherToast]);

  useEffect(() => {
    let cancelled = false;
    async function loadContent() {
      try {
        const [announcementItem, featureItem, adItem] = await Promise.all([
          getLatestContentByType("announcement", lang as any),
          getLatestContentByType("feature", lang as any),
          getLatestContentByType("advertising", lang as any),
        ]);
        if (cancelled) return;
        setAnnouncement(lang === "ar" ? (announcementItem?.body_ar || "") : (announcementItem?.body_de || ""));
        setAdvertisingTitle(lang === "ar" ? (adItem?.title_ar || "") : (adItem?.title_de || ""));
        setAdvertisingBody(lang === "ar" ? (adItem?.body_ar || "") : (adItem?.body_de || ""));
        setExtraFeatureTitle(lang === "ar" ? (featureItem?.title_ar || "") : (featureItem?.title_de || ""));
        setExtraFeatureBody(lang === "ar" ? (featureItem?.body_ar || "") : (featureItem?.body_de || ""));
      } catch (err) {
        console.error("[Index] loadContent error:", err);
      }
    }
    loadContent();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Mini-chat auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  const handleMiniChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: msg, timestamp: new Date().toISOString() };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const { reply } = await sendAiMessage(msg, chatHistory);
      setChatHistory((prev) => [...prev, { role: "assistant", content: reply, timestamp: new Date().toISOString() }]);
    } catch {
      setChatHistory((prev) => [...prev, { role: "assistant", content: "Entschuldigung, ein Fehler ist aufgetreten.", timestamp: new Date().toISOString() }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      {announcement && (
        <section className="bg-[#2F7A5B] text-white py-3 px-4 text-center text-sm font-medium">
          {announcement}
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
              />
            ))}
          </div>
          {extraFeatureTitle && (
            <div className="mt-8 bg-[#F7F1E4] border border-[#DCA842]/30 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{extraFeatureTitle}</h3>
              <p className="text-sm text-gray-700">{extraFeatureBody}</p>
            </div>
          )}
        </div>
      </section>

      <FeaturedTeachersGrid />

      {/* ── AI Study Assistant Promo Section ── */}
      <section className="py-20 bg-gradient-to-br from-[#F7F9F7] to-[#EEF6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 text-[#2F7A5B] text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                {lang === "ar" ? "جديد" : lang === "en" ? "New" : "Neu"}
              </span>
              <h2 className="text-4xl font-bold text-[#1A1A2E] leading-tight">
                {lang === "ar"
                  ? "مساعد الذكاء الاصطناعي للتجويد والعربية"
                  : lang === "en"
                  ? "AI Assistant for Tajweed & Arabic"
                  : "KI-Assistent für Tajweed & Arabisch"}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {lang === "ar"
                  ? "احصل على إجابات فورية عن قواعد التجويد، والحروف العربية، وأحكام النون الساكنة والمدود — في أي وقت، بدون انتظار."
                  : lang === "en"
                  ? "Get instant answers about Tajweed rules, the Arabic alphabet, Noon Sakinah, Madd types, and more — anytime, no waiting."
                  : "Erhalte sofortige Antworten zu Tajweed-Regeln, dem arabischen Alphabet, Noon Sakinah, Madd-Typen und mehr — jederzeit, ohne Wartezeit."}
              </p>

              {/* Feature bullets */}
              <ul className="space-y-3">
                {[
                  {
                    icon: <BookOpen className="w-4 h-4 text-[#2F7A5B]" />,
                    text: lang === "ar" ? "قواعد التجويد الكاملة في ثوانٍ" : lang === "en" ? "Full Tajweed rules in seconds" : "Vollständige Tajweed-Regeln in Sekunden",
                  },
                  {
                    icon: <MessageCircle className="w-4 h-4 text-[#2F7A5B]" />,
                    text: lang === "ar" ? "دردشة تفاعلية بالعربية والإنجليزية والألمانية" : lang === "en" ? "Chat in Arabic, English & German" : "Chat auf Arabisch, Englisch & Deutsch",
                  },
                  {
                    icon: <Star className="w-4 h-4 text-[#DCA842]" />,
                    text: lang === "ar" ? "معرفة مُدرَّبة خصيصاً على المنهج الإسلامي" : lang === "en" ? "Knowledge trained specifically on Islamic curriculum" : "Wissen speziell auf islamisches Lehrprogramm trainiert",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white font-bold text-sm rounded-2xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/25 hover:shadow-[#2F7A5B]/40 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                {lang === "ar"
                  ? "جرّب المساعد الذكي الآن"
                  : lang === "en"
                  ? "Try AI Assistant Now"
                  : "Jetzt KI-Assistenten testen"}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right: Live interactive mini-chat */}
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-[#2F7A5B]/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#1A1A2E] to-[#0f2d1f] flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#2F7A5B] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {lang === "ar" ? "المساعد الذكي" : lang === "en" ? "AI Assistant" : "KI-Assistent"}
                    </p>
                    <p className="text-[#2F7A5B] text-xs">
                      {lang === "ar" ? "متخصص في التجويد والعربية" : lang === "en" ? "Tajweed & Arabic specialist" : "Tajweed & Arabisch Spezialist"}
                    </p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#22c55e] shadow-sm" />
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-3 bg-[#FAFAFA] overflow-y-auto" style={{ maxHeight: 220 }}>
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-4 text-center text-gray-400">
                      <Bot className="w-8 h-8 text-gray-200 mb-2" />
                      <p className="text-xs">
                        {lang === "ar" ? "اسألني عن التجويد أو العربية..." : lang === "en" ? "Ask me about Tajweed or Arabic..." : "Frag mich über Tajweed oder Arabisch..."}
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`max-w-[82%] text-xs rounded-2xl px-3 py-2 leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-[#2F7A5B] text-white rounded-br-sm"
                            : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex gap-2">
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                        <div className="flex gap-1 items-center">
                          {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-[#2F7A5B]/40 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input bar */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleMiniChatSend(); }}
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleMiniChatSend(); } }}
                      placeholder={
                        lang === "ar" ? "اسأل سؤالاً عن التجويد..." : lang === "en" ? "Ask about Tajweed..." : "Frag über Tajweed..."
                      }
                      disabled={chatLoading}
                      className="flex-1 text-sm bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 outline-none focus:border-[#2F7A5B] focus:ring-1 focus:ring-[#2F7A5B]/20 transition-all disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#2F7A5B] flex items-center justify-center shadow-sm hover:bg-[#3a8b6a] transition-colors disabled:opacity-40"
                    >
                      {chatLoading ? <Loader className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium Hero CTA ── */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#0f2d1f] to-[#1A1A2E]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #2F7A5B 0%, transparent 60%), radial-gradient(circle at 80% 50%, #DCA842 0%, transparent 60%)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-8 left-12 w-32 h-32 rounded-full border border-[#2F7A5B]/20 opacity-40" />
        <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full border border-[#DCA842]/20 opacity-40" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#DCA842]/20 border border-[#DCA842]/30 text-[#DCA842] text-sm font-semibold tracking-wide uppercase">
            {lang === "ar" ? "انضم إلينا" : lang === "en" ? "Join Us" : "Jetzt starten"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/teachers")}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white font-bold text-base rounded-2xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-xl shadow-[#2F7A5B]/30 hover:shadow-[#2F7A5B]/50 hover:-translate-y-0.5"
            >
              {lang === "ar" ? "تصفح المعلمين" : lang === "en" ? "Browse Teachers" : "Lehrer entdecken"}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={handleJoinAsTeacher}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-[#DCA842]/60 text-[#DCA842] font-bold text-base rounded-2xl hover:bg-[#DCA842]/10 hover:border-[#DCA842] transition-all duration-300"
            >
              {t("cta.button")}
            </button>
          </div>
          {showTeacherToast && (
            <div className="mt-8 inline-block bg-[#2F7A5B] text-white px-6 py-3 rounded-xl shadow-lg">
              {t("cta.teacherRegisterSuccess")}
            </div>
          )}
        </div>
      </section>

      {advertisingTitle && (
        <section className="bg-white py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="rounded-xl border border-[#2F7A5B]/20 bg-[#FDF8F0] p-6">
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">{advertisingTitle}</h3>
              <p className="text-gray-700">{advertisingBody}</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-gray-400 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          {lang === "ar" ? (
            <>
              <span className="text-[#2F7A5B]">معلم</span>
              <span className="text-[#DCA842]">ي</span>
            </>
          ) : lang === "en" ? (
            <>
              <span className="text-[#2F7A5B]">My </span>
              <span className="text-[#DCA842]">Teacher</span>
            </>
          ) : (
            <>
              <span className="text-[#2F7A5B]">Mein </span>
              <span className="text-[#DCA842]">Lehrer</span>
            </>
          )}
          . {t("footer.rights")}
        </p>
      </footer>

      {/* Auth Modal — triggered by AI CTA */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}