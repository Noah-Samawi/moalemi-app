export type Language = "ar" | "en" | "de";

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navbar
    "nav.home": "الرئيسية",
    "nav.teachers": "المعلمون",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.dashboard": "لوحة التحكم",
    "nav.logout": "تسجيل الخروج",
    "nav.admin": "الإدارة",
    "nav.onboarding": "كن معلماً",

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
    "teacher.pro": "مميز",

    // CTA Banner
    "cta.title": "انضم كمعلم",
    "cta.subtitle": "شارك علمك وانضم لفريق المعلمين",
    "cta.button": "سجّل كمعلم",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",

    // Brand
    "brand.name": "معلمي",

    // Auth
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
    "auth.loginRequiredTitle": "تسجيل الدخول مطلوب",
    "auth.loginRequired": "يجب تسجيل الدخول لحجز موعد",

    // CTA Success
    "cta.teacherRegisterSuccess": "تم إرسال طلبك للإدارة للمراجعة",

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
    "lang.en": "الإنجليزية",
    "lang.de": "Deutsch",

    // Admin
    "admin.title": "لوحة الإدارة",
    "admin.teachers": "المعلمون",
    "admin.pro": "مميز",
    "admin.featured": "مميز",
    "admin.approve": "موافقة",
    "admin.delete": "حذف",
    "admin.announcements": "الإعلانات",
    "admin.save": "حفظ",
    "admin.accessDenied": "تم رفض الوصول",
    "admin.accessDeniedDesc": "ليس لديك صلاحية للوصول إلى هذه الصفحة.",

    // Onboarding
    "onboarding.title": "كن معلماً",
    "onboarding.nameAr": "الاسم (بالعربية)",
    "onboarding.nameEn": "الاسم (بالإنجليزية)",
    "onboarding.nameDe": "الاسم (بالألمانية)",
    "onboarding.bioAr": "نبذة (بالعربية)",
    "onboarding.bioEn": "نبذة (بالإنجليزية)",
    "onboarding.bioDe": "نبذة (بالألمانية)",
    "onboarding.specializations": "التخصصات",
    "onboarding.hourlyRate": "السعر بالساعة ($)",
    "onboarding.experience": "سنوات الخبرة",
    "onboarding.submit": "إرسال الطلب",
    "onboarding.success": "تم إرسال الطلب بنجاح!",
  },

  en: {
    // Navbar
    "nav.home": "Home",
    "nav.teachers": "Teachers",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",
    "nav.admin": "Admin",
    "nav.onboarding": "Become a Teacher",

    // Hero
    "hero.title": "Learn Quran & Arabic with the Best Teachers",
    "hero.subtitle": "A comprehensive platform connecting you with the best teachers for the Holy Quran, Arabic language, and Islamic studies",
    "hero.cta": "Browse Teachers",

    // Features
    "features.title": "Why My Teacher?",
    "features.individual.title": "Individual Lessons",
    "features.individual.subtitle": "Learn one-on-one with a dedicated teacher focused on your needs",
    "features.flexibility.title": "Flexible Schedule",
    "features.flexibility.subtitle": "Choose the time that suits you from multiple available slots",
    "features.certified.title": "Certified Teachers",
    "features.certified.subtitle": "All our teachers are certified and highly experienced",
    "features.live.title": "Live Lessons",
    "features.live.subtitle": "Interactive live sessions online",

    // Teachers Grid
    "teachers.title": "Featured Teachers",

    // Teacher Card
    "teacher.reviews": "reviews",
    "teacher.perHour": "/ hour",
    "teacher.yearsExp": "years experience",
    "teacher.bookNow": "Book Now",
    "teacher.pro": "PRO",

    // CTA Banner
    "cta.title": "Join as a Teacher",
    "cta.subtitle": "Share your knowledge and join our team of teachers",
    "cta.button": "Register as Teacher",

    // Footer
    "footer.rights": "All rights reserved",

    // Brand
    "brand.name": "My Teacher",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.confirmPassword": "Confirm Password",
    "auth.loginButton": "Login",
    "auth.registerButton": "Register",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.welcomeBack": "Welcome Back",
    "auth.createAccount": "Create Your New Account",
    "auth.loginSuccess": "Login successful!",
    "auth.registerSuccess": "Account created successfully!",
    "auth.fillAll": "Please fill in all fields",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.loginRequiredTitle": "Login Required",
    "auth.loginRequired": "You must be logged in to book a session",

    // CTA Success
    "cta.teacherRegisterSuccess": "Your application has been sent to the admin for review",

    // Booking
    "booking.title": "Book a Lesson",
    "booking.date": "Date",
    "booking.startTime": "Start Time",
    "booking.endTime": "End Time",
    "booking.name": "Name",
    "booking.namePlaceholder": "Enter your name",
    "booking.notes": "Notes",
    "booking.notesPlaceholder": "Add your notes here...",
    "booking.totalPrice": "Total Price",
    "booking.confirm": "Confirm Booking",
    "booking.selectTime": "Select Time",

    // Booking Confirmation
    "bookingConfirm.title": "Booking Confirmed!",
    "bookingConfirm.teacher": "Teacher",
    "bookingConfirm.date": "Date",
    "bookingConfirm.time": "Time",
    "bookingConfirm.price": "Price",
    "bookingConfirm.student": "Student",
    "bookingConfirm.close": "Close",

    // Teacher Profile
    "profile.notFound": "Teacher Not Found",
    "profile.notFoundDesc": "We couldn't find the teacher you're looking for.",
    "profile.about": "About the Teacher",
    "profile.services": "Services",
    "profile.perHour": "/hour",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.student": "Student",
    "dashboard.teacher": "Teacher",
    "dashboard.upcoming": "Upcoming Lessons",
    "dashboard.history": "Lesson History",
    "dashboard.settings": "Settings",
    "dashboard.joinLesson": "Join Lesson",
    "dashboard.noLessons": "No upcoming lessons",
    "dashboard.user": "User",

    // Language
    "lang.ar": "العربية",
    "lang.en": "English",
    "lang.de": "Deutsch",

    // Admin
    "admin.title": "Admin Dashboard",
    "admin.teachers": "Teachers",
    "admin.pro": "PRO",
    "admin.featured": "Featured",
    "admin.approve": "Approve",
    "admin.delete": "Delete",
    "admin.announcements": "Announcements",
    "admin.save": "Save",
    "admin.accessDenied": "Access Denied",
    "admin.accessDeniedDesc": "You do not have permission to access this page.",

    // Onboarding
    "onboarding.title": "Become a Teacher",
    "onboarding.nameAr": "Name (Arabic)",
    "onboarding.nameEn": "Name (English)",
    "onboarding.nameDe": "Name (German)",
    "onboarding.bioAr": "Bio (Arabic)",
    "onboarding.bioEn": "Bio (English)",
    "onboarding.bioDe": "Bio (German)",
    "onboarding.specializations": "Specializations",
    "onboarding.hourlyRate": "Hourly Rate ($)",
    "onboarding.experience": "Years of Experience",
    "onboarding.submit": "Submit Application",
    "onboarding.success": "Application submitted successfully!",
  },

  de: {
    // Navbar
    "nav.home": "Startseite",
    "nav.teachers": "Lehrer",
    "nav.login": "Anmelden",
    "nav.register": "Registrieren",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Abmelden",
    "nav.admin": "Verwaltung",
    "nav.onboarding": "Lehrer werden",

    // Hero
    "hero.title": "Lernen Sie Quran und Arabisch mit den besten Lehrern",
    "hero.subtitle": "Eine integrierte Plattform, die Sie mit den besten Lehrern für den Heiligen Quran, Arabisch und Islamische Studien verbindet",
    "hero.cta": "Lehrer durchsuchen",

    // Features
    "features.title": "Warum Mein Lehrer?",
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
    "teacher.pro": "PRO",

    // CTA Banner
    "cta.title": "Werden Sie Lehrer",
    "cta.subtitle": "Teilen Sie Ihr Wissen und werden Sie Teil unseres Lehrerteams",
    "cta.button": "Als Lehrer registrieren",

    // Footer
    "footer.rights": "Alle Rechte vorbehalten",

    // Brand
    "brand.name": "Mein Lehrer",

    // Auth
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
    "auth.loginRequiredTitle": "Anmeldung erforderlich",
    "auth.loginRequired": "Sie müssen sich anmelden, um einen Termin zu buchen",

    // CTA Success
    "cta.teacherRegisterSuccess": "Ihre Bewerbung wurde zur Überprüfung an den Administrator gesendet.",

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
    "lang.en": "Englisch",
    "lang.de": "Deutsch",

    // Admin
    "admin.title": "Admin-Dashboard",
    "admin.teachers": "Lehrer",
    "admin.pro": "PRO",
    "admin.featured": "Empfohlen",
    "admin.approve": "Genehmigen",
    "admin.delete": "Löschen",
    "admin.announcements": "Ankündigungen",
    "admin.save": "Speichern",
    "admin.accessDenied": "Zugriff verweigert",
    "admin.accessDeniedDesc": "Sie haben keine Berechtigung für diese Seite.",

    // Onboarding
    "onboarding.title": "Lehrer werden",
    "onboarding.nameAr": "Name (Arabisch)",
    "onboarding.nameEn": "Name (Englisch)",
    "onboarding.nameDe": "Name (Deutsch)",
    "onboarding.bioAr": "Biografie (Arabisch)",
    "onboarding.bioEn": "Biografie (Englisch)",
    "onboarding.bioDe": "Biografie (Deutsch)",
    "onboarding.specializations": "Spezialisierungen",
    "onboarding.hourlyRate": "Stundensatz ($)",
    "onboarding.experience": "Jahre Erfahrung",
    "onboarding.submit": "Antrag einreichen",
    "onboarding.success": "Antrag erfolgreich eingereicht!",
  },
};