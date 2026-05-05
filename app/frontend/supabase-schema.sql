-- معلمي / Mein Lehrer / My Teacher — Supabase Schema
-- Run this SQL in the Supabase SQL Editor

BEGIN;

-- ============================================
-- TEACHERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_de TEXT NOT NULL,
  avatar TEXT,
  specializations JSONB DEFAULT '[]'::jsonb,
  bio_ar TEXT,
  bio_en TEXT,
  bio_de TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  experience INTEGER DEFAULT 0,
  hourly_rate INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  subject_ar TEXT,
  subject_en TEXT,
  subject_de TEXT,
  date DATE,
  time TEXT,
  duration_ar TEXT,
  duration_en TEXT,
  duration_de TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_ar TEXT,
  content_en TEXT,
  content_de TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_approved ON teachers(approved);
CREATE INDEX IF NOT EXISTS idx_teachers_featured ON teachers(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(active);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Teachers: anyone can read approved teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers_read_all" ON teachers FOR SELECT USING (true);
CREATE POLICY "teachers_insert_own" ON teachers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "teachers_update_own_or_admin" ON teachers FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.jwt() ->> 'email' LIKE '%noah%');

-- Bookings: involved parties can read, authenticated students can insert
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_read_involved" ON bookings FOR SELECT TO authenticated USING (auth.uid() = student_id OR auth.uid() = (SELECT user_id FROM teachers WHERE id = teacher_id));
CREATE POLICY "bookings_insert_student" ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "bookings_update_involved" ON bookings FOR UPDATE TO authenticated USING (auth.uid() = student_id OR auth.uid() = (SELECT user_id FROM teachers WHERE id = teacher_id));

-- Announcements: anyone can read active, admin can manage
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_read_all" ON announcements FOR SELECT USING (true);
CREATE POLICY "announcements_admin_manage" ON announcements FOR ALL TO authenticated USING (auth.jwt() ->> 'email' LIKE '%noah%');

