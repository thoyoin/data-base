CREATE DATABASE task4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE task4;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    is_blocked INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
);

CREATE UNIQUE INDEX idx_email ON users (email);