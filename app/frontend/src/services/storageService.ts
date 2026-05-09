import { supabase } from "@/lib/supabase";

export type TeacherImageType = "avatar" | "banner";

const TEACHER_MEDIA_BUCKET = "avatars";

function createTeacherFilePath(userId: string, type: TeacherImageType, fileName: string): string {
  const safeName = fileName.replace(/\s+/g, "-").toLowerCase();
  return `${userId}/${type}-${Date.now()}-${safeName}`;
}

export async function uploadTeacherImage(params: {
  userId: string;
  file: File;
  type: TeacherImageType;
}): Promise<{ path: string; publicUrl: string }> {
  const { userId, file, type } = params;
  const filePath = createTeacherFilePath(userId, type, file.name);

  const { error: uploadError } = await supabase.storage
    .from(TEACHER_MEDIA_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(TEACHER_MEDIA_BUCKET).getPublicUrl(filePath);
  return { path: filePath, publicUrl: data.publicUrl };
}

export async function deleteTeacherImage(path: string): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(TEACHER_MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}

export function extractStoragePathFromUrl(url: string): string {
  const marker = `/storage/v1/object/public/${TEACHER_MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return "";
  return url.slice(index + marker.length);
}
