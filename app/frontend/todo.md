# معلمي App — Reviews & Ratings Feature

## Development Tasks

- [x] Add `reviews` table to supabase-schema.sql with RLS policies
- [x] Create `src/services/reviewService.ts` — CRUD operations for reviews (fetch by teacher, create, check if user already reviewed)
- [x] Create `src/components/molecules/ReviewCard.tsx` — Display a single review with avatar, name, rating, comment, date
- [x] Create `src/components/molecules/ReviewForm.tsx` — Star rating selector + comment textarea + submit button (auth-gated)
- [x] Create `src/components/organisms/ReviewsSection.tsx` — Container: reviews list + ReviewForm + average rating summary
- [x] Update `src/components/organisms/TeacherProfileBooking.tsx` — Add ReviewsSection below bio/services
- [x] Update `src/i18n/translations.ts` — Add review-related translation keys (ar/en/de)
- [x] Run lint and build verification