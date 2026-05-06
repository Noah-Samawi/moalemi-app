import { supabase } from '@/lib/supabase';

export interface ReviewRow {
  id: string;
  teacher_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name?: string;
}

export interface CreateReviewData {
  teacher_id: string;
  rating: number;
  comment?: string;
}

export async function getReviewsByTeacher(teacherId: string): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, teacher_id, user_id, rating, comment, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createReview(reviewData: CreateReviewData): Promise<ReviewRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      teacher_id: reviewData.teacher_id,
      user_id: user.id,
      rating: reviewData.rating,
      comment: reviewData.comment || null,
    }])
    .select('id, teacher_id, user_id, rating, comment, created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function getUserReviewForTeacher(teacherId: string): Promise<ReviewRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('reviews')
    .select('id, teacher_id, user_id, rating, comment, created_at')
    .eq('teacher_id', teacherId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
}