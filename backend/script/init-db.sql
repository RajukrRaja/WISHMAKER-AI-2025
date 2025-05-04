-- WishMaker AI MySQL Database Schema
-- Database: wishmaker_ai
-- Description: A comprehensive MySQL schema for the WishMaker AI application, supporting personalized wishes, batch cards, tributes, and collages with advanced features like foreign keys, indexes, JSON fields, full-text search, and triggers.

-- Create Database
CREATE DATABASE IF NOT EXISTS wishmaker_ai
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE wishmaker_ai;

-- Enable InnoDB for transactional support and foreign keys
SET default_storage_engine = INNODB;

-- Table: users
-- Stores user information for authentication and personalization
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    preferences JSON DEFAULT NULL,
    INDEX idx_user_email (email),
    INDEX idx_user_username (username)
) COMMENT 'Stores user accounts with preferences as JSON';

-- Table: wishes
-- Stores personalized tech-themed graduation wishes
CREATE TABLE wishes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    theme ENUM('Web Dev', 'AI', 'Cybersecurity', 'Backend') NOT NULL,
    vibe ENUM('Funny', 'Poetic', 'Witty', 'Formal') NOT NULL,
    wish_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wish_user (user_id),
    FULLTEXT INDEX idx_wish_text (wish_text)
) COMMENT 'Stores personalized graduation wishes with full-text search on wish_text';

-- Table: batch_cards
-- Stores batch card wishes for the Class of 2025
CREATE TABLE batch_cards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_year YEAR NOT NULL,
    batch_wish TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT INDEX idx_batch_wish (batch_wish),
    UNIQUE INDEX idx_batch_year (batch_year)
) COMMENT 'Stores batch wishes with one card per year';

-- Table: signatures
-- Stores signatures for batch cards
CREATE TABLE signatures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_card_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_card_id) REFERENCES batch_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_signature_batch (batch_card_id),
    INDEX idx_signature_user (user_id),
    FULLTEXT INDEX idx_signature_message (message)
) COMMENT 'Stores signatures for batch cards with full-text search on message';

-- Table: tributes
-- Stores friendship tributes
CREATE TABLE tributes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    friend_name VARCHAR(100) NOT NULL,
    memory TEXT NOT NULL,
    tribute_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_tribute_user (user_id),
    FULLTEXT INDEX idx_tribute_text (tribute_text, memory)
) COMMENT 'Stores friendship tributes with full-text search on tribute_text and memory';

-- Table: collages
-- Stores photo collages
CREATE TABLE collages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    collage_data MEDIUMTEXT NOT NULL, -- Base64-encoded collage image
    image_count TINYINT UNSIGNED NOT NULL CHECK (image_count BETWEEN 3 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_collage_user (user_id)
) COMMENT 'Stores base64-encoded photo collages';

-- Table: audit_log
-- Stores audit trails for data changes
CREATE TABLE audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    record_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    details JSON DEFAULT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_table (table_name, changed_at)
) COMMENT 'Logs changes to critical tables for auditing';

-- Trigger: audit_wish_insert
-- Logs wish insertions
DELIMITER //
CREATE TRIGGER after_wish_insert
AFTER INSERT ON wishes
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, user_id, details)
    VALUES ('wishes', 'INSERT', NEW.id, NEW.user_id, JSON_OBJECT('name', NEW.name, 'theme', NEW.theme));
END //
DELIMITER ;

-- Trigger: audit_signature_insert
-- Logs signature insertions
DELIMITER //
CREATE TRIGGER after_signature_insert
AFTER INSERT ON signatures
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, user_id, details)
    VALUES ('signatures', 'INSERT', NEW.id, NEW.user_id, JSON_OBJECT('name', NEW.name, 'emoji', NEW.emoji));
END //
DELIMITER ;

-- Stored Procedure: GenerateUserReport
-- Generates a report of user activities
DELIMITER //
CREATE PROCEDURE GenerateUserReport(
    IN p_user_id BIGINT UNSIGNED,
    OUT p_wish_count INT,
    OUT p_signature_count INT,
    OUT p_tribute_count INT,
    OUT p_collage_count INT
)
BEGIN
    SELECT COUNT(*) INTO p_wish_count FROM wishes WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO p_signature_count FROM signatures WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO p_tribute_count FROM tributes WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO p_collage_count FROM collages WHERE user_id = p_user_id;
END //
DELIMITER ;

-- Example: Call the stored procedure
-- CALL GenerateUserReport(1, @wish_count, @signature_count, @tribute_count, @collage_count);
-- SELECT @wish_count, @signature_count, @tribute_count, @collage_count;

-- Partitioning: wishes table by year
ALTER TABLE wishes
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN (MAXVALUE)
);

-- Example Data Insertion
INSERT INTO users (username, email, password_hash, preferences)
VALUES ('sarjeev', 'sarjeev@example.com', 'hashed_password', '{"theme": "dark", "lang": "en"}');

INSERT INTO batch_cards (batch_year, batch_wish)
VALUES (2025, 'To the Class of 2025, may your code always compile and your dreams deploy seamlessly!');

INSERT INTO wishes (user_id, name, theme, vibe, wish_text)
VALUES (1, 'Sarjeev', 'AI', 'Witty', 'Sarjeev, may your algorithms always converge with wit!');

INSERT INTO signatures (batch_card_id, user_id, name, emoji, message)
VALUES (1, 1, 'Sarjeev', '🎉', 'Epic times with the batch!');

INSERT INTO tributes (user_id, friend_name, memory, tribute_text)
VALUES (1, 'Rajat', 'Hackathon nights', 'Rajat, our hackathon nights were perfect commits!');

INSERT INTO collages (user_id, collage_data, image_count)
VALUES (1, 'data:image/png;base64,iVBORw0KGgo...', 4);

-- Example Query: Search wishes
SELECT id, name, wish_text
FROM wishes
WHERE MATCH(wish_text) AGAINST('algorithm' IN BOOLEAN MODE);