import { supabase } from "@/lib/supabase";
import { translations } from "@/i18n/translations";
import type { Language } from "@/i18n/translations";

export type ContentType = "announcement" | "feature" | "advertising";

export interface ContentItemRow {
  id: string;
  content_type: ContentType;
  title_ar: string | null;
  title_de: string | null;
  body_ar: string | null;
  body_de: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface UpsertContentInput {
  content_type: ContentType;
  title_ar?: string;
  title_de?: string;
  body_ar?: string;
  body_de?: string;
  is_active?: boolean;
  created_by?: string;
}

/**
 * Get fallback content from i18n translations
 */
function getFallbackContent(contentType: ContentType, language: Language): ContentItemRow {
  const fallbackMap: Record<ContentType, Record<Language, { title: string; body: string }>> = {
    announcement: {
      ar: {
        title: "إعلان مهم",
        body: translations.ar["nav.home"] || "مرحباً بك في معلمي",
      },
      de: {
        title: "Wichtige Ankündigung",
        body: "Willkommen bei Moalemi",
      },
      en: {
        title: "Important Announcement",
        body: "Welcome to Moalemi",
      },
    },
    feature: {
      ar: {
        title: "ميزات جديدة",
        body: "استمتع بفصل دراسي افتراضي متكامل مع الفيديو والدردشة الفورية",
      },
      de: {
        title: "Neue Funktionen",
        body: "Genießen Sie ein vollständiges virtuelles Klassenzimmer mit Video und Live-Chat",
      },
      en: {
        title: "New Features",
        body: "Enjoy a complete virtual classroom with video and live chat",
      },
    },
    advertising: {
      ar: {
        title: "احجز درسك الآن",
        body: "ابدأ رحلتك التعليمية مع أفضل المعلمين المؤهلين",
      },
      de: {
        title: "Buchen Sie jetzt",
        body: "Beginnen Sie Ihre Lernreise mit den besten qualifizierten Lehrern",
      },
      en: {
        title: "Book Your Lesson Now",
        body: "Start your learning journey with the best qualified teachers",
      },
    },
  };

  const content = fallbackMap[contentType]?.[language] || fallbackMap[contentType].en;

  return {
    id: `fallback-${contentType}`,
    content_type: contentType,
    title_ar: fallbackMap[contentType].ar.title,
    title_de: fallbackMap[contentType].de.title,
    body_ar: fallbackMap[contentType].ar.body,
    body_de: fallbackMap[contentType].de.body,
    is_active: true,
    created_by: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getActiveContentByType(
  contentType: ContentType,
  language: Language = "ar"
): Promise<ContentItemRow[]> {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("content_type", contentType)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(`[contentService] Error fetching ${contentType}, using fallback:`, error.message);
      return [getFallbackContent(contentType, language)];
    }
    return (data ?? []) as ContentItemRow[];
  } catch (err) {
    console.warn(`[contentService] Exception fetching ${contentType}, using fallback:`, err);
    return [getFallbackContent(contentType, language)];
  }
}

export async function getLatestContentByType(
  contentType: ContentType,
  language: Language = "ar"
): Promise<ContentItemRow | null> {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("content_type", contentType)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn(`[contentService] Error fetching latest ${contentType}, using fallback:`, error.message);
      return getFallbackContent(contentType, language);
    }
    return (data ?? null) as ContentItemRow | null;
  } catch (err) {
    console.warn(`[contentService] Exception fetching latest ${contentType}, using fallback:`, err);
    return getFallbackContent(contentType, language);
  }
}

export async function createContentItem(payload: UpsertContentInput): Promise<ContentItemRow> {
  const { data, error } = await supabase
    .from("site_content")
    .insert([payload])
    .select("*")
    .single();

  if (error) throw error;
  return data as ContentItemRow;
}
