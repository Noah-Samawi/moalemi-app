import { useNavigate } from "react-router-dom";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import BadgeTag from "@/components/atoms/BadgeTag";
import StarRating from "@/components/atoms/StarRating";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import type { Teacher } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
      onClick={() => teacher.id && navigate(`/teacher/${teacher.id}`)}
    >
      <div className="flex items-start gap-4 mb-4">
        <AvatarAtom src={teacher.avatar} alt={teacher.name[lang]} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#1A1A2E] truncate">{teacher.name[lang]}</h3>
            {teacher.is_pro && (
              <span className="bg-[#DCA842] text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
                {t("teacher.pro")}
              </span>
            )}
          </div>
          <StarRating rating={teacher.rating} />
          <p className="text-sm text-gray-500 mt-1">{teacher.reviewsCount} {t("teacher.reviews")}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {teacher.specializations.map((spec) => (
          <BadgeTag key={spec.en} text={spec[lang]} variant="green" />
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{teacher.bio[lang]}</p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-[#2F7A5B]">${teacher.hourlyRate}</span>
          <span className="text-sm text-gray-500"> {t("teacher.perHour")}</span>
        </div>
        <div className="text-sm text-gray-500">
          {teacher.experience} {t("teacher.yearsExp")}
        </div>
      </div>

      <div className="mt-4">
        <PrimaryButton className="w-full" onClick={(e) => { e.stopPropagation(); if (teacher.id) navigate(`/teacher/${teacher.id}`); }}>
          {t("teacher.bookNow")}
        </PrimaryButton>
      </div>
    </div>
  );
}