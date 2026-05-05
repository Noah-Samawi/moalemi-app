import { useState, useEffect } from "react";
import TeacherCard from "@/components/molecules/TeacherCard";
import { teachers as mockTeachers } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { getTeachers } from "@/services/teacherService";
import type { Teacher } from "@/data/mockData";

export default function FeaturedTeachersGrid() {
  const { t } = useLanguage();
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchTeachers() {
      try {
        const data = await getTeachers();
        if (!cancelled) {
          setTeacherList(data.length > 0 ? data : mockTeachers);
        }
      } catch {
        if (!cancelled) {
          setTeacherList(mockTeachers);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchTeachers();
    return () => { cancelled = true; };
  }, []);

  const sortedTeachers = [...teacherList].sort((a, b) => {
    if (a.featured && a.is_pro && !(b.featured && b.is_pro)) return -1;
    if (b.featured && b.is_pro && !(a.featured && a.is_pro)) return 1;
    return b.rating - a.rating;
  });

  return (
    <section id="teachers" className="py-16 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">
          {t("teachers.title")}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8956C]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}