/**
 * aiService.ts
 *
 * Architecture:
 *  1. BUILT-IN BASE KNOWLEDGE  — hardcoded Arabic / Quran / Tajweed content.
 *     Always present so the AI is useful before the Admin feeds any sources.
 *  2. ADMIN SOURCES            — rows from `knowledge_sources` table (URLs + text
 *     snippets uploaded by admin/teacher).
 *  3. CHAT SESSION             — per-user in-memory history for multi-turn context.
 *
 * API call is intentionally isolated in `callAI()` so the backend endpoint /
 * provider (OpenAI, Gemini, Ollama …) can be swapped without touching callers.
 */

import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type KnowledgeSourceType = "pdf" | "link" | "text";

export interface KnowledgeSource {
  id: string;
  title: string;
  type: KnowledgeSourceType;
  content: string;       // extracted text (PDF pages / URL description / raw text)
  url: string | null;    // original URL / storage URL for PDFs
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AiChatResponse {
  reply: string;
  sourcesUsed: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BUILT-IN BASE KNOWLEDGE
//    This context is always injected first — covers Arabic, Quran, Tajweed.
// ─────────────────────────────────────────────────────────────────────────────

const BUILT_IN_BASE_KNOWLEDGE = `
=== MOALEMI BUILT-IN BASE KNOWLEDGE ===

--- ARABIC LANGUAGE ---
The Arabic language (اللغة العربية) is a Semitic language with over 400 million speakers worldwide.
It is written right-to-left and uses the Arabic script with 28 letters.

The Arabic Alphabet (الحروف الهجائية):
ا (Alif), ب (Ba), ت (Ta), ث (Tha), ج (Jim), ح (Ha), خ (Kha), د (Dal), ذ (Dhal),
ر (Ra), ز (Zain), س (Sin), ش (Shin), ص (Sad), ض (Dad), ط (Ta), ظ (Dha),
ع (Ain), غ (Ghain), ف (Fa), ق (Qaf), ك (Kaf), ل (Lam), م (Mim), ن (Nun),
ه (Ha), و (Waw), ي (Ya).

Arabic has three short vowels (حركات): Fatha (فَ), Kasra (فِ), Damma (فُ), and their
long counterparts. Sukoon (سكون) indicates no vowel. Shadda (شدة) indicates gemination.

Importance: Arabic is the language of the Holy Quran, Islamic scholarship, and one of
the six official UN languages. Classical Arabic (الفصحى) is the foundation of Modern
Standard Arabic and Quranic recitation.

--- THE HOLY QURAN ---
The Holy Quran (القرآن الكريم) is the central religious text of Islam, believed to be
the word of Allah (God) as revealed to Prophet Muhammad ﷺ over ~23 years.
It consists of 114 Surahs (chapters) and 6,236 Ayat (verses).
It was revealed in Arabic and memorized / written by the Companions of the Prophet ﷺ.
The Quran must be recited according to the rules of Tajweed for correct pronunciation.

--- TAJWEED (تجويد) — Rules of Quranic Recitation ---

Tajweed (meaning: to make well / to improve) is the set of rules governing correct
pronunciation and intonation during Quranic recitation. It is an obligation (فرض كفاية)
upon the Muslim community.

Key Tajweed Rules:

1. NOON SAKINAH & TANWEEN (نون ساكنة وتنوين):
   When a Noon (ن) has Sukoon or a letter has Tanween (ـٌ ـٍ ـً), there are 4 rules:
   a) Idhar (إظهار) — Clear pronunciation: when followed by throat letters (ء ه ع غ ح خ).
      Example: مِنْ عَذَابٍ → the Noon is pronounced clearly.
   b) Idgham (إدغام) — Merging: when followed by (ي ن م و ل ر). Two types:
      - With Ghunna (يرملون): letters ي ن م و — Noon merges with a nasal sound.
      - Without Ghunna (لر): letters ل ر — clean merge, no nasal.
      Example: مِنْ رَبِّهِمْ → Noon merges into Ra.
   c) Iqlab (إقلاب) — Conversion: when followed by ب. Noon converts to a Mim sound
      with Ghunna. Example: مِنْ بَعْدِ → sounds like مِمْ بَعْدِ.
   d) Ikhfa (إخفاء) — Concealment: when followed by the remaining 15 letters. Noon is
      not fully pronounced but hidden with a nasal sound (Ghunna).
      The 15 letters: ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ.
      Example: إِنْ كُنْتُمْ → Noon is hidden before Kaf.

2. MEEM SAKINAH (ميم ساكنة):
   When Meem (م) has Sukoon, there are 3 rules:
   a) Ikhfa Shafawi (إخفاء شفوي) — Labial concealment: when followed by ب. Meem is
      hidden with lips slightly apart and Ghunna (nasal resonance ~2 beats).
      Example: وَهُمْ بِالآخِرَةِ → Meem hidden before Ba.
   b) Idgham Shafawi (إدغام شفوي) — Labial merging: when followed by another Meem (م).
      Merges completely with Ghunna. Example: لَهُمْ مَا → both Meems merge.
   c) Idhar Shafawi (إظهار شفوي) — Clear labial pronunciation: when followed by any
      letter other than ب or م. Pronounced clearly with closed lips.
      Example: أَمْ حَسِبَ → Meem clear before Ha.

3. MADD (مد) — Elongation Rules:
   Madd refers to lengthening the sound of a long vowel letter (ا و ي).
   a) Madd Tabii / Natural Madd (مد طبيعي) — 2 beats (حركتان). The base Madd.
      Example: قَالَ / يَقُولُ / جِيءَ.
   b) Madd Munfasil (مد منفصل) — Separated Madd: long vowel letter at end of a word
      and Hamza at the start of the next word. 4–5 beats (depending on reciter).
      Example: إِنَّا أَعْطَيْنَاكَ.
   c) Madd Muttasil (مد متصل) — Connected Madd: long vowel letter and Hamza within
      the same word. Must be elongated 4–5 beats (obligatory).
      Example: جَاءَ / السَّمَاءِ / سُوءَ.
   d) Madd Lazim (مد لازم) — Necessary Madd: long vowel followed by Sukoon/Shadda
      within or at end of word. Must be elongated 6 beats (obligatory).
      Example: الحَاقَّة / الضَّالِّين.
   e) Madd Aarid Lissukoon (مد عارض للسكون) — Incidental Madd at pause: long vowel
      before a letter that carries Sukoon only at pause. 2, 4, or 6 beats allowed.
      Example: نَسْتَعِينُ (when stopping on it).

4. GHUNNA (غنة) — Nasal sound:
   A nasalized sound produced from the nose, lasting ~2 beats. Occurs in:
   - Noon Mushaddad (ن with Shadda): مِنَّ
   - Meem Mushaddad (م with Shadda): ثُمَّ
   - Idgham with Ghunna / Ikhfa / Iqlab / Ikhfa Shafawi cases above.

5. QALQALAH (قلقلة) — Echo/Bounce:
   A slight echo sound on 5 letters when they have Sukoon: ق ط ب ج د (مجموعة: قطب جد).
   Two levels: Minor Qalqalah (mid-word) and Major Qalqalah (at pause, end of word).
   Example: يَقْطَعُ → Qaf and Ta both have Qalqalah when sukoon.

6. TAFKHIM & TARQIQ (تفخيم وترقيق) — Heavy & Light sounds:
   - Tafkhim (heavy): Letters pronounced with full mouth — always heavy: خ غ ق ط ض ظ ص.
     Ra (ر) and Lam (ل) in لفظ الجلالة (الله) are heavy in certain contexts.
   - Tarqiq (light): All other letters are naturally light/thin.

=== END OF BASE KNOWLEDGE ===
`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Database: Knowledge Sources CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function getKnowledgeSources(): Promise<KnowledgeSource[]> {
  const { data, error } = await supabase
    .from("knowledge_sources")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as KnowledgeSource[];
}

export async function addKnowledgeSource(
  payload: Omit<KnowledgeSource, "id" | "created_at">
): Promise<KnowledgeSource> {
  const { data, error } = await supabase
    .from("knowledge_sources")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeSource;
}

export async function deleteKnowledgeSource(id: string): Promise<void> {
  const { error } = await supabase
    .from("knowledge_sources")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Context builder — combines base knowledge + admin sources
// ─────────────────────────────────────────────────────────────────────────────

async function buildSystemContext(): Promise<{ context: string; sourceNames: string[] }> {
  let context = BUILT_IN_BASE_KNOWLEDGE;
  const sourceNames: string[] = ["Built-in Base Knowledge (Arabic, Quran, Tajweed)"];

  try {
    const sources = await getKnowledgeSources();
    if (sources.length > 0) {
      context += "\n\n=== ADMIN-PROVIDED ADDITIONAL SOURCES ===\n";
      for (const src of sources) {
        context += `\n--- ${src.title} (${src.type}) ---\n${src.content}\n`;
        sourceNames.push(src.title);
      }
      context += "\n=== END OF ADDITIONAL SOURCES ===\n";
    }
  } catch (err) {
    console.warn("[aiService] Could not fetch admin sources — using base knowledge only:", err);
  }

  return { context, sourceNames };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Core AI call — isolated so the provider can be swapped
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calls the configured AI backend.
 * Currently wired to OpenAI Chat Completions via a Supabase Edge Function
 * (or Netlify/Vercel function) at /api/ai-chat so the API key is never in
 * the client bundle.
 *
 * To switch providers: change only this function — all callers stay intact.
 */
async function callAI(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  try {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`AI API error ${res.status}: ${errText}`);
    }

    const json = await res.json();
    // Support both OpenAI-style response and a simple { reply } envelope
    return (
      json?.choices?.[0]?.message?.content ??
      json?.reply ??
      "Entschuldigung, keine Antwort vom Server erhalten."
    );
  } catch (err) {
    console.error("[aiService] callAI error:", err);
    // Friendly offline fallback so the UI doesn't crash when the endpoint
    // isn't configured yet
    return (
      "🔧 Der KI-Dienst ist noch nicht konfiguriert. " +
      "Ein Admin muss den API-Schlüssel in der Backend-Konfiguration hinterlegen. " +
      "Die Wissensbasis (Arabisch, Quran, Tajweed) ist bereits geladen und wird " +
      "aktiviert, sobald das Backend verbunden ist."
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Public chat function — called from AiAssistant.tsx
// ─────────────────────────────────────────────────────────────────────────────

export async function sendAiMessage(
  userMessage: string,
  history: ChatMessage[]
): Promise<AiChatResponse> {
  const { context, sourceNames } = await buildSystemContext();

  const systemPrompt = `
You are Moalemi AI — a helpful, knowledgeable educational assistant focused on:
• The Arabic language (alphabet, grammar, vocabulary)
• The Holy Quran (context, meaning, recitation)
• Tajweed rules (Noon Sakinah, Meem Sakinah, Madd, Ghunna, Qalqalah, etc.)
• General Islamic studies

Always respond in the same language the student uses (Arabic, German, or English).
Be clear, accurate, and encouraging. Use structured lists when explaining rules.
Cite which rule category you are explaining when relevant.

You have access to the following knowledge:
${context}
`.trim();

  const reply = await callAI(systemPrompt, history, userMessage);
  return { reply, sourcesUsed: sourceNames };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Save chat history to Supabase (optional persistence)
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAiChatHistory(
  userId: string,
  history: ChatMessage[]
): Promise<void> {
  await supabase
    .from("ai_chat_history")
    .upsert(
      [{ user_id: userId, messages: history, updated_at: new Date().toISOString() }],
      { onConflict: "user_id" }
    );
}

export async function loadAiChatHistory(userId: string): Promise<ChatMessage[]> {
  const { data } = await supabase
    .from("ai_chat_history")
    .select("messages")
    .eq("user_id", userId)
    .maybeSingle();

  return (data?.messages as ChatMessage[]) ?? [];
}
