import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { upcomingLessons } from "@/data/mockData";
import { useLanguage } from "@/i18n/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { t, dir, lang } = useLanguage();

  const studentLessons = upcomingLessons.filter((l) => l.role === "student");
  const teacherLessons = upcomingLessons.filter((l) => l.role === "teacher");

  const renderLessonCard = (lesson: (typeof upcomingLessons)[0]) => (
    <div
      key={lesson.id}
      className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="space-y-1">
        <p className="font-bold text-[#1A1A2E]">{lesson.subject[lang]}</p>
        <p className="text-sm text-gray-600">
          {lesson.role === "student" ? t("dashboard.teacher") : t("dashboard.student")}:{" "}
          {lesson.role === "student" ? lesson.teacherName[lang] : lesson.studentName[lang]}
        </p>
        <p className="text-sm text-gray-500">
          {lesson.date} • {lesson.time} • {lesson.duration[lang]}
        </p>
      </div>
      <PrimaryButton className="self-start sm:self-center">{t("dashboard.joinLesson")}</PrimaryButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Navbar />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">{t("dashboard.title")}</h1>

          <Tabs defaultValue="student" dir={dir}>
            <TabsList className="mb-6">
              <TabsTrigger value="student">{t("dashboard.student")}</TabsTrigger>
              <TabsTrigger value="teacher">{t("dashboard.teacher")}</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <div className="space-y-4">
                {studentLessons.length > 0 ? (
                  studentLessons.map(renderLessonCard)
                ) : (
                  <p className="text-gray-500 text-center py-8">{t("dashboard.noLessons")}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="teacher">
              <div className="space-y-4">
                {teacherLessons.length > 0 ? (
                  teacherLessons.map(renderLessonCard)
                ) : (
                  <p className="text-gray-500 text-center py-8">{t("dashboard.noLessons")}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}