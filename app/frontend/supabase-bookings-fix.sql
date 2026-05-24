-- ============================================================
-- Moalemi — Bookings Table Fix & RLS Policies
-- Ausführen: Supabase Dashboard → SQL Editor → Paste → Run
--
-- Root-Cause des Fehlers:
--   "Buchung konnte nicht abgeschlossen werden."
--
--   1. Tabelle existiert nicht ODER wurde ohne die neuen Spalten
--      erstellt (booking_date / start_time / end_time / student_name
--      / notes / total_price).
--   2. RLS ist aktiv, aber die INSERT-Policy fehlt, sodass Supabase
--      den Schreibzugriff für eingeloggte Schüler blockiert.
--
-- Dieses Script ist idempotent — es kann mehrfach ohne Fehler
-- ausgeführt werden.
-- ============================================================

BEGIN;

-- ── 1. Tabelle erstellen (falls nicht vorhanden) ─────────────
--    Spaltennamen entsprechen exakt bookingService.ts / CreateBookingData
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  teacher_id    UUID        REFERENCES teachers(id)   ON DELETE CASCADE NOT NULL,
  booking_date  TEXT,          -- Datum z.B. "2025-07-10"
  start_time    TEXT,          -- Startzeit z.B. "09:00"
  end_time      TEXT,          -- Endzeit   z.B. "10:00"
  student_name  TEXT,          -- Name des Schülers (aus dem Formular)
  notes         TEXT,          -- optionale Notizen / Thema der Stunde
  total_price   NUMERIC,       -- Gesamtpreis in Euro
  status        TEXT           DEFAULT 'pending'
                               CHECK (status IN ('pending','upcoming','scheduled',
                                                 'confirmed','completed','cancelled')),
  created_at    TIMESTAMPTZ    DEFAULT now()
);

-- ── 2. Fehlende Spalten nachträglich hinzufügen ──────────────
--    Schützt vor dem Fall, dass die Tabelle mit dem alten Schema
--    existiert (z.B. nur subject_ar / date / time).
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time    TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_time      TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS student_name  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes         TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price   NUMERIC;

-- ── 3. FK-Constraints mit CASCADE sicherstellen ─────────────
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_teacher_id_fkey;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_teacher_id_fkey
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE;

-- ── 4. RLS aktivieren ────────────────────────────────────────
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ── 5. Alte Policies löschen (verhindert "already exists") ───
DROP POLICY IF EXISTS "bookings_student_full_access"      ON bookings;
DROP POLICY IF EXISTS "bookings_insert_for_authenticated" ON bookings;
DROP POLICY IF EXISTS "bookings_teacher_read"             ON bookings;
DROP POLICY IF EXISTS "bookings_teacher_update"           ON bookings;
DROP POLICY IF EXISTS "admin_all_bookings"                ON bookings;

-- ── 6. Neue Policies anlegen ─────────────────────────────────

-- Policy A: Schüler können eigene Buchungen erstellen, lesen
--           und stornieren. student_id muss der eigenen UID entsprechen.
--           WICHTIG: WITH CHECK für INSERT, USING für SELECT/UPDATE/DELETE.
CREATE POLICY "bookings_student_full_access"
  ON bookings FOR ALL
  TO authenticated
  USING     (auth.uid() = student_id)
  WITH CHECK(auth.uid() = student_id);

-- Policy B: Lehrer können Buchungen für sie lesen
--           (JOIN über teachers.user_id = auth.uid())
CREATE POLICY "bookings_teacher_read"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id      = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  );

-- Policy C: Lehrer können den Status einer Buchung aktualisieren
CREATE POLICY "bookings_teacher_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id      = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id      = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  );

-- Policy D: Admin hat vollen Zugriff
CREATE POLICY "admin_all_bookings"
  ON bookings FOR ALL
  TO authenticated
  USING     (auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com')
  WITH CHECK(auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com');

-- ── 7. Trigger zur Channel-Erstellung sicherstellen ─────────
--    Der Channel (Virtuelles Klassenzimmer) wird automatisch
--    angelegt, sobald eine Buchung eingetragen wird.
CREATE OR REPLACE FUNCTION create_channel_for_booking()
RETURNS TRIGGER AS $$
DECLARE
  t_name_en TEXT;
  t_user_id UUID;
  s_email   TEXT;
  room_slug TEXT;
BEGIN
  SELECT name_en, user_id INTO t_name_en, t_user_id
    FROM teachers WHERE id = NEW.teacher_id;
  SELECT email  INTO s_email
    FROM auth.users WHERE id = NEW.student_id;

  room_slug := 'moalemi-' || substr(md5(NEW.id::text), 1, 10);

  INSERT INTO channels (booking_id, student_id, teacher_id, name, jitsi_room)
  VALUES (
    NEW.id,
    NEW.student_id,
    t_user_id,
    COALESCE(t_name_en, 'Teacher') || ' · ' || split_part(COALESCE(s_email,'student'),'@',1),
    room_slug
  ) ON CONFLICT DO NOTHING;

  INSERT INTO messages (channel_id, sender_name, content, type)
  SELECT c.id,
    'Moalemi Bot',
    '👋 **مرحباً بك في فصلك الدراسي!** هنا يمكنك التواصل مع المعلم، مشاركة الملفات، وبدء جلسة الفيديو. بالتوفيق! 🌟',
    'bot'
  FROM channels c WHERE c.booking_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_channel ON bookings;
CREATE TRIGGER trg_create_channel
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION create_channel_for_booking();

COMMIT;

-- ============================================================
-- ZUSAMMENFASSUNG
-- ============================================================
-- Tabelle  : bookings (erstellt oder repariert)
-- Spalten  : id, student_id, teacher_id, booking_date, start_time,
--            end_time, student_name, notes, total_price, status,
--            created_at  (alle ADD COLUMN IF NOT EXISTS — sicher)
-- FK       : teacher_id → teachers(id) ON DELETE CASCADE
-- RLS      : aktiviert mit 4 Policies
--   A  bookings_student_full_access  → Schüler INSERT + SELECT + DELETE
--   B  bookings_teacher_read         → Lehrer SELECT
--   C  bookings_teacher_update       → Lehrer UPDATE (Statuswechsel)
--   D  admin_all_bookings            → Admin alles
-- Trigger  : trg_create_channel → erstellt Channel + Bot-Nachricht
-- ============================================================
