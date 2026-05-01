import { useNavigate } from "react-router-dom";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import BadgeTag from "@/components/atoms/BadgeTag";
import StarRating from "@/components/atoms/StarRating";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import type { Teacher } from "@/data/mockData";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
      onClick={() => navigate(`/teacher/${teacher.id}`)}
    >
      <div className="flex items-start gap-4 mb-4">
        <AvatarAtom src={teacher.avatar} alt={teacher.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#1A1A2E] truncate">{teacher.name}</h3>
          <StarRating rating={teacher.rating} />
          <p className="text-sm text-gray-500 mt-1">{teacher.reviewsCount} تقييم</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {teacher.specializations.map((spec) => (
          <BadgeTag key={spec} text={spec} variant="green" />
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{teacher.bio}</p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-[#2F7A5B]">${teacher.hourlyRate}</span>
          <span className="text-sm text-gray-500"> / ساعة</span>
        </div>
        <div className="text-sm text-gray-500">
          {teacher.experience} سنة خبرة
        </div>
      </div>

      <div className="mt-4">
        <PrimaryButton className="w-full" onClick={(e) => { e.stopPropagation(); navigate(`/teacher/${teacher.id}`); }}>
          احجز الآن
        </PrimaryButton>
      </div>
    </div>
  );
}