import { useNavigate } from "react-router-dom";
import AvatarAtom from "@/components/atoms/AvatarAtom";
import BadgeTag from "@/components/atoms/BadgeTag";
import StarRating from "@/components/atoms/StarRating";
import type { Teacher } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const name = teacher.name[lang];

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-[#2F7A5B]/30 shadow-sm hover:shadow-xl hover:shadow-[#2F7A5B]/8 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => teacher.id && navigate(`/teacher/${teacher.id}`)}
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        {/* Header: avatar + name block */}
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0">
            <AvatarAtom src={teacher.avatar} alt={name} size="lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              {/* Name — allow wrapping instead of truncating */}
              <h3 className="text-base font-bold text-[#1A1A2E] leading-snug break-words">
                {name}
              </h3>
              {teacher.is_pro && (
                <span className="flex-shrink-0 bg-gradient-to-r from-[#DCA842] to-[#C49535] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {t("teacher.pro")}
                </span>
              )}
            </div>
            <StarRating rating={teacher.rating} />
            <p className="text-xs text-gray-400 mt-0.5">
              {teacher.reviewsCount} {t("teacher.reviews")}
            </p>
          </div>
        </div>

        {/* Specializations */}
        {teacher.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {teacher.specializations.slice(0, 3).map((spec) => (
              <BadgeTag key={spec.en} text={spec[lang]} variant="green" />
            ))}
            {teacher.specializations.length > 3 && (
              <span className="text-xs text-gray-400 self-center">
                +{teacher.specializations.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
          {teacher.bio[lang] || "—"}
        </p>

        {/* Footer: price + experience + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-[#2F7A5B]">${teacher.hourlyRate}</span>
            <span className="text-xs text-gray-400 ml-1">{t("teacher.perHour")}</span>
            <p className="text-xs text-gray-400 mt-0.5">
              {teacher.experience} {t("teacher.yearsExp")}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (teacher.id) navigate(`/teacher/${teacher.id}`);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#2F7A5B] to-[#3a8b6a] text-white text-sm font-semibold rounded-xl hover:from-[#3a8b6a] hover:to-[#4a9b7a] hover:shadow-lg hover:shadow-[#2F7A5B]/25 transition-all duration-300 group/btn"
          >
            {t("teacher.bookNow")}
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
