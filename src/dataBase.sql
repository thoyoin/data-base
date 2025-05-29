CREATE DATABASE task4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE task4;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
);

CREATE UNIQUE INDEX idx_email ON users (email);