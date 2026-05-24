-- ============================================================
-- Moalemi — Finales vollständiges RLS & Storage Policy System
-- Version: 2.0 — Production Ready
-- Ausführen: Supabase Dashboard → SQL Editor → Paste → Run
-- ============================================================
--
-- ANALYSE: Welche Policy löst welches Problem?
-- ─────────────────────────────────────────────
-- teachers_read_own          → ROOT CAUSE "Failed to submit": Lehrer konnten
--                              ihre eigene nicht-approved Row nicht lesen →
--                              createTeacher() gab stub zurück, ID fehlte
-- bookings RLS               → Sicherheitslücke: Jeder konnte alle Buchungen
--                              einsehen (RLS war deaktiviert)
-- reviews policies           → RLS aktiviert aber KEINE Policy → Niemand
--                              konnte Reviews lesen oder schreiben
-- channel_files RLS          → RLS nicht aktiviert → potenzielle Datenlecks
-- storage avatars policies   → Uploads ohne Policy wurden von Supabase blockiert
-- storage classfiles policies→ Nicht-öffentlicher Bucket braucht explizite Policy
-- ============================================================

BEGIN;

-- ══════════════════════════════════════════════════════════════════
-- 1. TEACHERS TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Alle alten Policies löschen (verhindert "already exists"-Fehler)
DROP POLICY IF EXISTS "admin_all_teachers"             ON teachers;
DROP POLICY IF EXISTS "anyone_read_approved_teachers"  ON teachers;
DROP POLICY IF EXISTS "teachers_read_own"              ON teachers;
DROP POLICY IF EXISTS "teachers_insert_own"            ON teachers;
DROP POLICY IF EXISTS "teachers_update_own"            ON teachers;
DROP POLICY IF EXISTS "teachers_read_approved"         ON teachers;
DROP POLICY IF EXISTS "teachers_update_own_or_admin"   ON teachers;
DROP POLICY IF EXISTS "teachers_admin_delete"          ON teachers;
DROP POLICY IF EXISTS "teachers_admin_read_all"        ON teachers;

-- ── Policy 1: Admin hat vollen Zugriff (SELECT/INSERT/UPDATE/DELETE)
-- Löst: Admin-Delete hat nicht funktioniert (fehlte WITH CHECK für DELETE)
CREATE POLICY "admin_all_teachers"
  ON teachers FOR ALL
  TO authenticated
  USING     (auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com')
  WITH CHECK(auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com');

-- ── Policy 2: Öffentliche Sichtbarkeit für approved Lehrer
-- Löst: Startseite / Lehrersuche zeigt nur freigegebene Lehrer
CREATE POLICY "anyone_read_approved_teachers"
  ON teachers FOR SELECT
  USING (approved = true);

-- ── Policy 3: Lehrer können eigene Row lesen — auch wenn noch nicht approved
-- ROOT CAUSE FIX: Fehlte komplett → createTeacher() konnte neue Row nicht
-- zurücklesen → PGRST116-Fehler → "Failed to submit"
-- Betrifft auch: getTeacherByUserId(), TeacherOnboarding pre-fill, Dashboard
CREATE POLICY "teachers_read_own"
  ON teachers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Policy 4: Jeder angemeldete Nutzer darf seinen Lehrer-Eintrag erstellen
-- Löst: INSERT via TeacherOnboarding war blockiert ohne Session
CREATE POLICY "teachers_insert_own"
  ON teachers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── Policy 5: Lehrer dürfen nur die eigene Row updaten (Admin kann alle)
-- Löst: Profilbearbeitung schlug fehl für andere User-IDs
CREATE POLICY "teachers_update_own"
  ON teachers FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com')
  WITH CHECK(auth.uid() = user_id OR auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com');


-- ══════════════════════════════════════════════════════════════════
-- 2. REVIEWS TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_read_reviews"      ON reviews;
DROP POLICY IF EXISTS "authenticated_add_review" ON reviews;
DROP POLICY IF EXISTS "delete_own_review"        ON reviews;

-- ── Policy 6: Jeder kann Bewertungen lesen (keine Auth nötig)
-- Löst: Reviews waren unsichtbar (RLS enabled, aber 0 Policies → 0 Zeilen)
CREATE POLICY "anyone_read_reviews"
  ON reviews FOR SELECT
  USING (true);

-- ── Policy 7: Eingeloggte Nutzer können eine eigene Bewertung eintragen
-- Schützt: user_id muss der eigenen auth.uid() entsprechen
CREATE POLICY "authenticated_add_review"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ── Policy 8: Nutzer können ihre eigene Bewertung löschen
CREATE POLICY "delete_own_review"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════
-- 3. BOOKINGS TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_student_full_access"  ON bookings;
DROP POLICY IF EXISTS "bookings_teacher_read"         ON bookings;
DROP POLICY IF EXISTS "bookings_teacher_update"       ON bookings;
DROP POLICY IF EXISTS "admin_all_bookings"            ON bookings;

-- ── Policy 9: Schüler haben vollen Zugriff auf ihre eigenen Buchungen
-- Löst: Schüler konnten eigene Buchungen nicht sehen/buchen
CREATE POLICY "bookings_student_full_access"
  ON bookings FOR ALL
  TO authenticated
  USING     (auth.uid() = student_id)
  WITH CHECK(auth.uid() = student_id);

-- ── Policy 10: Lehrer können Buchungen für sie lesen
-- Löst: Lehrer sahen keine eingehenden Buchungsanfragen im Dashboard
CREATE POLICY "bookings_teacher_read"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  );

-- ── Policy 11: Lehrer können Buchungsstatus aktualisieren (z.B. bestätigen)
CREATE POLICY "bookings_teacher_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teachers
      WHERE teachers.id = bookings.teacher_id
        AND teachers.user_id = auth.uid()
    )
  );

