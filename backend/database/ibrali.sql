-- ════════════════════════════════════════════════════════════════════
-- Ibrali Tours & Travel — MySQL/MariaDB schema + seed data (XAMPP)
--
-- Import via phpMyAdmin (as root) or:
--   C:\xampp\mysql\bin\mysql.exe -u root < backend\database\ibrali.sql
--
-- Creates database `ibrali` and the `ibrali` MySQL account.
--
-- ⚠ BEFORE IMPORTING: replace CHANGE_ME_PASSWORD below with your own
--   password, and put the same value in backend/api/config.local.php
--   (copy config.local.example.php).
-- ════════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS ibrali
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Dedicated app account (works on MariaDB and MySQL 8)
CREATE USER IF NOT EXISTS 'ibrali'@'localhost' IDENTIFIED BY 'CHANGE_ME_PASSWORD';
GRANT ALL PRIVILEGES ON ibrali.* TO 'ibrali'@'localhost';
FLUSH PRIVILEGES;

USE ibrali;

-- ── USERS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL UNIQUE,
  phone         VARCHAR(30)   DEFAULT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── AUTH TOKENS (bearer sessions) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS auth_tokens (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  token_hash CHAR(64)     NOT NULL UNIQUE,   -- sha256 of the raw token
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NOT NULL,
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── PACKAGES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150)  NOT NULL,
  destination   VARCHAR(150)  NOT NULL,
  duration_days TINYINT UNSIGNED NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  image         VARCHAR(500)  DEFAULT NULL,
  rating        DECIMAL(2,1)  NOT NULL DEFAULT 0,
  reviews       INT UNSIGNED  NOT NULL DEFAULT 0,
  category      VARCHAR(40)   NOT NULL,
  description   TEXT,
  highlights    JSON,
  inclusions    JSON,
  max_travelers TINYINT UNSIGNED NOT NULL DEFAULT 10,
  difficulty    ENUM('Easy','Medium','Hard') NOT NULL DEFAULT 'Easy',
  best_time     VARCHAR(60)   DEFAULT 'Year-round',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── BOOKINGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_ref      VARCHAR(24)  NOT NULL UNIQUE,   -- e.g. IBR-20260715-4F2A
  user_id          INT UNSIGNED DEFAULT NULL,      -- NULL = guest booking
  package_id       INT UNSIGNED NOT NULL,
  full_name        VARCHAR(120) NOT NULL,
  email            VARCHAR(190) NOT NULL,
  phone            VARCHAR(30)  NOT NULL,
  travelers        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  start_date       DATE         NOT NULL,
  special_requests TEXT,
  total_price      DECIMAL(10,2) NOT NULL,
  status           ENUM('pending','confirmed','completed','cancelled')
                   NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_bookings_package FOREIGN KEY (package_id)
    REFERENCES packages(id)
) ENGINE=InnoDB;

-- ── CONTACT MESSAGES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  phone      VARCHAR(30)  DEFAULT NULL,
  message    TEXT NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── NEWSLETTER SUBSCRIBERS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════════

-- Demo account: demo@example.com / password123
INSERT INTO users (name, email, phone, password_hash, role) VALUES
  ('Demo User', 'demo@example.com', '+254712345678',
   '$2y$10$.MgXutHtIsk1DoRYl0vxxuEofDelP5DDgiJfSj3vEgRve0kzAu7G.', 'customer')
ON DUPLICATE KEY UPDATE email = email;

-- Tour packages (mirrors src/utils/constants.js)
INSERT INTO packages
  (id, title, destination, duration_days, price, image, rating, reviews,
   category, description, highlights, inclusions, max_travelers, difficulty, best_time)
VALUES
  (1, 'Safari Adventure', 'Masai Mara', 5, 2500.00,
   'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
   4.8, 45, 'safari',
   'Experience the thrilling wildlife of Masai Mara with expert guides. Witness the great migration and diverse wildlife.',
   '["Big Five sightings","Professional guides","Comfortable accommodations","Game drives twice daily","Photography opportunities"]',
   '["Accommodation","All meals","Game drives","Park fees","Ground transport"]',
   8, 'Easy', 'Jun-Oct, Dec-Feb'),
  (2, 'Beach Paradise', 'Mombasa', 7, 1800.00,
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
   4.9, 62, 'beach',
   'Relax on pristine white sandy beaches with crystal clear waters. Perfect for swimming, snorkeling, and water sports.',
   '["White sandy beaches","Water sports","Snorkeling opportunities","Sunset beach walks","Beachfront dining"]',
   '["Beachfront resort stay","All meals","Beach activities","Airport transfers","Guided tours"]',
   20, 'Easy', 'Year-round'),
  (3, 'Mountain Trek', 'Mount Kenya', 4, 1500.00,
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
   4.7, 38, 'trekking',
   'Climb Africa''s second-highest mountain. Enjoy breathtaking views and challenging trails through diverse ecosystems.',
   '["Summit experience","Alpine scenery","Wildlife viewing","Experienced mountain guides","High altitude adventure"]',
   '["Mountain hut accommodation","All meals","Professional guides","Climbing equipment","Transport to base"]',
   6, 'Hard', 'Jan-Feb, Aug-Sep'),
  (4, 'City Tour', 'Nairobi', 3, 800.00,
   'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
   4.5, 28, 'city',
   'Explore Kenya''s vibrant capital city. Visit museums, markets, and cultural landmarks.',
   '["National Museum","Karen Blixen Museum","Giraffe Centre","Nairobi National Park","Local markets"]',
   '["Hotel accommodation","Breakfast","Guided city tours","Museum entries","Local transport"]',
   10, 'Easy', 'Year-round'),
  (5, 'Lake Nakuru', 'Lake Nakuru', 2, 600.00,
   'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
   4.6, 35, 'wildlife',
   'Visit the famous Lake Nakuru known for its pink flamingos and diverse wildlife. A perfect quick getaway.',
   '["Pink flamingos","Rhino viewing","Birdwatching","Scenic lake views","Photography spots"]',
   '["Lodge accommodation","All meals","Game drive","Park entrance fees","Professional guide"]',
   12, 'Easy', 'Year-round'),
  (6, 'Luxury Safari', 'Samburu', 6, 3500.00,
   'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop',
   4.9, 52, 'safari',
   'Experience ultimate luxury in the remote Samburu landscape. Exclusive access to pristine wilderness.',
   '["Luxury accommodations","Private game drives","Exclusive access","Gourmet dining","Spa services"]',
   '["Luxury lodge","All meals and drinks","Private guide","Bush walks","Transfers and flights"]',
   4, 'Easy', 'Jun-Oct, Dec-Feb'),
  (7, 'Cultural Experience', 'Maasai Village', 3, 650.00,
   'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
   4.8, 41, 'cultural',
   'Immerse yourself in Maasai culture. Meet local communities and learn about traditional way of life.',
   '["Traditional ceremonies","Cultural workshops","Local crafts","Traditional meals","Village tour"]',
   '["Cultural guide","Maasai village tour","Craft workshop","Traditional lunch","Transport"]',
   15, 'Easy', 'Year-round'),
  (8, 'Adventure Combo', 'Multiple Destinations', 10, 4500.00,
   'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
   4.9, 29, 'adventure',
   'Ultimate Kenya experience combining safari, beach, mountains, and culture in one epic journey.',
   '["All-inclusive experience","Multiple destinations","Diverse activities","Expert guides","Unforgettable memories"]',
   '["All accommodations","All meals","All activities","All transport","Travel insurance"]',
   6, 'Medium', 'Year-round')
ON DUPLICATE KEY UPDATE title = VALUES(title);
