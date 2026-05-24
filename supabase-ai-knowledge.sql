-- ============================================================
-- AI Knowledge Base + Chat History Migration
-- Run once in the Supabase SQL Editor
-- ============================================================

BEGIN;

-- ── 1. knowledge_sources ────────────────────────────────────
-- Stores admin/teacher-uploaded sources that are injected into
-- the AI system prompt alongside the built-in base knowledge.

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('pdf', 'link', 'text')),
  content     TEXT        NOT NULL,           -- extracted text / description
  url         TEXT,                           -- original URL or Storage public URL
  is_active   BOOLEAN     DEFAULT true,
  created_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;

-- Admins / teachers can manage sources
DROP POLICY IF EXISTS "admin_all_knowledge_sources" ON knowledge_sources;
CREATE POLICY "admin_all_knowledge_sources"
  ON knowledge_sources FOR ALL TO authenticated
  USING     (auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com'
             OR EXISTS (SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid() AND teachers.approved = true))
  WITH CHECK(auth.jwt() ->> 'email' = 'noahalsamawi688@gmail.com'
             OR EXISTS (SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid() AND teachers.approved = true));

-- All authenticated users can READ active sources (needed by aiService.ts)
DROP POLICY IF EXISTS "authenticated_read_active_sources" ON knowledge_sources;
CREATE POLICY "authenticated_read_active_sources"
  ON knowledge_sources FOR SELECT TO authenticated
  USING (is_active = true);


-- ── 2. ai_chat_history ──────────────────────────────────────
-- Persists per-user conversation history so students can pick
-- up where they left off after refreshing the page.

CREATE TABLE IF NOT EXISTS ai_chat_history (
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  messages    JSONB       DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_chat_history" ON ai_chat_history;
CREATE POLICY "users_own_chat_history"
  ON ai_chat_history FOR ALL TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK(auth.uid() = user_id);


COMMIT;
