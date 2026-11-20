-- Run once against the remote DB, then paste into schema.sql for the record:
--   npx wrangler d1 execute career-launch-db --remote --file=schema-additions.sql

-- Admin notes on an enrolment. visible_to_student=1 shows in the student portal
-- as "Updates from your mentor".
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  enrolment_id TEXT NOT NULL REFERENCES enrolments(id),
  body TEXT NOT NULL,
  visible_to_student INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS notes_enrolment ON notes(enrolment_id);

-- Every status change, whether by admin, PayPal webhook or system.
CREATE TABLE IF NOT EXISTS status_log (
  id TEXT PRIMARY KEY,
  enrolment_id TEXT NOT NULL REFERENCES enrolments(id),
  from_status TEXT,
  to_status TEXT NOT NULL,
  reason TEXT,
  actor TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS status_log_enrolment ON status_log(enrolment_id);

-- Emails sent manually from the admin panel.
CREATE TABLE IF NOT EXISTS emails_sent (
  id TEXT PRIMARY KEY,
  enrolment_id TEXT REFERENCES enrolments(id),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
