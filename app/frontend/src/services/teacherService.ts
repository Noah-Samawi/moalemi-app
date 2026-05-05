import { supabase } from '@/lib/supabase';
import type { Teacher, TrilingualText, Service } from '@/data/mockData';

interface TeacherRow {
  id: string;
  user_id: string | null;
  name_ar: string;
  name_en: string;
  name_de: string;
  avatar: string | null;
  specializations: TrilingualText[];
  bio_ar: string | null;
  bio_en: string | null;
  bio_de: string | null;
  services: Service[];
  experience: number;
  hourly_rate: number;
  rating: number;
  reviews_count: number;
  is_pro: boolean;
  featured: boolean;
  approved: boolean;
  created_at: string;
}

function mapRowToTeacher(row: TeacherRow, index?: number): Teacher {
  return {
    id: index ?? 0,
    name: { ar: row.name_ar, en: row.name_en, de: row.name_de },
    avatar: row.avatar || '',
    specializations: row.specializations || [],
    experience: row.experience,
    hourlyRate: row.hourly_rate,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    bio: { ar: row.bio_ar || '', en: row.bio_en || '', de: row.bio_de || '' },
    services: row.services || [],
    is_pro: row.is_pro,
    featured: row.featured,
  };
}

export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('approved', true);

  if (error) throw error;
  if (!data) return [];

  return data.map((row: TeacherRow, i: number) => mapRowToTeacher(row, i));
}

export async function getAllTeachers(): Promise<TeacherRow[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return mapRowToTeacher(data as TeacherRow);
}

export async function getTeacherRowById(id: string): Promise<TeacherRow | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as TeacherRow | null;
}

interface CreateTeacherData {
  user_id?: string;
  name_ar: string;
  name_en: string;
  name_de: string;
  bio_ar: string;
  bio_en: string;
  bio_de: string;
  specializations: TrilingualText[];
  hourly_rate: number;
  experience: number;
  avatar?: string;
}

export async function createTeacher(data: CreateTeacherData) {
  const { data: result, error } = await supabase
    .from('teachers')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateTeacher(id: string, updates: Partial<TeacherRow>) {
  const { data, error } = await supabase
    .from('teachers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTeacher(id: string) {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export type { TeacherRow, CreateTeacherData };