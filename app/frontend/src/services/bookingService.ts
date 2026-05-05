import { supabase } from '@/lib/supabase';

interface BookingRow {
  id: string;
  student_id: string;
  teacher_id: string;
  subject_ar: string | null;
  subject_en: string | null;
  subject_de: string | null;
  date: string | null;
  time: string | null;
  duration_ar: string | null;
  duration_en: string | null;
  duration_de: string | null;
  status: string;
  created_at: string;
}

interface CreateBookingData {
  student_id: string;
  teacher_id: string;
  subject_ar?: string;
  subject_en?: string;
  subject_de?: string;
  date?: string;
  time?: string;
  duration_ar?: string;
  duration_en?: string;
  duration_de?: string;
}

export async function createBooking(data: CreateBookingData) {
  const { data: result, error } = await supabase
    .from('bookings')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getBookingsByStudent(studentId: string): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBookingsByTeacher(teacherId: string): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export type { BookingRow, CreateBookingData };