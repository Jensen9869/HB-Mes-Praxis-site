CREATE TABLE users (
    id                  TEXT    PRIMARY KEY,
    email               TEXT    UNIQUE  NOT NULL,
    full_name           TEXT            NOT NULL,
    institution         TEXT,
    graduation_year     INTEGER,
    created_at           TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE enrolments (
    id                          TEXT    PRIMARY KEY,
    user_id                     TEXT    NOT NULL        REFERENCES users(id),
    programme                   TEXT    NOT NULL,
    track                       TEXT,
    status                      TEXT    NOT NULL    DEFAULT 'awaiting_payment',
    provider                    TEXT,
    provider_customer_id        TEXT,
    provider_subscription_id    TEXT,
    created_at                  TEXT    DEFAULT (datetime('now')),
    approved_at                 TEXT
);

CREATE TABLE payments (
    id                      TEXT    PRIMARY KEY,
    enrolment_id            TEXT    NOT NULL    REFERENCES  enrolments(id),
    provider_invoice_id     TEXT,
    amount                  INTEGER NOT NULL,
    currency                TEXT    NOT NULL,
    status                  TEXT    NOT NULL,
    paid_at                 TEXT
);

CREATE TABLE admins (
    id              TEXT    PRIMARY KEY,
    email           TEXT    UNIQUE  NOT NULL,
    password_hash   TEXT    NOT NULL,
    created_at      TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE login_tokens (
    token           TEXT    PRIMARY KEY,
    user_id         TEXT    NOT NULL    REFERENCES users(id),
    expires_at      TEXT    NOT NULL,
    used            INTEGER DEFAULT 0
);









