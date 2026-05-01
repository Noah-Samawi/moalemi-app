export interface Service {
  name: string;
  description: string;
}

export interface Teacher {
  id: number;
  name: string;
  avatar: string;
  specializations: string[];
  experience: number;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  services: Service[];
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export interface UpcomingLesson {
  id: number;
  teacherName: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  role: "student" | "teacher";
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "الشيخ أحمد محمد",
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: ["القرآن الكريم", "التجويد", "القراءات العشر"],
    experience: 15,
    hourlyRate: 25,
    rating: 4.9,
    reviewsCount: 234,
    bio: "شيخ متخصص في القراءات العشر مع خبرة تزيد عن 15 عاماً في تدريس القرآن الكريم والتجويد. حاصل على إجازة في القراءات العشر من مشايخ متعددين.",
    services: [
      { name: "حفظ القرآن الكريم", description: "برنامج متكامل لحفظ القرآن الكريم بالتجويد" },
      { name: "أحكام التجويد", description: "تعلم أحكام التجويد بشكل مفصل وتطبيقي" },
      { name: "القراءات العشر", description: "دراسة القراءات العشر الصغرى والكبرى" },
    ],
  },
  {
    id: 2,
    name: "الأستاذة فاطمة علي",
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: ["اللغة العربية", "النحو", "الصرف"],
    experience: 10,
    hourlyRate: 20,
    rating: 4.8,
    reviewsCount: 189,
    bio: "أستاذة متخصصة في اللغة العربية وعلومها، مع خبرة واسعة في تدريس النحو والصرف والبلاغة لطلاب مختلف المستويات.",
    services: [
      { name: "النحو والصرف", description: "دروس شاملة في قواعد النحو والصرف العربي" },
      { name: "البلاغة العربية", description: "تعلم فنون البلاغة: البيان والمعاني والبديع" },
      { name: "المحادثة بالعربية", description: "تحسين مهارات المحادثة والتعبير باللغة العربية" },
    ],
  },
  {
    id: 3,
    name: "الدكتور خالد حسن",
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: ["الفقه", "العقيدة", "الحديث"],
    experience: 20,
    hourlyRate: 30,
    rating: 4.95,
    reviewsCount: 312,
    bio: "دكتور في الشريعة الإسلامية مع أكثر من 20 عاماً في التدريس والبحث العلمي. متخصص في الفقه والعقيدة وعلوم الحديث.",
    services: [
      { name: "الفقه الإسلامي", description: "دراسة الفقه الإسلامي وفق المذاهب الأربعة" },
      { name: "العقيدة الصحيحة", description: "تعلم أصول العقيدة الإسلامية الصحيحة" },
      { name: "علوم الحديث", description: "دراسة مصطلح الحديث وعلومه" },
    ],
  },
  {
    id: 4,
    name: "الأستاذة نور الهدى",
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: ["القرآن الكريم", "التجويد"],
    experience: 8,
    hourlyRate: 18,
    rating: 4.7,
    reviewsCount: 156,
    bio: "معلمة قرآن متخصصة في تحفيظ القرآن الكريم وتعليم التجويد للنساء والأطفال بأسلوب سهل ومبسط.",
    services: [
      { name: "تحفيظ القرآن", description: "برنامج تحفيظ مخصص للنساء والأطفال" },
      { name: "تجويد القرآن", description: "تعلم أحكام التجويد بطريقة مبسطة" },
    ],
  },
];

export const features: Feature[] = [
  { icon: "Users", title: "دروس فردية", subtitle: "تعلم بشكل فردي مع معلم مخصص يركز على احتياجاتك" },
  { icon: "Clock", title: "مرونة في المواعيد", subtitle: "اختر الوقت المناسب لك من بين مواعيد متعددة" },
  { icon: "Star", title: "معلمون معتمدون", subtitle: "جميع معلمينا معتمدون وذوو خبرة عالية" },
  { icon: "Video", title: "دروس مباشرة", subtitle: "جلسات تفاعلية مباشرة عبر الإنترنت" },
];

export const upcomingLessons: UpcomingLesson[] = [
  { id: 1, teacherName: "الشيخ أحمد محمد", studentName: "محمد أحمد", subject: "القرآن الكريم", date: "2026-05-03", time: "10:00 ص", duration: "ساعة واحدة", role: "student" },
  { id: 2, teacherName: "الأستاذة فاطمة علي", studentName: "سارة خالد", subject: "النحو والصرف", date: "2026-05-04", time: "2:00 م", duration: "ساعة ونصف", role: "teacher" },
  { id: 3, teacherName: "الدكتور خالد حسن", studentName: "عبدالله محمد", subject: "الفقه الإسلامي", date: "2026-05-05", time: "4:00 م", duration: "ساعة واحدة", role: "student" },
];