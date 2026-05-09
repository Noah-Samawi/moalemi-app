import { supabase } from "@/lib/supabase";

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

export async function getActiveContentByType(contentType: ContentType): Promise<ContentItemRow[]> {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("content_type", contentType)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContentItemRow[];
}

export async function getLatestContentByType(contentType: ContentType): Promise<ContentItemRow | null> {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("content_type", contentType)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as ContentItemRow | null;
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
