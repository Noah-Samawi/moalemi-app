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

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getReviewsByTeacher(teacherId: string): Promise<ReviewRow[]> {
  if (!isUuid(teacherId)) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('id, teacher_id, user_id, rating, comment, created_at')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createReview(reviewData: CreateReviewData): Promise<ReviewRow> {
  if (!isUuid(reviewData.teacher_id)) {
    throw new Error('Teacher is not persisted yet');
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('user_id')
    .eq('id', reviewData.teacher_id)
    .maybeSingle();

  if (teacherError) throw teacherError;
  if (teacher?.user_id && teacher.user_id === user.id) {
    throw new Error('Teachers cannot review themselves');
  }

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
  if (!isUuid(teacherId)) return null;
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