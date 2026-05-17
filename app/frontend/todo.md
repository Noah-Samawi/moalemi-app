# Restore Lost Features — معلمي App

## Development Tasks

- [x] Add `resetPassword()` to authService.ts
- [x] Add `resetPassword` to useSupabaseAuth.ts hook
- [x] Add `resetPassword` to AuthContext.tsx
- [x] Re-add "forgot" tab in AuthModal.tsx with email input, send reset link, success message, back to login
- [x] Create src/services/reviewService.ts — CRUD for reviews via Supabase
- [x] Create src/components/molecules/ReviewCard.tsx — single review display
- [x] Create src/components/molecules/ReviewForm.tsx — star rating + comment form (auth-gated)
- [x] Create src/components/organisms/ReviewsSection.tsx — reviews list + form + rating summary
- [x] Add ReviewsSection to TeacherProfileBooking.tsx below bio/services
- [x] Re-add forgot-password translation keys (auth.forgotPassword, auth.forgotPasswordDesc, auth.sendResetLink, auth.resetPasswordSuccess, auth.enterEmail, auth.backToLogin) in ar/en/de
- [x] Re-add review translation keys in ar/en/de
- [x] Re-add reviews table, indexes, RLS policies, and update_teacher_rating trigger to supabase-schema.sql
- [x] Run lint and build verification