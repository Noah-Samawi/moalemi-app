import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import type { Teacher } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";

  const badgeText = isArabic ? "مباشر" : "Live";
  const nameText = "ahmad";
  const subjectText = isArabic ? "تجويد" : "Tadschwid";
  const experienceText = isArabic ? "خبرة 6 سنوات" : "6 J. Erfahrung";
  const rateText = isArabic ? "0 $/ساعة" : "0 €/Std.";
  const buttonText = isArabic ? "احجز الآن" : "Jetzt buchen";
  const cardFontClass = isArabic ? "font-tajawal" : "font-outfit";
  const textAlignClass = isArabic ? "text-right" : "text-left";
  const contentDirection = isArabic ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`group bg-white rounded-3xl border border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-2xl p-6 cursor-pointer ${cardFontClass}`}
      onClick={() => navigate(`/teacher/${teacher.id}`)}
    >
      <div className={`flex flex-col gap-5 md:items-center ${contentDirection}`}>
        <div className="aspect-[4/3] w-full max-w-[220px] overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <User className="h-14 w-14 text-slate-400" />
        </div>

        <div className={`flex-1 space-y-4 ${textAlignClass}`}>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {badgeText}
          </span>

          <div>
            <h3 className="text-2xl font-semibold text-slate-950">{nameText}</h3>
            <p className="mt-2 text-sm text-slate-500">{subjectText}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span>{experienceText}</span>
            <span className="font-semibold text-emerald-700">{rateText}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton
          className="w-full bg-[#2FA85C] text-white hover:bg-[#278a4d]"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/teacher/${teacher.id}`);
          }}
        >
          {buttonText}
        </PrimaryButton>
      </div>
    </div>
  );
}
