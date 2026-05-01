import TeacherCard from "@/components/molecules/TeacherCard";
import { teachers } from "@/data/mockData";

export default function FeaturedTeachersGrid() {
  return (
    <section id="teachers" className="py-16 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">
          معلمون مميزون
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  );
}