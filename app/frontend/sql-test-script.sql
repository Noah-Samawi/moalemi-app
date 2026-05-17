-- ================================================================
-- VIRTUAL CLASSROOM HUB - QUICK TEST SCRIPT
-- ================================================================
-- This script helps you test the booking-to-channel trigger
-- Run these queries in your Supabase SQL Editor

-- Step 1: Check existing bookings
SELECT 
  id,
  student_id,
  teacher_id,
  status,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: If you need to create a test booking, run this:
-- (Replace the IDs with real values from your auth and teachers tables)
-- 
-- INSERT INTO bookings (student_id, teacher_id, subject_en, date, time, status)
-- VALUES (
--   'YOUR_STUDENT_USER_ID',
--   (SELECT user_id FROM teachers WHERE approved = true LIMIT 1),
--   'Test Lesson',
--   CURRENT_DATE + INTERVAL '1 day',
--   '14:00',
--   'pending'
-- )
-- RETURNING id;

-- Step 3: Find a booking to confirm (or use the ID from Step 2)
-- This is the crucial test - update status to 'confirmed'
-- This should AUTOMATICALLY create a channel via the trigger
SELECT id, status FROM bookings WHERE status != 'confirmed' LIMIT 1;

-- Step 4: Update the booking status to trigger channel creation
-- REPLACE 'booking-id-here' with the actual ID from Step 3
-- UPDATE bookings 
-- SET status = 'confirmed'
-- WHERE id = 'booking-id-here'
-- RETURNING id, status;

-- Step 5: Verify the channel was created
-- After running Step 4, check if channels table has a new row:
SELECT 
  c.id,
  c.booking_id,
  c.name,
  c.student_id,
  c.teacher_id,
  c.created_at
FROM channels c
ORDER BY c.created_at DESC
LIMIT 5;

-- Step 6: Send a test message to the channel
-- Replace 'channel-id-here' and 'user-id-here' with real values
-- INSERT INTO messages (channel_id, user_id, content)
-- VALUES (
--   'channel-id-here',
--   'user-id-here',
--   'Test message from SQL'
-- )
-- RETURNING id, content, created_at;

-- Step 7: Verify messages in the channel
-- Replace 'channel-id-here' with the actual channel ID
-- SELECT 
--   id,
--   user_id,
--   content,
--   created_at
-- FROM messages
-- WHERE channel_id = 'channel-id-here'
-- ORDER BY created_at DESC;

-- Step 8: Check Row Level Security is working
-- This query shows channels the current user has access to:
-- SELECT id, name, booking_id FROM channels
-- WHERE student_id = auth.uid() OR teacher_id = auth.uid();

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if the trigger function exists
SELECT 
  routine_schema,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'create_channel_on_booking_confirmed';

-- Check if the trigger is active
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_timing
FROM information_schema.triggers
WHERE trigger_name LIKE '%booking_confirmed%';

-- Count total messages across all channels
SELECT COUNT(*) as total_messages FROM messages;

-- See channel activity (channels with most recent messages)
SELECT 
  c.id,
  c.name,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_time
FROM channels c
LEFT JOIN messages m ON c.id = m.channel_id
GROUP BY c.id, c.name
ORDER BY MAX(m.created_at) DESC;

-- ================================================================
-- QUICK START WORKFLOW
-- ================================================================
-- 1. Get a student user ID from auth.users
-- 2. Get a teacher user ID from teachers.user_id
-- 3. Create a booking with status 'pending'
-- 4. Update that booking's status to 'confirmed'
-- 5. Check if a channel was created
-- 6. Open http://localhost:5173/classroom in your browser
-- 7. Send messages and verify real-time updates
