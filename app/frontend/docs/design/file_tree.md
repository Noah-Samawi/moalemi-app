# معلمي (Moallemi) — Project File Structure

```
moallemi/
├── public/
│   ├── favicon.ico
│   └── locales/                    # Static locale assets (if any)
│
├── src/
│   ├── App.tsx                     # Root component: routing + providers
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles + Tailwind directives
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── atoms/                  # Smallest reusable UI elements
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/              # Composed from atoms
│   │   │   ├── TeacherCard.tsx
│   │   │   ├── BookingFormGroup.tsx
│   │   │   ├── BookingConfirmationToast.tsx
│   │   │   ├── FeatureItem.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/              # Complex UI sections
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedTeachersGrid.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── TeacherProfileBooking.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── AnnouncementBanner.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── layouts/
│   │       ├── MainLayout.tsx      # Navbar + footer wrapper
│   │       └── DashboardLayout.tsx # Sidebar + content wrapper
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── TeacherProfilePage.tsx
│   │   ├── TeacherListPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── TeacherOnboardingPage.tsx
│   │   └── AuthCallbackPage.tsx
│   │
│   ├── i18n/
│   │   ├── LanguageContext.tsx      # Provider + hook (useLanguage)
│   │   └── translations.ts         # All translation keys {ar, en, de}
│   │
│   ├── services/                   # API service layer
│   │   ├── authService.ts          # IAuthService implementation
│   │   ├── teacherService.ts       # ITeacherService implementation
│   │   ├── bookingService.ts       # IBookingService implementation
│   │   ├── adminService.ts         # IAdminService implementation
│   │   ├── reviewService.ts        # IReviewService implementation
│   │   └── api.ts                  # Supabase client + axios config
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Auth state + actions
│   │   ├── useTeachers.ts          # Teacher data fetching
│   │   ├── useBookings.ts          # Booking data fetching
│   │   └── useDirection.ts         # RTL/LTR direction helper
│   │
│   ├── data/
│   │   └── mockData.ts             # Trilingual mock data for development
│   │
│   ├── types/
│   │   ├── models.ts               # User, Teacher, Booking, Review, etc.
│   │   ├── dto.ts                  # Request/Response DTOs
│   │   ├── enums.ts                # UserRole, BookingStatus, PaymentStatus, Language
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── trilingual.ts           # Helpers: getLocalizedText(obj, lang)
│   │   ├── formatting.ts           # Price, date, time formatting
│   │   └── validation.ts           # Form validation helpers
│   │
│   └── config/
│       └── supabase.ts             # Supabase client initialization
│
├── docs/
│   └── design/
│       ├── system-design.md
│       ├── architect.plantuml
│       ├── class_diagram.plantuml
│       ├── sequence_diagram.plantuml
│       ├── er_diagram.plantuml
│       ├── ui_navigation.plantuml
│       └── file_tree.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── components.json                 # shadcn/ui config
└── README.md
```