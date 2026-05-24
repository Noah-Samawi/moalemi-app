import { supabase } from '@/lib/supabase';

// Matches the NEW bookings schema (booking_date, start_time, end_time, student_name, notes, total_price)
interface BookingRow {
  id: string;
  student_id: string;
  teacher_id: string;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  student_name: string | null;
  notes: string | null;
  total_price: number | null;
  status: string;
  created_at: string;
}

interface CreateBookingData {
  student_id: string;
  teacher_id: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  student_name?: string;
  notes?: string;
  total_price?: number;
}

const BOOKING_COLUMNS =
  'id, student_id, teacher_id, booking_date, start_time, end_time, student_name, notes, total_price, status, created_at';

export async function createBooking(data: CreateBookingData) {
  const { data: result, error } = await supabase
    .from('bookings')
    .insert([data])
    .select(BOOKING_COLUMNS)
    .maybeSingle(); // .single() throws PGRST116 if RLS blocks read-back; maybeSingle() returns null instead

  if (error) throw error;
  return result;
}

export async function getBookingsByStudent(studentId: string): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_COLUMNS)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBookingsByTeacher(teacherId: string): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_COLUMNS)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
}

export type { BookingRow, CreateBookingData };
