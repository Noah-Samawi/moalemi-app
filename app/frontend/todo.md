# Bug Fix Plan — معلمي App

## Development Tasks

- [x] Fix TeacherOnboarding auth guard: block form if not logged in, show AuthModal, pass user_id on submit
- [x] Fix teacherService.createTeacher to accept and pass user_id
- [x] Hard-lock AdminDashboard to noahalsamawi688@gmail.com only, add toast notifications for all admin actions
- [x] Update supabase-schema.sql with proper RLS policies (drop old, create new with exact admin email)
- [x] Run lint and build verification