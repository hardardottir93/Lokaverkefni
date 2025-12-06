-- ============================================
-- CLEAN DATABASE (optional for dev)
-- ============================================
TRUNCATE booking_tickets, bookings, tickets, events, venues, categories, users RESTART IDENTITY CASCADE;

-- *******************************************
-- USERS
-- (á eftir að útfæra password_hash)
-- *******************************************
INSERT INTO users (name, email, password_hash)
VALUES
  ('Hafrún Harðardóttir', 'hafrun@example.com', '$2a$10$examplehash1'),
  ('Aron Jónsson', 'aron@example.com', '$2a$10$examplehash2'),
  ('Sara Kristinsdóttir', 'sara@example.com', '$2a$10$examplehash3');

-- *******************************************
-- CATEGORIES
-- *******************************************
INSERT INTO categories (name)
VALUES
  ('Tónleikar'),
  ('Íþróttir'),
  ('Leikhús'),
  ('Viðburður'),
  ('Barnaskemmtun');

-- *******************************************
-- VENUES
-- *******************************************
INSERT INTO venues (name, address, capacity)
VALUES
  ('Harpa – Eldborg', 'Austurbakki 2, Reykjavík', 1000),
  ('Laugardalshöll', 'Engjavegur 8, Reykjavík', 5000),
  ('Hof Menningarhús', 'Strandgata 12, Akureyri', 600);

-- *******************************************
-- EVENTS
-- *******************************************
INSERT INTO events (name, description, event_date, venue_id, category_id)
VALUES
  ('Ghost í Hörpu', 'Epískir rokk tónleikar með magnaðri sviðsetningu.', '2025-08-15 20:00', 1, 1),
  ('Valsleikur – Úrslit', 'Úrslitaleikur í úrvalsdeild karla.', '2025-06-20 18:00', 2, 2),
  ('Vín og Dúlleður', 'Kósý leikhúsuppfærsla með húmor.', '2025-09-10 19:30', 3, 3),
  ('Disney Barnatónleikar', 'Skemmtun fyrir alla fjölskylduna.', '2025-07-01 14:00', 1, 5);

-- *******************************************
-- TICKETS
-- *******************************************
INSERT INTO tickets (event_id, price, total_quantity, remaining_quantity, ticket_type)
VALUES
  -- Ghost í Hörpu
  (1, 14990, 300, 300, 'General'),
  (1, 24990, 100, 100, 'VIP'),

  -- Valsleikur
  (2, 4990, 2000, 2000, 'Stands'),
  (2, 8990, 500, 500, 'Premium'),

  -- Leikhúsuppfærsla
  (3, 6990, 400, 400, 'General'),

  -- Disney Barnatónleikar
  (4, 3990, 500, 500, 'Child'),
  (4, 6990, 300, 300, 'Adult');

-- *******************************************
-- BOOKINGS
-- *******************************************
INSERT INTO bookings (user_id, event_id, total_price, status)
VALUES
  (1, 1, 14990, 'CONFIRMED'),
  (2, 2, 9980, 'CONFIRMED'),
  (1, 4, 10980, 'CONFIRMED');

-- *******************************************
-- BOOKING_TICKETS
-- *******************************************
INSERT INTO booking_tickets (booking_id, ticket_id, quantity)
VALUES
  (1, 1, 1),     -- Hafrún: Ghost – 1 general miði
  (2, 3, 2),     -- Aron: Valsleikur – 2 stands miðar
  (3, 6, 1),     -- Hafrún: Disney – 1 child ticket
  (3, 7, 1);     -- Hafrún: Disney – 1 adult ticket