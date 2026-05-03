import { useNavigate } from "react-router-dom";
import { useLiveData } from "@/context/LiveDataContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedTeachersGrid() {
  const { t, lang } = useLanguage();
  const { teachers, loadingTeachers } = useLiveData();
  const navigate = useNavigate();

  const placeholderImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=80";

  return (
    <section id="teachers" className="py-16 bg-[#FDF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-[#1A1A2E]">{t("teachers.title")}</h2>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
            Live
          </span>
        </div>
        {loadingTeachers ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl bg-white p-6 shadow-sm">
                <Skeleton className="h-48 w-full rounded-3xl" />
                <Skeleton className="mt-6 h-6 w-3/4 rounded-full" />
                <Skeleton className="mt-4 h-4 w-2/4 rounded-full" />
                <Skeleton className="mt-4 h-10 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No teachers are available right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="group rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative mb-4 h-48 overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src={teacher.image_url || placeholderImage}
                    alt={lang === "ar" ? teacher.name_ar : teacher.name_de}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{lang === "ar" ? teacher.name_ar : teacher.name_de}</h3>
                    <p className="mt-1 text-sm text-slate-500">{teacher.subjects.slice(0, 2).join(", ")}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Live
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-600">
                  <span>{teacher.years_of_experience} yrs exp</span>
                  <span>${teacher.price_per_hour}/hr</span>
                </div>
                <div className="mt-6">
                  <Button className="w-full" onClick={() => navigate(`/teacher/${teacher.id}`)}>
                    {t("teacher.bookNow")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
