-- ============================================================
-- Classroom Realtime + Messages RLS Fix
-- Run this once in the Supabase SQL Editor
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- 1. Enable REPLICA IDENTITY FULL so Supabase Realtime can
--    broadcast row payloads for INSERT / UPDATE / DELETE events.
-- ────────────────────────────────────────────────────────────
ALTER TABLE messages  REPLICA IDENTITY FULL;
ALTER TABLE channels  REPLICA IDENTITY FULL;

-- ────────────────────────────────────────────────────────────
-- 2. Add both tables to the Supabase Realtime publication.
--    The publication is created by Supabase automatically;
--    we only need to register our tables.
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE channels;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

-- ────────────────────────────────────────────────────────────
-- 3. Rebuild the messages_access policy with an explicit
--    WITH CHECK clause so that authenticated users can INSERT
--    into channels they are a participant of.
--    (FOR ALL with only USING technically covers INSERT via
--     implicit WITH CHECK = USING, but being explicit prevents
--     future PostgreSQL version surprises.)
-- ────────────────────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_access" ON messages;

CREATE POLICY "messages_access"
  ON messages FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM channels
      WHERE channels.id = messages.channel_id
        AND (
          channels.student_id = auth.uid()
          OR channels.teacher_id = auth.uid()
          OR auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com'
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM channels
      WHERE channels.id = messages.channel_id
        AND (
          channels.student_id = auth.uid()
          OR channels.teacher_id = auth.uid()
          OR auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com'
        )
    )
  );

-- ────────────────────────────────────────────────────────────
-- 4. Allow unauthenticated bot messages (inserted by the
--    SECURITY DEFINER trigger function) to be readable by
--    channel participants.  The trigger inserts with
--    sender_id = NULL and type = 'bot'.
--    The above policy already covers SELECT for authenticated
--    users; no additional policy needed for the trigger
--    because SECURITY DEFINER bypasses RLS.
-- ────────────────────────────────────────────────────────────

COMMIT;
