import { useState, useEffect, useRef } from "react";
import {
  getKnowledgeSources,
  addKnowledgeSource,
  deleteKnowledgeSource,
  type KnowledgeSource,
  type KnowledgeSourceType,
} from "@/services/aiService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Brain, Link2, FileText, Upload, Trash2, Plus, Loader,
  CheckCircle, AlertCircle, Database, RefreshCw,
} from "lucide-react";

const TYPE_ICONS: Record<KnowledgeSourceType, React.ReactNode> = {
  pdf:  <FileText className="w-4 h-4 text-red-500" />,
  link: <Link2 className="w-4 h-4 text-blue-500" />,
  text: <FileText className="w-4 h-4 text-[#2F7A5B]" />,
};

const TYPE_LABELS: Record<KnowledgeSourceType, string> = {
  pdf:  "PDF-Dokument",
  link: "Web-Link",
  text: "Text-Snippet",
};

export default function AdminKnowledgeBase() {
  const { user } = useAuth();

  // ── Source list ──
  const [sources,  setSources]  = useState<KnowledgeSource[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  // ── Add-source form ──
  const [addType,    setAddType]    = useState<KnowledgeSourceType>("text");
  const [addTitle,   setAddTitle]   = useState("");
  const [addContent, setAddContent] = useState("");
  const [addUrl,     setAddUrl]     = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saveOk,     setSaveOk]     = useState(false);
  const [saveErr,    setSaveErr]    = useState("");

  // ── PDF upload ──
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const loadSources = async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const rows = await getKnowledgeSources();
      setSources(rows);
    } catch (err: unknown) {
      setFetchErr(err instanceof Error ? err.message : "Fehler beim Laden");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { loadSources(); }, []);

  // ── Upload PDF to Supabase Storage and extract text as content ──
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    setSaveErr("");
    try {
      const path = `knowledge/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("classroom-files")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("classroom-files")
        .getPublicUrl(path);

      setAddTitle(addTitle || file.name.replace(/\.[^.]+$/, ""));
      setAddUrl(urlData.publicUrl);
      setAddContent(
        `[PDF-Datei hochgeladen: ${file.name}]\n` +
        `URL: ${urlData.publicUrl}\n\n` +
        `Beschreibung (bitte ergänzen): `
      );
      setAddType("pdf");
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Upload-Fehler");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddSource = async () => {
    if (!addTitle.trim() || !addContent.trim()) {
      setSaveErr("Titel und Inhalt sind Pflichtfelder.");
      return;
    }
    setSaving(true);
    setSaveOk(false);
    setSaveErr("");
    try {
      const added = await addKnowledgeSource({
        title: addTitle.trim(),
        type: addType,
        content: addContent.trim(),
        url: addUrl.trim() || null,
        is_active: true,
        created_by: user?.id ?? null,
      });
      setSources((prev) => [added, ...prev]);
      setAddTitle("");
      setAddContent("");
      setAddUrl("");
      setAddType("text");
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeSource(id);
      setSources((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] flex items-center justify-center shadow-lg shadow-[#2F7A5B]/20 flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">KI-Wissensbasis</h2>
          <p className="text-sm text-gray-500">
            Verwalte die Quellen, die der KI-Assistent für Schüleranfragen nutzt.
          </p>
        </div>
      </div>

      {/* ── Built-in knowledge notice ── */}
      <div className="flex items-start gap-3 p-4 bg-[#2F7A5B]/8 border border-[#2F7A5B]/20 rounded-2xl">
        <CheckCircle className="w-5 h-5 text-[#2F7A5B] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#1A1A2E]">
            Eingebaute Wissensbasis ist aktiv
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Arabisches Alphabet · Heiliger Quran (Grundlagen) · Tajweed-Regeln:
            Noon Sakinah, Meem Sakinah (Ikhfa/Idgham/Idhar/Iqlab), Madd-Typen,
            Ghunna, Qalqalah, Tafkhim &amp; Tarqiq — bereits ohne zusätzliche Quellen verfügbar.
          </p>
        </div>
      </div>

      {/* ── Add source form ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#2F7A5B]" />
          Neue Quelle hinzufügen
        </h3>

        {/* Type selector */}
        <div className="flex gap-2 flex-wrap">
          {(["text", "link", "pdf"] as KnowledgeSourceType[]).map((t) => (
            <button
              key={t}
              onClick={() => setAddType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                addType === t
                  ? "bg-[#2F7A5B] text-white border-[#2F7A5B] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#2F7A5B]/40"
              }`}
            >
              {TYPE_ICONS[t]}
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* PDF upload shortcut */}
        {addType === "pdf" && (
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handlePdfUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-[#2F7A5B]/30 hover:border-[#2F7A5B]/60 text-sm font-medium text-[#2F7A5B] cursor-pointer transition-all duration-200 ${uploading ? "opacity-60 pointer-events-none" : ""}`}
            >
              {uploading
                ? <Loader className="w-4 h-4 animate-spin" />
                : <Upload className="w-4 h-4" />
              }
              {uploading ? "Wird hochgeladen…" : "PDF / TXT hochladen"}
            </label>
            <span className="text-xs text-gray-400">oder URL unten einfügen</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Titel *</label>
          <input
            type="text"
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
            placeholder="z. B. Tajweed-Regelwerk Band 2"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/30 focus:border-[#2F7A5B] transition-all"
          />
        </div>

        {/* URL (for links) */}
        {(addType === "link" || addType === "pdf") && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {addType === "link" ? "Web-URL *" : "PDF-URL (optional)"}
            </label>
            <input
              type="url"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/30 focus:border-[#2F7A5B] transition-all"
            />
          </div>
        )}

        {/* Content / description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            {addType === "link"
              ? "Beschreibung / Zusammenfassung des Links *"
              : "Inhalt / extrahierter Text *"
            }
          </label>
          <textarea
            value={addContent}
            onChange={(e) => setAddContent(e.target.value)}
            rows={5}
            placeholder={
              addType === "link"
                ? "Beschreibe den Inhalt der Seite oder füge relevante Textauszüge ein…"
                : "Relevante Textpassagen, Regelwerke oder Lernmaterial einfügen…"
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/30 focus:border-[#2F7A5B] transition-all resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Dieser Text wird direkt in den KI-Kontext eingespeist. Je präziser, desto besser die Antworten.
          </p>
        </div>

        {saveOk && (
          <div className="flex items-center gap-2 p-3 bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 rounded-xl text-[#2F7A5B] text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Quelle erfolgreich gespeichert!
          </div>
        )}
        {saveErr && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {saveErr}
          </div>
        )}

        <button
          onClick={handleAddSource}
          disabled={saving || !addTitle.trim() || !addContent.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white rounded-xl font-semibold text-sm hover:from-[#3a8b6a] hover:to-[#4a9b7a] transition-all duration-300 shadow-lg shadow-[#2F7A5B]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? <Loader className="w-4 h-4 animate-spin" />
            : <Plus className="w-4 h-4" />
          }
          Quelle hinzufügen
        </button>
      </div>

      {/* ── Active sources list ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2F7A5B]" />
            Aktive Quellen
            {!fetching && (
              <span className="ml-1 bg-[#2F7A5B]/10 text-[#2F7A5B] text-xs font-bold px-2 py-0.5 rounded-full">
                {sources.length}
              </span>
            )}
          </h3>
          <button
            onClick={loadSources}
            disabled={fetching}
            className="p-1.5 text-gray-400 hover:text-[#2F7A5B] transition-colors rounded-lg hover:bg-[#2F7A5B]/10"
            title="Aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader className="w-6 h-6 animate-spin text-[#2F7A5B]" />
          </div>
        ) : fetchErr ? (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" /> {fetchErr}
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Database className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Noch keine zusätzlichen Quellen.</p>
            <p className="text-xs mt-1 text-gray-300">
              Der Assistent nutzt bereits die eingebaute Wissensbasis.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#2F7A5B]/20 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  {TYPE_ICONS[src.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">{src.title}</p>
                    <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                      {TYPE_LABELS[src.type]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{src.content}</p>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline mt-0.5 inline-block truncate max-w-full"
                    >
                      {src.url}
                    </a>
                  )}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(src.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(src.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Quelle löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
