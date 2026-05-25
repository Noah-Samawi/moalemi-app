import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  teacher_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // joined from profiles (optional)
  reviewer_name?: string;
  reviewer_avatar?: string;
}

/** Fetch all reviews for a teacher (ordered newest first) */
export async function getReviewsByTeacherId(teacherId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Enrich with reviewer names from profiles
  const userIds = [...new Set(data.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { name: p.name, avatar: p.avatar_url }])
  );

  return data.map((r) => ({
    ...(r as Review),
    reviewer_name: profileMap.get(r.user_id)?.name ?? r.user_id.slice(0, 8),
    reviewer_avatar: profileMap.get(r.user_id)?.avatar ?? undefined,
  }));
}

/** Submit a review. Throws on duplicate (UNIQUE constraint teacher+user). */
export async function submitReview(
  teacherId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert([{ teacher_id: teacherId, user_id: userId, rating, comment }])
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

/** Delete own review */
export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) throw error;
}

/** Check if current user already reviewed a teacher */
export async function getUserReviewForTeacher(
  teacherId: string,
  userId: string
): Promise<Review | null> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("teacher_id", teacherId)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Review) ?? null;
}
