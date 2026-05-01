# معلمي - Enhancement Tasks

## Design References
- Islamic color palette: #1A1A2E (dark), #2F7A5B (green), #DCA842 (gold), #FDF8F0 (cream)
- Arabic font: Cairo, German font: Inter
- RTL layout for Arabic, LTR for German

## Development Tasks

- [ ] Create i18n language context (`src/i18n/LanguageContext.tsx`) with Arabic/German toggle
- [ ] Create translations file (`src/i18n/translations.ts`) with all UI text in Arabic and German
- [ ] Create AuthModal component (`src/components/organisms/AuthModal.tsx`) with login/register tabs
- [ ] Update Navbar to include language toggle button and AuthModal trigger
- [ ] Replace alert() in TeacherProfileBooking with a toast notification component
- [ ] Create BookingConfirmationToast component (`src/components/molecules/BookingConfirmationToast.tsx`)
- [ ] Update App.tsx to wrap with LanguageProvider
- [ ] Update Index.tsx, HeroSection, FeaturedTeachersGrid, FeatureItem, TeacherCard, Dashboard, DashboardSidebar to use translations
- [ ] Run lint and build, fix any errors