-- ── Policy 12: Admin kann alle Buchungen verwalten
CREATE POLICY "admin_all_bookings"
  ON bookings FOR ALL
  TO authenticated
  USING     (auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com')
  WITH CHECK(auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com');


-- ══════════════════════════════════════════════════════════════════
-- 4. CHANNELS TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classroom_access" ON channels;

-- ── Policy 13: Nur Schüler und Lehrer des Channels haben Zugriff
CREATE POLICY "classroom_access"
  ON channels FOR ALL
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = teacher_id);


-- ══════════════════════════════════════════════════════════════════
-- 5. MESSAGES TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_access" ON messages;

-- ── Policy 14: Nur Channel-Mitglieder können Nachrichten lesen/schreiben
CREATE POLICY "messages_access"
  ON messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM channels
      WHERE channels.id = messages.channel_id
        AND (channels.student_id = auth.uid() OR channels.teacher_id = auth.uid())
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 6. CHANNEL_FILES TABLE
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE channel_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_files_access" ON channel_files;

-- ── Policy 15: Nur Channel-Mitglieder können Dateien hochladen/herunterladen
-- Löst: channel_files hatte kein RLS → potenzielle Datenlecks
CREATE POLICY "channel_files_access"
  ON channel_files FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM channels
      WHERE channels.id = channel_files.channel_id
        AND (channels.student_id = auth.uid() OR channels.teacher_id = auth.uid())
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 7. STORAGE: BUCKETS ERSTELLEN (falls noch nicht vorhanden)
-- ══════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('classroom-files', 'classroom-files', false)
  ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════
-- 8. STORAGE POLICIES — avatars (öffentlicher Bucket)
-- ══════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "avatars_upload"       ON storage.objects;
DROP POLICY IF EXISTS "avatars_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own"   ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own"   ON storage.objects;

-- ── Policy 16: Eingeloggte Nutzer können Avatare hochladen
-- Löst: Upload scheiterte mit "Unauthorized" / "new row violates RLS"
CREATE POLICY "avatars_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- ── Policy 17: Jeder kann Avatare lesen (öffentlicher Bucket)
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ── Policy 18: Nutzer können nur ihr eigenes Avatar-Bild ersetzen
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Policy 19: Nutzer können nur ihr eigenes Avatar-Bild löschen
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ══════════════════════════════════════════════════════════════════
-- 9. STORAGE POLICIES — classroom-files (privater Bucket)
-- ══════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "classfiles_upload"  ON storage.objects;
DROP POLICY IF EXISTS "classfiles_read"    ON storage.objects;
DROP POLICY IF EXISTS "classfiles_delete"  ON storage.objects;

-- ── Policy 20: Eingeloggte Nutzer können Dateien in Channels hochladen
CREATE POLICY "classfiles_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'classroom-files');

-- ── Policy 21: Eingeloggte Nutzer können Channel-Dateien herunterladen
CREATE POLICY "classfiles_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'classroom-files');

-- ── Policy 22: Nutzer können ihre eigenen hochgeladenen Dateien löschen
CREATE POLICY "classfiles_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'classroom-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


COMMIT;

-- ══════════════════════════════════════════════════════════════════
-- ZUSAMMENFASSUNG: 22 Policies für 6 Tabellen + 2 Storage-Buckets
-- ══════════════════════════════════════════════════════════════════
--
-- Tabelle          Policies   Problem behoben
-- ─────────────────────────────────────────────────────────────────
-- teachers         5          "Failed to submit", fehlende ID, Admin-Delete
-- reviews          3          Reviews komplett unsichtbar (0 Policies)
-- bookings         4          Sicherheitslücke + Dashboard-Buchungen leer
-- channels         1          Unverändert, war korrekt
-- messages         1          Unverändert, war korrekt
-- channel_files    1          RLS nicht aktiviert (potenzielle Datenlecks)
-- storage.avatars  4          Upload-Fehler "Unauthorized"
-- storage.classf.  3          Privater Bucket ohne Zugriffsregeln
-- ─────────────────────────────────────────────────────────────────
-- TOTAL            22
-- ══════════════════════════════════════════════════════════════════
