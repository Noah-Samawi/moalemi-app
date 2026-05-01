export type Language = "ar" | "de";

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navbar
    "nav.home": "الرئيسية",
    "nav.teachers": "المعلمون",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.dashboard": "لوحة التحكم",
    "nav.logout": "تسجيل الخروج",

    // Hero
    "hero.title": "تعلّم القرآن والعربية مع أفضل المعلمين",
    "hero.subtitle": "منصة متكاملة تربطك بأفضل معلمي القرآن الكريم واللغة العربية والدراسات الإسلامية",
    "hero.cta": "تصفح المعلمين",

    // Features
    "features.title": "لماذا معلمي؟",
    "features.individual.title": "دروس فردية",
    "features.individual.subtitle": "تعلم بشكل فردي مع معلم مخصص يركز على احتياجاتك",
    "features.flexibility.title": "مرونة في المواعيد",
    "features.flexibility.subtitle": "اختر الوقت المناسب لك من بين مواعيد متعددة",
    "features.certified.title": "معلمون معتمدون",
    "features.certified.subtitle": "جميع معلمينا معتمدون وذوو خبرة عالية",
    "features.live.title": "دروس مباشرة",
    "features.live.subtitle": "جلسات تفاعلية مباشرة عبر الإنترنت",

    // Teachers Grid
    "teachers.title": "معلمون مميزون",

    // Teacher Card
    "teacher.reviews": "تقييم",
    "teacher.perHour": "/ ساعة",
    "teacher.yearsExp": "سنة خبرة",
    "teacher.bookNow": "احجز الآن",

    // CTA Banner
    "cta.title": "انضم كمعلم",
    "cta.subtitle": "شارك علمك وانضم لفريق المعلمين",
    "cta.button": "سجّل كمعلم",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",

    // Auth Modal
    "auth.login": "تسجيل الدخول",
    "auth.register": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.name": "الاسم الكامل",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.loginButton": "تسجيل الدخول",
    "auth.registerButton": "إنشاء حساب",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    "auth.welcomeBack": "مرحباً بعودتك",
    "auth.createAccount": "أنشئ حسابك الجديد",
    "auth.loginSuccess": "تم تسجيل الدخول بنجاح!",
    "auth.registerSuccess": "تم إنشاء الحساب بنجاح!",
    "auth.fillAll": "يرجى ملء جميع الحقول",
    "auth.passwordMismatch": "كلمات المرور غير متطابقة",

    // Booking
    "booking.title": "احجز درساً",
    "booking.date": "التاريخ",
    "booking.startTime": "وقت البداية",
    "booking.endTime": "وقت النهاية",
    "booking.name": "الاسم",
    "booking.namePlaceholder": "أدخل اسمك",
    "booking.notes": "ملاحظات",
    "booking.notesPlaceholder": "أضف ملاحظاتك هنا...",
    "booking.totalPrice": "السعر الإجمالي",
    "booking.confirm": "تأكيد الحجز",
    "booking.selectTime": "اختر الوقت",

    // Booking Confirmation
    "bookingConfirm.title": "تم تأكيد الحجز!",
    "bookingConfirm.teacher": "المعلم",
    "bookingConfirm.date": "التاريخ",
    "bookingConfirm.time": "الوقت",
    "bookingConfirm.price": "السعر",
    "bookingConfirm.student": "الطالب",
    "bookingConfirm.close": "إغلاق",

    // Teacher Profile
    "profile.notFound": "المعلم غير موجود",
    "profile.notFoundDesc": "لم نتمكن من العثور على المعلم المطلوب.",
    "profile.about": "نبذة عن المعلم",
    "profile.services": "الخدمات",
    "profile.perHour": "/ساعة",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.student": "طالب",
    "dashboard.teacher": "معلم",
    "dashboard.upcoming": "الدروس القادمة",
    "dashboard.history": "سجل الدروس",
    "dashboard.settings": "الإعدادات",
    "dashboard.joinLesson": "انضم للدرس",
    "dashboard.noLessons": "لا توجد دروس قادمة",
    "dashboard.user": "مستخدم",

    // Language
    "lang.ar": "العربية",
    "lang.de": "Deutsch",
  },

  de: {
    // Navbar
    "nav.home": "Startseite",
    "nav.teachers": "Lehrer",
    "nav.login": "Anmelden",
    "nav.register": "Registrieren",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Abmelden",

    // Hero
    "hero.title": "Lernen Sie Quran und Arabisch mit den besten Lehrern",
    "hero.subtitle": "Eine integrierte Plattform, die Sie mit den besten Lehrern für den Heiligen Quran, Arabisch und Islamische Studien verbindet",
    "hero.cta": "Lehrer durchsuchen",

    // Features
    "features.title": "Warum معلمي؟",
    "features.individual.title": "Einzelunterricht",
    "features.individual.subtitle": "Lernen Sie individuell mit einem Lehrer, der sich auf Ihre Bedürfnisse konzentriert",
    "features.flexibility.title": "Flexible Zeiten",
    "features.flexibility.subtitle": "Wählen Sie die passende Zeit aus mehreren Terminen",
    "features.certified.title": "Zertifizierte Lehrer",
    "features.certified.subtitle": "Alle unsere Lehrer sind zertifiziert und hoch erfahren",
    "features.live.title": "Live-Unterricht",
    "features.live.subtitle": "Interaktive Live-Sitzungen online",

    // Teachers Grid
    "teachers.title": "Empfohlene Lehrer",

    // Teacher Card
    "teacher.reviews": "Bewertung",
    "teacher.perHour": "/ Stunde",
    "teacher.yearsExp": "Jahre Erfahrung",
    "teacher.bookNow": "Jetzt buchen",

    // CTA Banner
    "cta.title": "Werden Sie Lehrer",
    "cta.subtitle": "Teilen Sie Ihr Wissen und werden Sie Teil unseres Lehrerteams",
    "cta.button": "Als Lehrer registrieren",

    // Footer
    "footer.rights": "Alle Rechte vorbehalten",

    // Auth Modal
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Vollständiger Name",
    "auth.confirmPassword": "Passwort bestätigen",
    "auth.loginButton": "Anmelden",
    "auth.registerButton": "Registrieren",
    "auth.noAccount": "Kein Konto?",
    "auth.hasAccount": "Bereits ein Konto?",
    "auth.welcomeBack": "Willkommen zurück",
    "auth.createAccount": "Erstellen Sie Ihr neues Konto",
    "auth.loginSuccess": "Erfolgreich angemeldet!",
    "auth.registerSuccess": "Konto erfolgreich erstellt!",
    "auth.fillAll": "Bitte füllen Sie alle Felder aus",
    "auth.passwordMismatch": "Passwörter stimmen nicht überein",

    // Booking
    "booking.title": "Stunde buchen",
    "booking.date": "Datum",
    "booking.startTime": "Startzeit",
    "booking.endTime": "Endzeit",
    "booking.name": "Name",
    "booking.namePlaceholder": "Geben Sie Ihren Namen ein",
    "booking.notes": "Notizen",
    "booking.notesPlaceholder": "Fügen Sie Ihre Notizen hinzu...",
    "booking.totalPrice": "Gesamtpreis",
    "booking.confirm": "Buchung bestätigen",
    "booking.selectTime": "Zeit wählen",

    // Booking Confirmation
    "bookingConfirm.title": "Buchung bestätigt!",
    "bookingConfirm.teacher": "Lehrer",
    "bookingConfirm.date": "Datum",
    "bookingConfirm.time": "Zeit",
    "bookingConfirm.price": "Preis",
    "bookingConfirm.student": "Student",
    "bookingConfirm.close": "Schließen",

    // Teacher Profile
    "profile.notFound": "Lehrer nicht gefunden",
    "profile.notFoundDesc": "Wir konnten den gewünschten Lehrer nicht finden.",
    "profile.about": "Über den Lehrer",
    "profile.services": "Dienstleistungen",
    "profile.perHour": "/Stunde",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.student": "Student",
    "dashboard.teacher": "Lehrer",
    "dashboard.upcoming": "Kommende Stunden",
    "dashboard.history": "Stundenverlauf",
    "dashboard.settings": "Einstellungen",
    "dashboard.joinLesson": "Stunde beitreten",
    "dashboard.noLessons": "Keine kommenden Stunden",
    "dashboard.user": "Benutzer",

    // Language
    "lang.ar": "العربية",
    "lang.de": "Deutsch",
  },
};