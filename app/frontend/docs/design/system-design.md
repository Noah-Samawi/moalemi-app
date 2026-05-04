# معلمي (Moallemi) — System Design Document

## 1. Implementation Approach

We will build a **trilingual (Arabic, English, German) online tutoring marketplace** using the following approach:

1. **Frontend** — React 18 + TypeScript + Vite, styled with Tailwind CSS and shadcn/ui components. The UI supports full RTL for Arabic and LTR for English/German via the `LanguageContext` provider.
2. **Backend** — Atoms Cloud (Supabase) providing PostgreSQL database, Auth, Storage, and Edge Functions. This eliminates the need for a custom backend server.
3. **Internationalization** — All user-facing text (UI labels, teacher names, bios, specializations, announcements) is stored as trilingual objects (`{ar, en, de}`). The `LanguageContext` resolves the correct language at render time and handles RTL/LTR direction switching.
4. **Authentication** — Supabase Auth with email/password. Three roles: `STUDENT`, `TEACHER`, `ADMIN`. Role-based route guards on the frontend; Row Level Security (RLS) policies on the backend.
5. **Booking & Payments** — Bookings are created in `PENDING` status, confirmed by the teacher, and linked to a payment via Stripe integration (future phase). For MVP, payment is mocked.
6. **Video Lessons** — Jitsi Meet embedded via iframe for MVP; meeting URLs are generated and stored on each booking.
7. **MVP Scope** — Focus on core flows: browse teachers, book a lesson, teacher onboarding, admin approval, and dashboard. Reviews, advanced filtering, and Stripe payments are deferred.

---

## 2. User & UI Interaction Behaviors

### 2.1 Student
| Scenario | Interaction |
|---|---|
| Browse featured teachers | Scroll homepage, see `FeaturedTeachersGrid` with `TeacherCard` components |
| View teacher profile | Click a `TeacherCard` → navigate to `/teacher/:id` → see bio, specializations, services, availability, reviews |
| Book a lesson | On teacher profile, select date/time/service → click "Book Now" → fill booking form → confirm → see `BookingConfirmationToast` |
| Switch language | Click language selector in `Navbar` → entire UI switches language and direction (RTL/LTR) instantly |
| Login / Register | Click "Login" in `Navbar` → `AuthModal` appears → fill form → on success, redirect to dashboard |
| View dashboard | Navigate to `/dashboard` → see upcoming bookings, past lessons, and "Join Lesson" button |
| Leave a review | After completed lesson → click "Leave Review" → rate (1-5 stars) + comment |

### 2.2 Teacher
| Scenario | Interaction |
|---|---|
| Apply to teach | Click "Become a Teacher" → `/onboarding` → fill trilingual name, bio, specializations, rate, upload avatar → submit |
| Manage availability | In dashboard → set weekly recurring slots or specific date overrides |
| Confirm / Cancel bookings | In dashboard → see pending bookings → approve or decline |
| Join lesson | In dashboard → click "Join Lesson" → opens Jitsi meeting |

### 2.3 Admin
| Scenario | Interaction |
|---|---|
| Approve teachers | Navigate to `/admin` → see pending teacher applications → approve or reject |
| Feature teachers | Toggle `is_featured` on any approved teacher |
| Manage announcements | Create/edit/deactivate trilingual announcements displayed on homepage |

---

## 3. Data Structures and Interfaces Overview

### Core Models
- **User** — `id, email, full_name, role, avatar_url, preferred_language, created_at, updated_at`
- **Teacher** — `id, user_id, name_{ar,en,de}, bio_{ar,en,de}, avatar_url, hourly_rate, experience_years, rating, reviews_count, is_pro, is_featured, is_approved`
- **Service** — `id, teacher_id, name_{ar,en,de}, description_{ar,en,de}, sort_order`
- **Availability** — `id, teacher_id, day_of_week, start_time, end_time, is_recurring, specific_date`
- **Booking** — `id, student_id, teacher_id, service_id, date, start_time, end_time, status, notes, total_price, payment_status, meeting_url`
- **Review** — `id, booking_id, student_id, teacher_id, rating, comment`
- **Announcement** — `id, title_{ar,en,de}, content_{ar,en,de}, is_active, created_by`

