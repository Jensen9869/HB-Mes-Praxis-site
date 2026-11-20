-- Mentors: either a company staff member (kind='staff') or a Mentorship
-- student (kind='student', linked to their enrolment + user).
--   npx wrangler d1 execute career-launch-db --remote --file=schema-mentors.sql

CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'staff',          -- 'staff' | 'student'
  enrolment_id TEXT REFERENCES enrolments(id), -- the mentorship enrolment (kind='student')
  user_id TEXT REFERENCES users(id),           -- same user (kind='student'), lets the portal show "Your apprentices"
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS mentors_user ON mentors(user_id);

-- One mentor per apprentice; a mentor has many apprentices.
ALTER TABLE enrolments ADD COLUMN mentor_id TEXT REFERENCES mentors(id);
CREATE INDEX IF NOT EXISTS enrolments_mentor ON enrolments(mentor_id);
