# معلمي / Mein Lehrer — Frontend Refinements

## Design References
- Color palette: #2F7A5B (primary green), #DCA842 (gold accent), #1A1A2E (dark navy), #F5F0E8 (warm cream)
- Typography: Arabic font (Cairo/Amiri), Sans-serif for German
- RTL/LTR dynamic switching

## Development Tasks

- [x] Update `src/data/mockData.ts` — all text fields become `{ ar, de }` bilingual objects (names, specializations, bios, services, upcomingLessons)
- [x] Update `src/i18n/LanguageContext.tsx` — add `isAuthenticated`, `userName`, `login(name)`, `logout()` to context
- [x] Update `src/i18n/translations.ts` — add new keys: `auth.loginRequired`, `auth.loginRequiredTitle`, `cta.teacherRegisterSuccess`, `brand.name`
- [x] Update `src/components/organisms/Navbar.tsx` — use `t("brand.name")` instead of hardcoded "معلمي"
- [x] Update `src/components/molecules/TeacherCard.tsx` — use `lang` to pick bilingual fields from teacher data
- [x] Update `src/components/organisms/TeacherProfileBooking.tsx` — auth-gate booking: if not authenticated, show toast warning + open AuthModal; if authenticated, show booking form
- [x] Update `src/pages/Index.tsx` — dynamic brand in footer, CTA button shows teacher registration success toast
- [x] Update `src/pages/TeacherProfile.tsx` — use bilingual data fields
- [x] Update `src/pages/Dashboard.tsx` — use bilingual data fields from upcomingLessons
- [x] Create `README.md` — Project title, description, tech stack, features, run instructions
- [x] Run `pnpm run lint && pnpm run build` to verify