### Service Interfaces
- **IAuthService** — `login(), register(), logout(), getCurrentUser(), onAuthStateChange()`
- **ITeacherService** — `getTeachers(filters), getTeacherById(id), createTeacherProfile(data), updateTeacherProfile(id, data), getFeaturedTeachers()`
- **IBookingService** — `createBooking(data), getBookingsByStudent(id), getBookingsByTeacher(id), cancelBooking(id), confirmBooking(id)`
- **IAdminService** — `getPendingTeachers(), approveTeacher(id), toggleFeatured(id), deleteTeacher(id), createAnnouncement(data), updateAnnouncement(id, data)`
- **IReviewService** — `createReview(data), getReviewsByTeacher(id)`

> See `class_diagram.plantuml` for full detail.

---

## 4. Program Call Flow Overview

### 4.1 Registration & Login
1. User clicks "Login" → `AuthModal` opens
2. User submits credentials → `AuthService.login()` → Supabase Auth `signInWithPassword()`
3. On success → fetch user record from DB → set `AuthContext` → redirect to dashboard
4. Registration follows same pattern via `signUp()` + INSERT into `users` table

### 4.2 Browse & Book a Teacher
1. Homepage loads → `TeacherService.getFeaturedTeachers()` → GET `/teachers?featured=true`
2. User clicks teacher card → navigate to `/teacher/:id` → `TeacherService.getTeacherById(id)`
3. User selects date/time → `BookingService.createBooking()` → POST `/bookings`
4. Booking created with `PENDING` status → teacher confirms → status becomes `CONFIRMED`

### 4.3 Teacher Onboarding
1. User clicks "Become a Teacher" → `/onboarding` page
2. Fills trilingual form + uploads avatar → avatar stored in Supabase Storage
3. `TeacherService.createTeacherProfile()` → POST `/teachers` with `is_approved=false`
4. Admin reviews and approves → teacher appears in search

### 4.4 Admin Approval
1. Admin navigates to `/admin` → `AdminService.getPendingTeachers()`
2. Clicks "Approve" → `AdminService.approveTeacher(id)` → PATCH `/admin/teachers/:id/approve`
3. Teacher's `is_approved` set to `true` → visible in public listings

> See `sequence_diagram.plantuml` for full detail.

---

## 5. Database ER Diagram Overview

The database uses **PostgreSQL** (via Supabase) with the following key design decisions:

- **Trilingual fields** are stored as separate columns (`name_ar`, `name_en`, `name_de`) rather than JSONB, enabling efficient indexing and querying per language.
- **Row Level Security (RLS)** policies enforce: students can only see approved teachers; teachers can only edit their own profile; admins have full access.
- **Soft relationships** via UUID foreign keys with `ON DELETE CASCADE` for bookings/reviews when a user is deleted.
- **Indexes** on `teachers.is_featured`, `teachers.is_approved`, `bookings.student_id`, `bookings.teacher_id`, and `bookings.status` for query performance.

> See `er_diagram.plantuml` for full detail.

---

## 6. Unclear Aspects or Assumptions

| # | Item | Assumption / Clarification Needed |
|---|---|---|
| 1 | **Payment integration** | Assumed Stripe for MVP phase 2. Currently mocked. Need to confirm payment flow (pre-pay vs. post-lesson). |
| 2 | **Video provider** | Assumed Jitsi Meet (free, embeddable). Need to confirm if Zoom/Google Meet integration is required. |
| 3 | **Notification system** | Not in MVP scope. Assumed email notifications via Supabase Edge Functions + Resend/SendGrid in future. |
| 4 | **Teacher availability calendar** | Assumed simple weekly recurring slots + date-specific overrides. Need to confirm if a full calendar UI with drag-and-drop is needed. |
| 5 | **Content moderation** | Assumed admin manually reviews teacher profiles. Need to confirm if automated content filtering is required. |
| 6 | **Multi-currency** | Assumed single currency (USD) for MVP. Need to confirm if regional pricing is needed. |
| 7 | **Offline support** | Not in scope. All features require internet connectivity. |