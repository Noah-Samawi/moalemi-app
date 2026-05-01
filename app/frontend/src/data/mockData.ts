export type BilingualText = { ar: string; de: string };

export interface Service {
  name: BilingualText;
  description: BilingualText;
}

export interface Teacher {
  id: number;
  name: BilingualText;
  avatar: string;
  specializations: BilingualText[];
  experience: number;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  bio: BilingualText;
  services: Service[];
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export interface UpcomingLesson {
  id: number;
  teacherName: BilingualText;
  studentName: BilingualText;
  subject: BilingualText;
  date: string;
  time: string;
  duration: BilingualText;
  role: "student" | "teacher";
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: { ar: "الشيخ أحمد محمد", de: "Sheikh Ahmed Mohammed" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: [
      { ar: "القرآن الكريم", de: "Heiliger Quran" },
      { ar: "التجويد", de: "Tajweed" },
      { ar: "القراءات العشر", de: "Zehn Lesarten" },
    ],
    experience: 15,
    hourlyRate: 25,
    rating: 4.9,
    reviewsCount: 234,
    bio: {
      ar: "شيخ متخصص في القراءات العشر مع خبرة تزيد عن 15 عاماً في تدريس القرآن الكريم والتجويد. حاصل على إجازة في القراءات العشر من مشايخ متعددين.",
      de: "Ein Gelehrter, spezialisiert auf die zehn Lesarten mit über 15 Jahren Erfahrung im Unterrichten des Heiligen Quran und Tajweed. Inhaber einer Ijazah in den zehn Lesarten von mehreren Gelehrten.",
    },
    services: [
      { name: { ar: "حفظ القرآن الكريم", de: "Quran-Memorierung" }, description: { ar: "برنامج متكامل لحفظ القرآن الكريم بالتجويد", de: "Ein umfassendes Programm zur Memorierung des Heiligen Quran mit Tajweed" } },
      { name: { ar: "أحكام التجويد", de: "Tajweed-Regeln" }, description: { ar: "تعلم أحكام التجويد بشكل مفصل وتطبيقي", de: "Lernen Sie die Tajweed-Regeln im Detail und praktisch" } },
      { name: { ar: "القراءات العشر", de: "Zehn Lesarten" }, description: { ar: "دراسة القراءات العشر الصغرى والكبرى", de: "Studium der kleinen und großen zehn Lesarten" } },
    ],
  },
  {
    id: 2,
    name: { ar: "الأستاذة فاطمة علي", de: "Fatima Ali" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: [
      { ar: "اللغة العربية", de: "Arabische Sprache" },
      { ar: "النحو", de: "Grammatik" },
      { ar: "الصرف", de: "Morphologie" },
    ],
    experience: 10,
    hourlyRate: 20,
    rating: 4.8,
    reviewsCount: 189,
    bio: {
      ar: "أستاذة متخصصة في اللغة العربية وعلومها، مع خبرة واسعة في تدريس النحو والصرف والبلاغة لطلاب مختلف المستويات.",
      de: "Eine Spezialistin für die arabische Sprache und ihre Wissenschaften mit umfangreicher Erfahrung im Unterrichten von Grammatik, Morphologie und Rhetorik für Studenten aller Niveaus.",
    },
    services: [
      { name: { ar: "النحو والصرف", de: "Grammatik und Morphologie" }, description: { ar: "دروس شاملة في قواعد النحو والصرف العربي", de: "Umfassende Lektionen in arabischer Grammatik und Morphologie" } },
      { name: { ar: "البلاغة العربية", de: "Arabische Rhetorik" }, description: { ar: "تعلم فنون البلاغة: البيان والمعاني والبديع", de: "Lernen Sie die Kunst der Rhetorik: Klarheit, Bedeutung und Stilistik" } },
      { name: { ar: "المحادثة بالعربية", de: "Arabisch Konversation" }, description: { ar: "تحسين مهارات المحادثة والتعبير باللغة العربية", de: "Verbessern Sie Ihre Konversations- und Ausdrucksfähigkeiten auf Arabisch" } },
    ],
  },
  {
    id: 3,
    name: { ar: "الدكتور خالد حسن", de: "Dr. Khalid Hassan" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: [
      { ar: "الفقه", de: "Fiqh" },
      { ar: "العقيدة", de: "Glaubenslehre" },
      { ar: "الحديث", de: "Hadith" },
    ],
    experience: 20,
    hourlyRate: 30,
    rating: 4.95,
    reviewsCount: 312,
    bio: {
      ar: "دكتور في الشريعة الإسلامية مع أكثر من 20 عاماً في التدريس والبحث العلمي. متخصص في الفقه والعقيدة وعلوم الحديث.",
      de: "Ein Doktor der islamischen Rechtswissenschaften mit über 20 Jahren Lehr- und Forschungserfahrung. Spezialisiert auf Fiqh, Glaubenslehre und Hadith-Wissenschaften.",
    },
    services: [
      { name: { ar: "الفقه الإسلامي", de: "Islamisches Recht" }, description: { ar: "دراسة الفقه الإسلامي وفق المذاهب الأربعة", de: "Studium des islamischen Rechts nach den vier Rechtsschulen" } },
      { name: { ar: "العقيدة الصحيحة", de: "Die richtige Glaubenslehre" }, description: { ar: "تعلم أصول العقيدة الإسلامية الصحيحة", de: "Lernen Sie die Grundlagen der richtigen islamischen Glaubenslehre" } },
      { name: { ar: "علوم الحديث", de: "Hadith-Wissenschaften" }, description: { ar: "دراسة مصطلح الحديث وعلومه", de: "Studium der Hadith-Terminologie und ihrer Wissenschaften" } },
    ],
  },
  {
    id: 4,
    name: { ar: "الأستاذة نور الهدى", de: "Nour Al-Huda" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: [
      { ar: "القرآن الكريم", de: "Heiliger Quran" },
      { ar: "التجويد", de: "Tajweed" },
    ],
    experience: 8,
    hourlyRate: 18,
    rating: 4.7,
    reviewsCount: 156,
    bio: {
      ar: "معلمة قرآن متخصصة في تحفيظ القرآن الكريم وتعليم التجويد للنساء والأطفال بأسلوب سهل ومبسط.",
      de: "Eine Quran-Lehrerin, spezialisiert auf die Memorierung des Heiligen Quran und den Tajweed-Unterricht für Frauen und Kinder in einer einfachen und verständlichen Methode.",
    },
    services: [
      { name: { ar: "تحفيظ القرآن", de: "Quran-Memorierung" }, description: { ar: "برنامج تحفيظ مخصص للنساء والأطفال", de: "Ein spezielles Memorierungsprogramm für Frauen und Kinder" } },
      { name: { ar: "تجويد القرآن", de: "Quran-Tajweed" }, description: { ar: "تعلم أحكام التجويد بطريقة مبسطة", de: "Lernen Sie die Tajweed-Regeln auf vereinfachte Weise" } },
    ],
  },
];

export const features: Feature[] = [
  { icon: "Users", title: "features.individual.title", subtitle: "features.individual.subtitle" },
  { icon: "Clock", title: "features.flexibility.title", subtitle: "features.flexibility.subtitle" },
  { icon: "Star", title: "features.certified.title", subtitle: "features.certified.subtitle" },
  { icon: "Video", title: "features.live.title", subtitle: "features.live.subtitle" },
];

export const upcomingLessons: UpcomingLesson[] = [
  { id: 1, teacherName: { ar: "الشيخ أحمد محمد", de: "Sheikh Ahmed Mohammed" }, studentName: { ar: "محمد أحمد", de: "Mohammed Ahmed" }, subject: { ar: "القرآن الكريم", de: "Heiliger Quran" }, date: "2026-05-03", time: "10:00 ص", duration: { ar: "ساعة واحدة", de: "Eine Stunde" }, role: "student" },
  { id: 2, teacherName: { ar: "الأستاذة فاطمة علي", de: "Fatima Ali" }, studentName: { ar: "سارة خالد", de: "Sara Khalid" }, subject: { ar: "النحو والصرف", de: "Grammatik und Morphologie" }, date: "2026-05-04", time: "2:00 م", duration: { ar: "ساعة ونصف", de: "Eineinhalb Stunden" }, role: "teacher" },
  { id: 3, teacherName: { ar: "الدكتور خالد حسن", de: "Dr. Khalid Hassan" }, studentName: { ar: "عبدالله محمد", de: "Abdullah Mohammed" }, subject: { ar: "الفقه الإسلامي", de: "Islamisches Recht" }, date: "2026-05-05", time: "4:00 م", duration: { ar: "ساعة واحدة", de: "Eine Stunde" }, role: "student" },
];