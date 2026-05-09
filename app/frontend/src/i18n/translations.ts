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
    "auth.forgotPassword": "نسيت كلمة المرور؟",
    "auth.forgotPasswordDesc": "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور",
    "auth.sendResetLink": "إرسال رابط إعادة التعيين",
    "auth.resetPasswordSuccess": "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني",
    "auth.backToLogin": "العودة لتسجيل الدخول",

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
    "booking.error": "تعذر إتمام الحجز. تحقق من تسجيل الدخول أو إعدادات قاعدة البيانات.",

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
    "profile.edit": "تعديل الملف الشخصي",

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
    "dashboard.joinSoon": "رابط الانضمام سيتوفر قبل موعد الدرس.",
    "dashboard.role": "الدور",
    "dashboard.status": "الحالة",
    "dashboard.totalLessons": "إجمالي الدروس",
    "dashboard.completedLessons": "الدروس المكتملة",
    "dashboard.becomeTeacher": "كن معلماً",

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
    "admin.features": "المزايا",
    "admin.advertising": "الإعلانات الترويجية",
    "admin.save": "حفظ",
    "admin.teacherUpdated": "تم تحديث بيانات المعلم",
    "admin.teacherApproved": "تمت الموافقة على المعلم",
    "admin.teacherDeleted": "تم حذف المعلم",
    "admin.contentSaved": "تم حفظ المحتوى بنجاح",
    "admin.actionFailed": "فشل تنفيذ العملية",
    "admin.announcementAr": "الإعلان (عربي)",
    "admin.announcementDe": "الإعلان (ألماني)",
    "admin.titleAr": "العنوان (عربي)",
    "admin.titleDe": "العنوان (ألماني)",
    "admin.bodyAr": "الوصف (عربي)",
    "admin.bodyDe": "الوصف (ألماني)",
    "admin.uploadImage": "رفع صورة",
    "admin.deleteImage": "حذف الصورة",
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
    "onboarding.loginRequired": "يجب تسجيل الدخول لتقديم طلب الانضمام كمعلم",
    "onboarding.loginRegister": "تسجيل الدخول / إنشاء حساب",
    "onboarding.editTitle": "تعديل الملف الشخصي للمعلم",

    // Reviews
    "review.reviews": "تقييم",
    "review.writeReview": "اكتب تقييماً",
    "review.yourRating": "تقييمك",
    "review.yourComment": "تعليقك",
    "review.commentPlaceholder": "شاركنا رأيك في تجربتك...",
    "review.submit": "إرسال التقييم",
    "review.submitting": "جارٍ الإرسال...",
    "review.selectRating": "يرجى اختيار التقييم",
    "review.alreadyReviewed": "لقد قمت بتقييم هذا المعلم مسبقاً",
    "review.submitError": "حدث خطأ أثناء إرسال التقييم",
    "review.cancel": "إلغاء",
    "review.noReviews": "لا توجد تقييمات بعد",
    "review.userFallback": "مستخدم",
    "review.selfBlocked": "لا يمكنك تقييم نفسك كمعلم.",
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
    "auth.forgotPassword": "Forgot Password?",
    "auth.forgotPasswordDesc": "Enter your email and we'll send you a link to reset your password",
    "auth.sendResetLink": "Send Reset Link",
    "auth.resetPasswordSuccess": "A password reset link has been sent to your email",
    "auth.backToLogin": "Back to Login",

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
    "booking.error": "Could not complete booking. Please verify login and database setup.",

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
    "profile.edit": "Edit Profile",

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
    "dashboard.joinSoon": "Join link will be available shortly before lesson time.",
    "dashboard.role": "Role",
    "dashboard.status": "Status",
    "dashboard.totalLessons": "Total Lessons",
    "dashboard.completedLessons": "Completed Lessons",
    "dashboard.becomeTeacher": "Become a Teacher",

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
    "admin.features": "Features",
    "admin.advertising": "Advertising",
    "admin.save": "Save",
    "admin.teacherUpdated": "Teacher updated",
    "admin.teacherApproved": "Teacher approved",
    "admin.teacherDeleted": "Teacher deleted",
    "admin.contentSaved": "Content saved successfully",
    "admin.actionFailed": "Action failed",
    "admin.announcementAr": "Announcement (Arabic)",
    "admin.announcementDe": "Announcement (German)",
    "admin.titleAr": "Title (Arabic)",
    "admin.titleDe": "Title (German)",
    "admin.bodyAr": "Body (Arabic)",
    "admin.bodyDe": "Body (German)",
    "admin.uploadImage": "Upload image",
    "admin.deleteImage": "Delete image",
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
    "onboarding.loginRequired": "You must be logged in to submit a teacher application",
    "onboarding.loginRegister": "Login / Register",
    "onboarding.editTitle": "Edit Teacher Profile",

    // Reviews
    "review.reviews": "reviews",
    "review.writeReview": "Write a Review",
    "review.yourRating": "Your Rating",
    "review.yourComment": "Your Comment",
    "review.commentPlaceholder": "Share your experience...",
    "review.submit": "Submit Review",
    "review.submitting": "Submitting...",
    "review.selectRating": "Please select a rating",
    "review.alreadyReviewed": "You have already reviewed this teacher",
    "review.submitError": "An error occurred while submitting your review",
    "review.cancel": "Cancel",
    "review.noReviews": "No reviews yet",
    "review.userFallback": "User",
    "review.selfBlocked": "You cannot review yourself as a teacher.",
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
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.forgotPasswordDesc": "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts",
    "auth.sendResetLink": "Link zum Zurücksetzen senden",
    "auth.resetPasswordSuccess": "Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet",
    "auth.backToLogin": "Zurück zur Anmeldung",

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
    "booking.error": "Buchung konnte nicht abgeschlossen werden. Bitte Login und Datenbank-Konfiguration prüfen.",

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
    "profile.edit": "Profil bearbeiten",

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
    "dashboard.joinSoon": "Der Beitrittslink wird kurz vor Unterrichtsbeginn verfügbar.",
    "dashboard.role": "Rolle",
    "dashboard.status": "Status",
    "dashboard.totalLessons": "Gesamtstunden",
    "dashboard.completedLessons": "Abgeschlossene Stunden",
    "dashboard.becomeTeacher": "Lehrer werden",

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
    "admin.features": "Merkmale",
    "admin.advertising": "Werbeinhalte",
    "admin.save": "Speichern",
    "admin.teacherUpdated": "Lehrer aktualisiert",
    "admin.teacherApproved": "Lehrer genehmigt",
    "admin.teacherDeleted": "Lehrer gelöscht",
    "admin.contentSaved": "Inhalt erfolgreich gespeichert",
    "admin.actionFailed": "Aktion fehlgeschlagen",
    "admin.announcementAr": "Ankündigung (Arabisch)",
    "admin.announcementDe": "Ankündigung (Deutsch)",
    "admin.titleAr": "Titel (Arabisch)",
    "admin.titleDe": "Titel (Deutsch)",
    "admin.bodyAr": "Inhalt (Arabisch)",
    "admin.bodyDe": "Inhalt (Deutsch)",
    "admin.uploadImage": "Bild hochladen",
    "admin.deleteImage": "Bild löschen",
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
    "onboarding.loginRequired": "Sie müssen angemeldet sein, um eine Lehrerbewerbung einzureichen",
    "onboarding.loginRegister": "Anmelden / Registrieren",
    "onboarding.editTitle": "Lehrerprofil bearbeiten",

    // Reviews
    "review.reviews": "Bewertungen",
    "review.writeReview": "Bewertung schreiben",
    "review.yourRating": "Ihre Bewertung",
    "review.yourComment": "Ihr Kommentar",
    "review.commentPlaceholder": "Teilen Sie Ihre Erfahrung...",
    "review.submit": "Bewertung absenden",
    "review.submitting": "Wird gesendet...",
    "review.selectRating": "Bitte wählen Sie eine Bewertung",
    "review.alreadyReviewed": "Sie haben diesen Lehrer bereits bewertet",
    "review.submitError": "Beim Absenden der Bewertung ist ein Fehler aufgetreten",
    "review.cancel": "Abbrechen",
    "review.noReviews": "Noch keine Bewertungen",
    "review.userFallback": "Benutzer",
    "review.selfBlocked": "Sie können sich als Lehrer nicht selbst bewerten.",
  },
};