-- ============================================
-- SEED DATA (4 mock teachers)
-- ============================================
INSERT INTO teachers (id, name_ar, name_en, name_de, avatar, specializations, bio_ar, bio_en, bio_de, services, experience, hourly_rate, rating, reviews_count, is_pro, featured, approved) VALUES
(
  'a0000001-0000-0000-0000-000000000001',
  'الشيخ أحمد محمد',
  'Sheikh Ahmed Mohammed',
  'Sheikh Ahmed Mohammed',
  'https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png',
  '[{"ar":"القرآن الكريم","en":"Holy Quran","de":"Heiliger Quran"},{"ar":"التجويد","en":"Tajweed","de":"Tajweed"},{"ar":"القراءات العشر","en":"Ten Qira''at","de":"Zehn Lesarten"}]'::jsonb,
  'شيخ متخصص في القراءات العشر مع خبرة تزيد عن 15 عاماً في تدريس القرآن الكريم والتجويد. حاصل على إجازة في القراءات العشر من مشايخ متعددين.',
  'A scholar specialized in the Ten Qira''at with over 15 years of experience teaching the Holy Quran and Tajweed. Holder of an Ijazah in the Ten Qira''at from multiple scholars.',
  'Ein Gelehrter, spezialisiert auf die zehn Lesarten mit über 15 Jahren Erfahrung im Unterrichten des Heiligen Quran und Tajweed. Inhaber einer Ijazah in den zehn Lesarten von mehreren Gelehrten.',
  '[{"name":{"ar":"حفظ القرآن الكريم","en":"Quran Memorization","de":"Quran-Memorierung"},"description":{"ar":"برنامج متكامل لحفظ القرآن الكريم بالتجويد","en":"A comprehensive program for memorizing the Holy Quran with Tajweed","de":"Ein umfassendes Programm zur Memorierung des Heiligen Quran mit Tajweed"}},{"name":{"ar":"أحكام التجويد","en":"Tajweed Rules","de":"Tajweed-Regeln"},"description":{"ar":"تعلم أحكام التجويد بشكل مفصل وتطبيقي","en":"Learn Tajweed rules in detail with practical application","de":"Lernen Sie die Tajweed-Regeln im Detail und praktisch"}},{"name":{"ar":"القراءات العشر","en":"Ten Qira''at","de":"Zehn Lesarten"},"description":{"ar":"دراسة القراءات العشر الصغرى والكبرى","en":"Study of the minor and major Ten Qira''at","de":"Studium der kleinen und großen zehn Lesarten"}}]'::jsonb,
  15, 25, 4.90, 234, true, true, true
),
(
  'a0000002-0000-0000-0000-000000000002',
  'الأستاذة فاطمة علي',
  'Fatima Ali',
  'Fatima Ali',
  'https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png',
  '[{"ar":"اللغة العربية","en":"Arabic Language","de":"Arabische Sprache"},{"ar":"النحو","en":"Grammar","de":"Grammatik"},{"ar":"الصرف","en":"Morphology","de":"Morphologie"}]'::jsonb,
  'أستاذة متخصصة في اللغة العربية وعلومها، مع خبرة واسعة في تدريس النحو والصرف والبلاغة لطلاب مختلف المستويات.',
  'A specialist in Arabic language and its sciences, with extensive experience teaching grammar, morphology, and rhetoric to students of all levels.',
  'Eine Spezialistin für die arabische Sprache und ihre Wissenschaften mit umfangreicher Erfahrung im Unterrichten von Grammatik, Morphologie und Rhetorik für Studenten aller Niveaus.',
  '[{"name":{"ar":"النحو والصرف","en":"Grammar & Morphology","de":"Grammatik und Morphologie"},"description":{"ar":"دروس شاملة في قواعد النحو والصرف العربي","en":"Comprehensive lessons in Arabic grammar and morphology rules","de":"Umfassende Lektionen in arabischer Grammatik und Morphologie"}},{"name":{"ar":"البلاغة العربية","en":"Arabic Rhetoric","de":"Arabische Rhetorik"},"description":{"ar":"تعلم فنون البلاغة: البيان والمعاني والبديع","en":"Learn the arts of rhetoric: clarity, meaning, and stylistics","de":"Lernen Sie die Kunst der Rhetorik: Klarheit, Bedeutung und Stilistik"}},{"name":{"ar":"المحادثة بالعربية","en":"Arabic Conversation","de":"Arabisch Konversation"},"description":{"ar":"تحسين مهارات المحادثة والتعبير باللغة العربية","en":"Improve your Arabic conversation and expression skills","de":"Verbessern Sie Ihre Konversations- und Ausdrucksfähigkeiten auf Arabisch"}}]'::jsonb,
  10, 20, 4.80, 189, false, false, true
),
(
  'a0000003-0000-0000-0000-000000000003',
  'الدكتور خالد حسن',
  'Dr. Khalid Hassan',
  'Dr. Khalid Hassan',
  'https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpgyqaafla/teacher-avatar-1.png',
  '[{"ar":"الفقه","en":"Fiqh","de":"Fiqh"},{"ar":"العقيدة","en":"Aqeedah","de":"Glaubenslehre"},{"ar":"الحديث","en":"Hadith","de":"Hadith"}]'::jsonb,
  'دكتور في الشريعة الإسلامية مع أكثر من 20 عاماً في التدريس والبحث العلمي. متخصص في الفقه والعقيدة وعلوم الحديث.',
  'A doctor of Islamic Sharia with over 20 years of teaching and research experience. Specialized in Fiqh, Aqeedah, and Hadith sciences.',
  'Ein Doktor der islamischen Rechtswissenschaften mit über 20 Jahren Lehr- und Forschungserfahrung. Spezialisiert auf Fiqh, Glaubenslehre und Hadith-Wissenschaften.',
  '[{"name":{"ar":"الفقه الإسلامي","en":"Islamic Fiqh","de":"Islamisches Recht"},"description":{"ar":"دراسة الفقه الإسلامي وفق المذاهب الأربعة","en":"Study Islamic Fiqh according to the four schools of thought","de":"Studium des islamischen Rechts nach den vier Rechtsschulen"}},{"name":{"ar":"العقيدة الصحيحة","en":"Correct Aqeedah","de":"Die richtige Glaubenslehre"},"description":{"ar":"تعلم أصول العقيدة الإسلامية الصحيحة","en":"Learn the fundamentals of correct Islamic Aqeedah","de":"Lernen Sie die Grundlagen der richtigen islamischen Glaubenslehre"}},{"name":{"ar":"علوم الحديث","en":"Hadith Sciences","de":"Hadith-Wissenschaften"},"description":{"ar":"دراسة مصطلح الحديث وعلومه","en":"Study Hadith terminology and sciences","de":"Studium der Hadith-Terminologie und ihrer Wissenschaften"}}]'::jsonb,
  20, 30, 4.95, 312, true, true, true
),
(
  'a0000004-0000-0000-0000-000000000004',
  'الأستاذة نور الهدى',
  'Nour Al-Huda',
  'Nour Al-Huda',
  'https://mgx-backend-cdn.metadl.com/generate/images/1176546/2026-05-01/nwmpetyaafma/teacher-avatar-2.png',
  '[{"ar":"القرآن الكريم","en":"Holy Quran","de":"Heiliger Quran"},{"ar":"التجويد","en":"Tajweed","de":"Tajweed"}]'::jsonb,
  'معلمة قرآن متخصصة في تحفيظ القرآن الكريم وتعليم التجويد للنساء والأطفال بأسلوب سهل ومبسط.',
  'A Quran teacher specialized in memorization and teaching Tajweed to women and children with an easy and simplified approach.',
  'Eine Quran-Lehrerin, spezialisiert auf die Memorierung des Heiligen Quran und den Tajweed-Unterricht für Frauen und Kinder in einer einfachen und verständlichen Methode.',
  '[{"name":{"ar":"تحفيظ القرآن","en":"Quran Memorization","de":"Quran-Memorierung"},"description":{"ar":"برنامج تحفيظ مخصص للنساء والأطفال","en":"A memorization program designed for women and children","de":"Ein spezielles Memorierungsprogramm für Frauen und Kinder"}},{"name":{"ar":"تجويد القرآن","en":"Quran Tajweed","de":"Quran-Tajweed"},"description":{"ar":"تعلم أحكام التجويد بطريقة مبسطة","en":"Learn Tajweed rules in a simplified way","de":"Lernen Sie die Tajweed-Regeln auf vereinfachte Weise"}}]'::jsonb,
  8, 18, 4.70, 156, false, false, true
);

COMMIT;