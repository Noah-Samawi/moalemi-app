# معلمي / Mein Lehrer / My Teacher — Frontend Enhancements

## Design References
- Color palette: #2F7A5B (primary green), #DCA842 (gold accent), #1A1A2E (dark navy), #F5F0E8 (warm cream)
- PRO badge: Gold (#DCA842) with white text
- Typography: Arabic (Cairo), English/German (Inter/sans-serif)
- RTL/LTR dynamic switching based on language

## Development Tasks

- [x] Update `src/i18n/LanguageContext.tsx` — Add "en" as third language, update type, dir logic (ar=rtl, en/de=ltr), update toggleLanguage to cycle ar→en→de→ar
- [x] Update `src/i18n/translations.ts` — Add full English translation block, update Language type to "ar" | "en" | "de"
- [x] Update `src/data/mockData.ts` — Change BilingualText to TrilingualText {ar, en, de}, add en text to all teachers, add is_pro and featured boolean fields to Teacher interface, mark teachers 1 and 3 as is_pro=true and featured=true
- [x] Update `src/components/organisms/Navbar.tsx` — Replace toggle button with 3-language dropdown (AR/EN/DE), update brand name for English ("My Teacher"), add admin link for noah.alsamawi@gmail.com
- [x] Update `src/components/molecules/TeacherCard.tsx` — Add gold PRO badge for is_pro teachers, update lang references for trilingual data
- [x] Update `src/components/organisms/FeaturedTeachersGrid.tsx` — Sort teachers: featured/is_pro first, then by rating; update lang for trilingual
- [x] Create `src/pages/AdminDashboard.tsx` — Admin page restricted to noah.alsamawi@gmail.com: teacher list with approve/delete toggles, PRO/Featured toggle per teacher, announcement banner management
- [x] Create `src/pages/TeacherOnboarding.tsx` — Teacher registration form: name (ar/en/de), bio (ar/en/de), specializations, hourly rate, experience, avatar upload placeholder
- [x] Update `src/App.tsx` — Add routes for /admin and /onboarding, import new pages
- [x] Update `src/pages/Index.tsx` — Add English brand name support in footer
- [x] Run `pnpm run lint && pnpm run build` to verify