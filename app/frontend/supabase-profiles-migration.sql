-- ============================================================
-- Moalemi — Profiles Table + Presence System + Teacher Contacts
-- Ausführen: Supabase Dashboard → SQL Editor → Paste → Run
-- ============================================================

BEGIN;

-- ── 1. profiles table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  last_seen   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_own_access"        ON profiles;
DROP POLICY IF EXISTS "authenticated_read_profiles" ON profiles;

-- Owner: full read/write
CREATE POLICY "profiles_own_access"
  ON profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Any logged-in user can read others' profiles (needed for online status)
CREATE POLICY "authenticated_read_profiles"
  ON profiles FOR SELECT TO authenticated
  USING (true);

-- ── 2. Auto-create profile row on sign-up ──────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NULL
  ) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 3. Add contact fields to teachers table ────────────────
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone          TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS contact_email  TEXT;

COMMIT;

-- ============================================================
-- AFTER RUNNING THIS:
--
-- profiles table:
--   New users automatically get a profile row via trigger.
--   Existing users: insert manually or let the frontend upsert
--   on first profile-settings save.
--
-- teachers:
--   phone / contact_email are now available in the schema.
--   Re-add them to TEACHER_COLUMNS in teacherService.ts after
--   this migration has been applied.
-- ============================================================
