-- ============================================================
-- CRITICAL FIXES: Auth Registration + Reviews System
-- Run once in the Supabase SQL Editor
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES — Auto-create row on new user registration
--    This fixes "Database error saving new user" which occurs
--    when a trigger tries to write to profiles but fails due
--    to column mismatch or missing trigger.
-- ─────────────────────────────────────────────────────────────

-- Ensure the profiles table has the correct schema
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name        TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  is_online   BOOLEAN     DEFAULT false,
  last_seen   TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Add any missing columns safely
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url  TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone       TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_online   BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen   TIMESTAMPTZ DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now();

-- Create the trigger function that runs on every new auth.users insert
-- SECURITY DEFINER + explicit search_path bypasses RLS completely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, is_online, last_seen, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    false,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;   -- safe: never overwrites an existing profile
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block user creation even if profile insert fails
  RAISE WARNING 'handle_new_user: could not create profile for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Attach the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to profiles"      ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile"   ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile"   ON profiles;
DROP POLICY IF EXISTS "profiles_insert_service"                    ON profiles;

CREATE POLICY "Allow public read access to profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────
-- 2. REVIEWS — RLS fix + auto-aggregate trigger
-- ─────────────────────────────────────────────────────────────

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon) to read reviews
DROP POLICY IF EXISTS "anyone_read_reviews"      ON reviews;
DROP POLICY IF EXISTS "authenticated_add_review" ON reviews;
DROP POLICY IF EXISTS "delete_own_review"        ON reviews;
DROP POLICY IF EXISTS "admin_all_reviews"        ON reviews;

CREATE POLICY "anyone_read_reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "authenticated_add_review"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_review"
  ON reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_all_reviews"
  ON reviews FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com');


-- Auto-aggregate: recalculate teachers.rating + teachers.reviews_count
-- whenever a review is inserted, updated, or deleted.
CREATE OR REPLACE FUNCTION public.refresh_teacher_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_teacher_id UUID;
BEGIN
  -- Determine which teacher to update
  IF TG_OP = 'DELETE' THEN
    target_teacher_id := OLD.teacher_id;
  ELSE
    target_teacher_id := NEW.teacher_id;
  END IF;

  UPDATE teachers
  SET
    reviews_count = (SELECT COUNT(*)       FROM reviews WHERE teacher_id = target_teacher_id),
    rating        = (SELECT COALESCE(ROUND(AVG(rating::numeric), 2), 0)
                     FROM reviews WHERE teacher_id = target_teacher_id)
  WHERE id = target_teacher_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_teacher_ratings ON reviews;
CREATE TRIGGER trg_refresh_teacher_ratings
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.refresh_teacher_ratings();


-- ─────────────────────────────────────────────────────────────
-- 3. Enable Realtime for reviews table (live review updates)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE reviews REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

COMMIT;
