export type TrilingualText = { ar: string; en: string; de: string };

export interface Service {
  name: TrilingualText;
  description: TrilingualText;
}

export interface Teacher {
  id: string | number;
  user_id?: string;
  name: TrilingualText;
  avatar: string;
  banner?: string;
  specializations: TrilingualText[];
  experience: number;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  bio: TrilingualText;
  services: Service[];
  is_pro: boolean;
  featured: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export interface UpcomingLesson {
  id: number;
  teacherName: TrilingualText;
  studentName: TrilingualText;
  subject: TrilingualText;
  date: string;
  time: string;
  duration: TrilingualText;
  role: "student" | "teacher";
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: { ar: "الشيخ أحمد محمد", en: "Sheikh Ahmed Mohammed", de: "Sheikh Ahmed Mohammed" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: [
      { ar: "القرآن الكريم", en: "Holy Quran", de: "Heiliger Quran" },
      { ar: "التجويد", en: "Tajweed", de: "Tajweed" },
      { ar: "القراءات العشر", en: "Ten Qira'at", de: "Zehn Lesarten" },
    ],
    experience: 15,
    hourlyRate: 25,
    rating: 4.9,
    reviewsCount: 234,
    bio: {
      ar: "شيخ متخصص في القراءات العشر مع خبرة تزيد عن 15 عاماً في تدريس القرآن الكريم والتجويد. حاصل على إجازة في القراءات العشر من مشايخ متعددين.",
      en: "A scholar specialized in the Ten Qira'at with over 15 years of experience teaching the Holy Quran and Tajweed. Holder of an Ijazah in the Ten Qira'at from multiple scholars.",
      de: "Ein Gelehrter, spezialisiert auf die zehn Lesarten mit über 15 Jahren Erfahrung im Unterrichten des Heiligen Quran und Tajweed. Inhaber einer Ijazah in den zehn Lesarten von mehreren Gelehrten.",
    },
    services: [
      { name: { ar: "حفظ القرآن الكريم", en: "Quran Memorization", de: "Quran-Memorierung" }, description: { ar: "برنامج متكامل لحفظ القرآن الكريم بالتجويد", en: "A comprehensive program for memorizing the Holy Quran with Tajweed", de: "Ein umfassendes Programm zur Memorierung des Heiligen Quran mit Tajweed" } },
      { name: { ar: "أحكام التجويد", en: "Tajweed Rules", de: "Tajweed-Regeln" }, description: { ar: "تعلم أحكام التجويد بشكل مفصل وتطبيقي", en: "Learn Tajweed rules in detail with practical application", de: "Lernen Sie die Tajweed-Regeln im Detail und praktisch" } },
      { name: { ar: "القراءات العشر", en: "Ten Qira'at", de: "Zehn Lesarten" }, description: { ar: "دراسة القراءات العشر الصغرى والكبرى", en: "Study of the minor and major Ten Qira'at", de: "Studium der kleinen und großen zehn Lesarten" } },
    ],
    is_pro: true,
    featured: true,
  },
  {
    id: 2,
    name: { ar: "الأستاذة فاطمة علي", en: "Fatima Ali", de: "Fatima Ali" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: [
      { ar: "اللغة العربية", en: "Arabic Language", de: "Arabische Sprache" },
      { ar: "النحو", en: "Grammar", de: "Grammatik" },
      { ar: "الصرف", en: "Morphology", de: "Morphologie" },
    ],
    experience: 10,
    hourlyRate: 20,
    rating: 4.8,
    reviewsCount: 189,
    bio: {
      ar: "أستاذة متخصصة في اللغة العربية وعلومها، مع خبرة واسعة في تدريس النحو والصرف والبلاغة لطلاب مختلف المستويات.",
      en: "A specialist in Arabic language and its sciences, with extensive experience teaching grammar, morphology, and rhetoric to students of all levels.",
      de: "Eine Spezialistin für die arabische Sprache und ihre Wissenschaften mit umfangreicher Erfahrung im Unterrichten von Grammatik, Morphologie und Rhetorik für Studenten aller Niveaus.",
    },
    services: [
      { name: { ar: "النحو والصرف", en: "Grammar & Morphology", de: "Grammatik und Morphologie" }, description: { ar: "دروس شاملة في قواعد النحو والصرف العربي", en: "Comprehensive lessons in Arabic grammar and morphology rules", de: "Umfassende Lektionen in arabischer Grammatik und Morphologie" } },
      { name: { ar: "البلاغة العربية", en: "Arabic Rhetoric", de: "Arabische Rhetorik" }, description: { ar: "تعلم فنون البلاغة: البيان والمعاني والبديع", en: "Learn the arts of rhetoric: clarity, meaning, and stylistics", de: "Lernen Sie die Kunst der Rhetorik: Klarheit, Bedeutung und Stilistik" } },
      { name: { ar: "المحادثة بالعربية", en: "Arabic Conversation", de: "Arabisch Konversation" }, description: { ar: "تحسين مهارات المحادثة والتعبير باللغة العربية", en: "Improve your Arabic conversation and expression skills", de: "Verbessern Sie Ihre Konversations- und Ausdrucksfähigkeiten auf Arabisch" } },
    ],
    is_pro: false,
    featured: false,
  },
  {
    id: 3,
    name: { ar: "الدكتور خالد حسن", en: "Dr. Khalid Hassan", de: "Dr. Khalid Hassan" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png",
    specializations: [
      { ar: "الفقه", en: "Fiqh", de: "Fiqh" },
      { ar: "العقيدة", en: "Aqeedah", de: "Glaubenslehre" },
      { ar: "الحديث", en: "Hadith", de: "Hadith" },
    ],
    experience: 20,
    hourlyRate: 30,
    rating: 4.95,
    reviewsCount: 312,
    bio: {
      ar: "دكتور في الشريعة الإسلامية مع أكثر من 20 عاماً في التدريس والبحث العلمي. متخصص في الفقه والعقيدة وعلوم الحديث.",
      en: "A doctor of Islamic Sharia with over 20 years of teaching and research experience. Specialized in Fiqh, Aqeedah, and Hadith sciences.",
      de: "Ein Doktor der islamischen Rechtswissenschaften mit über 20 Jahren Lehr- und Forschungserfahrung. Spezialisiert auf Fiqh, Glaubenslehre und Hadith-Wissenschaften.",
    },
    services: [
      { name: { ar: "الفقه الإسلامي", en: "Islamic Fiqh", de: "Islamisches Recht" }, description: { ar: "دراسة الفقه الإسلامي وفق المذاهب الأربعة", en: "Study Islamic Fiqh according to the four schools of thought", de: "Studium des islamischen Rechts nach den vier Rechtsschulen" } },
      { name: { ar: "العقيدة الصحيحة", en: "Correct Aqeedah", de: "Die richtige Glaubenslehre" }, description: { ar: "تعلم أصول العقيدة الإسلامية الصحيحة", en: "Learn the fundamentals of correct Islamic Aqeedah", de: "Lernen Sie die Grundlagen der richtigen islamischen Glaubenslehre" } },
      { name: { ar: "علوم الحديث", en: "Hadith Sciences", de: "Hadith-Wissenschaften" }, description: { ar: "دراسة مصطلح الحديث وعلومه", en: "Study Hadith terminology and sciences", de: "Studium der Hadith-Terminologie und ihrer Wissenschaften" } },
    ],
    is_pro: true,
    featured: true,
  },
  {
    id: 4,
    name: { ar: "الأستاذة نور الهدى", en: "Nour Al-Huda", de: "Nour Al-Huda" },
    avatar: "https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png",
    specializations: [
      { ar: "القرآن الكريم", en: "Holy Quran", de: "Heiliger Quran" },
      { ar: "التجويد", en: "Tajweed", de: "Tajweed" },
    ],
    experience: 8,
    hourlyRate: 18,
    rating: 4.7,
    reviewsCount: 156,
    bio: {
      ar: "معلمة قرآن متخصصة في تحفيظ القرآن الكريم وتعليم التجويد للنساء والأطفال بأسلوب سهل ومبسط.",
      en: "A Quran teacher specialized in memorization and teaching Tajweed to women and children with an easy and simplified approach.",
      de: "Eine Quran-Lehrerin, spezialisiert auf die Memorierung des Heiligen Quran und den Tajweed-Unterricht für Frauen und Kinder in einer einfachen und verständlichen Methode.",
    },
    services: [
      { name: { ar: "تحفيظ القرآن", en: "Quran Memorization", de: "Quran-Memorierung" }, description: { ar: "برنامج تحفيظ مخصص للنساء والأطفال", en: "A memorization program designed for women and children", de: "Ein spezielles Memorierungsprogramm für Frauen und Kinder" } },
      { name: { ar: "تجويد القرآن", en: "Quran Tajweed", de: "Quran-Tajweed" }, description: { ar: "تعلم أحكام التجويد بطريقة مبسطة", en: "Learn Tajweed rules in a simplified way", de: "Lernen Sie die Tajweed-Regeln auf vereinfachte Weise" } },
    ],
    is_pro: false,
    featured: false,
  },
];

export const features: Feature[] = [
  { icon: "Users", title: "features.individual.title", subtitle: "features.individual.subtitle" },
  { icon: "Clock", title: "features.flexibility.title", subtitle: "features.flexibility.subtitle" },
  { icon: "Star", title: "features.certified.title", subtitle: "features.certified.subtitle" },
  { icon: "Video", title: "features.live.title", subtitle: "features.live.subtitle" },
];

export const upcomingLessons: UpcomingLesson[] = [
  { id: 1, teacherName: { ar: "الشيخ أحمد محمد", en: "Sheikh Ahmed Mohammed", de: "Sheikh Ahmed Mohammed" }, studentName: { ar: "محمد أحمد", en: "Mohammed Ahmed", de: "Mohammed Ahmed" }, subject: { ar: "القرآن الكريم", en: "Holy Quran", de: "Heiliger Quran" }, date: "2026-05-03", time: "10:00 AM", duration: { ar: "ساعة واحدة", en: "One Hour", de: "Eine Stunde" }, role: "student" },
  { id: 2, teacherName: { ar: "الأستاذة فاطمة علي", en: "Fatima Ali", de: "Fatima Ali" }, studentName: { ar: "سارة خالد", en: "Sara Khalid", de: "Sara Khalid" }, subject: { ar: "النحو والصرف", en: "Grammar & Morphology", de: "Grammatik und Morphologie" }, date: "2026-05-04", time: "2:00 PM", duration: { ar: "ساعة ونصف", en: "One and a Half Hours", de: "Eineinhalb Stunden" }, role: "teacher" },
  { id: 3, teacherName: { ar: "الدكتور خالد حسن", en: "Dr. Khalid Hassan", de: "Dr. Khalid Hassan" }, studentName: { ar: "عبدالله محمد", en: "Abdullah Mohammed", de: "Abdullah Mohammed" }, subject: { ar: "الفقه الإسلامي", en: "Islamic Fiqh", de: "Islamisches Recht" }, date: "2026-05-05", time: "4:00 PM", duration: { ar: "ساعة واحدة", en: "One Hour", de: "Eine Stunde" }, role: "student" },
];