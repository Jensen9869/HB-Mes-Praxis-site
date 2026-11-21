-- One-off: make every already-approved Mentorship student a mentor.
--   npx wrangler d1 execute career-launch-db --remote --file=schema-mentors-backfill.sql
INSERT INTO mentors (id, full_name, email, kind, enrolment_id, user_id)
SELECT lower(hex(randomblob(16))), u.full_name, u.email, 'student', e.id, e.user_id
FROM enrolments e JOIN users u ON u.id = e.user_id
WHERE e.programme LIKE 'mentorship%' AND e.status = 'approved'
  AND NOT EXISTS (SELECT 1 FROM mentors m WHERE m.user_id = e.user_id);
