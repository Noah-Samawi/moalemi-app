import { useState, useEffect, useRef } from "react";
import {
  sendAiMessage,
  loadAiChatHistory,
  saveAiChatHistory,
  type ChatMessage,
} from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { Send, Bot, User, Loader, Sparkles, Trash2, Paperclip, X, FileText } from "lucide-react";

// ── Predefined starter prompts for quick exploration ──
const STARTER_PROMPTS = [
  "Erkläre mir die Regeln von Noon Sakinah.",
  "Was ist Tajweed und warum ist es wichtig?",
  "Wie heißen die 28 arabischen Buchstaben?",
  "Was ist der Unterschied zwischen Madd Muttasil und Madd Munfasil?",
  "Erkläre Qalqalah mit Beispielen.",
  "Was ist Ghunna?",
];

export default function AiAssistant() {
  const { user } = useAuth();

  const [history,  setHistory]  = useState<ChatMessage[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [initLoad, setInitLoad] = useState(true);
  // File upload state
  const [attachedFile,    setAttachedFile]    = useState<File | null>(null);
  const [attachedContent, setAttachedContent] = useState<string | null>(null);
  const [fileLoading,     setFileLoading]     = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  // ── Load persisted history ──
  useEffect(() => {
    if (!user?.id) { setInitLoad(false); return; }
    loadAiChatHistory(user.id)
      .then((h) => setHistory(h))
      .catch(console.error)
      .finally(() => setInitLoad(false));
  }, [user?.id]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: attachedFile
        ? `📎 [${attachedFile.name}]\n\n${msg}`
        : msg,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const docCtx = attachedContent ?? undefined;
    // Clear attachment after send
    setAttachedFile(null);
    setAttachedContent(null);

    try {
      const { reply } = await sendAiMessage(msg, history, docCtx);
      const aiMsg: ChatMessage = {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      const updated = [...history, userMsg, aiMsg];
      setHistory(updated);
      if (user?.id) saveAiChatHistory(user.id, updated).catch(console.error);
    } catch (err) {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuche es erneut.",
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // ── File attachment handler ──
  const handleFileAttach = async (file?: File) => {
    if (!file) return;
    // Accept text, PDF (read as text), images
    const allowed = ["text/plain", "application/pdf", "text/html", "text/csv"];
    const isText = allowed.some((t) => file.type.startsWith(t)) || file.name.endsWith(".txt") || file.name.endsWith(".md");
    setFileLoading(true);
    try {
      if (isText || file.type === "application/pdf") {
        const text = await file.text();
        setAttachedContent(text);
      } else {
        // For images: pass a note that an image was attached
        setAttachedContent(`[Image file: ${file.name} — ${(file.size / 1024).toFixed(1)} KB]`);
      }
      setAttachedFile(file);
    } catch {
      setAttachedContent(`[File: ${file.name}]`);
      setAttachedFile(file);
    } finally {
      setFileLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setHistory([]);
    if (user?.id) saveAiChatHistory(user.id, []).catch(console.error);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[520px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#2F7A5B]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center shadow-md shadow-[#2F7A5B]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1A1A2E]">Moalemi AI-Assistent</h2>
            <p className="text-xs text-gray-400">Arabisch · Quran · Tajweed</p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            title="Chat leeren"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Leeren
          </button>
        )}
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scroll-smooth">
        {initLoad ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="w-5 h-5 animate-spin text-[#2F7A5B]" />
          </div>

        ) : history.length === 0 ? (
          /* ── Welcome / starter state ── */
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pt-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2F7A5B]/10 to-[#3a8b6a]/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-[#2F7A5B]" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
              Frag mich alles über Arabisch & Quran
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
              Ich bin mit umfangreichem Wissen über das arabische Alphabet, den Heiligen
              Quran und alle wichtigen Tajweed-Regeln ausgestattet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left text-xs text-[#2F7A5B] bg-[#2F7A5B]/6 hover:bg-[#2F7A5B]/12 border border-[#2F7A5B]/15 hover:border-[#2F7A5B]/30 rounded-xl px-3 py-2.5 transition-all duration-200 leading-relaxed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

        ) : (
          /* ── Chat messages ── */
          history.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isUser
                      ? "bg-[#1A1A2E] text-white"
                      : "bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] text-white"
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-[#1A1A2E] text-white rounded-tr-sm"
                      : "bg-gray-50 text-[#1A1A2E] border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {/* Preserve line breaks and whitespace from AI responses */}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1.5 ${isUser ? "text-white/40" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-[#2F7A5B]/50 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="border-t border-gray-100 px-4 py-4 bg-white">
        {/* Attachment preview */}
        {attachedFile && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-[#2F7A5B]/8 border border-[#2F7A5B]/20 rounded-xl">
            <FileText className="w-4 h-4 text-[#2F7A5B] flex-shrink-0" />
            <span className="text-xs text-[#2F7A5B] font-medium flex-1 truncate">{attachedFile.name}</span>
            <button
              type="button"
              onClick={() => { setAttachedFile(null); setAttachedContent(null); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-end gap-2"
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.csv,.html,text/*,image/*"
            className="hidden"
            onChange={(e) => handleFileAttach(e.target.files?.[0])}
          />
          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || fileLoading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#2F7A5B] hover:bg-[#2F7A5B]/8 rounded-xl transition-all duration-200 disabled:opacity-40"
            title="Datei anhängen (PDF, TXT, Bild)"
          >
            {fileLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Stelle eine Frage über Arabisch, Quran oder Tajweed…"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/30 focus:border-[#2F7A5B] transition-all resize-none disabled:opacity-60 leading-relaxed"
              style={{
                minHeight: "44px",
                maxHeight: "140px",
                height: "auto",
                overflow: input.split("\n").length > 3 ? "auto" : "hidden",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 140) + "px";
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-2">
          Enter zum Senden · Shift+Enter für Zeilenumbruch · 📎 Datei anhängen
        </p>
      </div>
    </div>
  );
}
