-- ============================================================
-- Moalemi — Schema & FK Fixes
-- Ausführen: Supabase Dashboard → SQL Editor → Paste → Run
-- ============================================================
--
-- PROBLEM 1: "Could not find the 'banner' column of 'teachers'"
--   Ursache: Tabelle wurde erstellt BEVOR 'banner' im Schema stand.
--   Lösung:  Spalte nachträglich hinzufügen.
--
-- PROBLEM 2: Admin-Delete schlägt fehl (FK-Constraint Violation)
--   Ursache: Foreign-Key-Constraints auf teachers.id fehlen
--            oder wurden ohne ON DELETE CASCADE erstellt.
--   Lösung:  FKs löschen und neu anlegen mit ON DELETE CASCADE.
-- ============================================================

BEGIN;

-- ── 1. banner-Spalte zu teachers hinzufügen ──────────────────
ALTER TABLE teachers
  ADD COLUMN IF NOT EXISTS banner TEXT;

-- ── 2. FK Constraints mit CASCADE neu erstellen ──────────────

-- bookings.teacher_id → teachers.id  (ON DELETE CASCADE)
ALTER TABLE bookings
  DROP CONSTRAINT IF EXISTS bookings_teacher_id_fkey;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_teacher_id_fkey
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE;

-- reviews.teacher_id → teachers.id  (ON DELETE CASCADE)
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_teacher_id_fkey;
ALTER TABLE reviews
  ADD CONSTRAINT reviews_teacher_id_fkey
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE;

-- channels.booking_id → bookings.id  (ON DELETE CASCADE — schon im Original)
-- Nur ausführen wenn du sicher bist, dass die aktuelle Definition fehlt:
-- ALTER TABLE channels
--   DROP CONSTRAINT IF EXISTS channels_booking_id_fkey;
-- ALTER TABLE channels
--   ADD CONSTRAINT channels_booking_id_fkey
--     FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

COMMIT;

-- ============================================================
-- NACH DIESEM SCRIPT:
--
-- 1. "banner"-Spalte existiert → TeacherOnboarding kann Banner
--    hochladen. Im Frontend: 'banner' zurück zu TEACHER_COLUMNS
--    in teacherService.ts hinzufügen und die strippin-Logik
--    in createTeacher / updateTeacher entfernen.
--
-- 2. Admin-Delete funktioniert wieder vollständig:
--    Lehrer + zugehörige Buchungen + Reviews werden kaskadierend
--    gelöscht ohne FK-Constraint-Fehler.
-- ============================================================
