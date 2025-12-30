-- *******************************************
-- CATEGORIES
-- *******************************************
INSERT INTO categories (name)
VALUES
  ('Tónleikar'),
  ('Leikhús'),
  ('Íþróttir'),
  ('Fyrirlestrar');

-- *******************************************
-- VENUES
-- *******************************************
INSERT INTO venues (name, address, capacity)
VALUES
  ('Harpa', 'Austurbakki 2, Reykjavík', 1800),
  ('Laugardalshöll', 'Engjavegur 8, Reykjavík', 5500),
  ('Borgarleikhúsið', 'Listabraut 3, Reykjavík', 900),
  ('Háskólabíó', 'Hagatorg, Reykjavík', 1000);

-- *******************************************
-- EVENTS
-- *******************************************
INSERT INTO events (name, event_date, available_tickets, ticket_cost, venue_id, category_id)
VALUES
  ('Sumartónleikar í Hörpu', '2026-06-15 20:00', 1800, 7500, 1, 1 ),
  ('Klassískt kvöld', '2026-07-01 19:30', 900, 6500, 3, 1),
  ('Úrslitaleikur bikarsins', '2025-08-10 18:00', 5500, 5500, 2, 3),
  ('Innlit á sviðinu', '2026-09-05 20:00', 900, 7200, 3, 2),
  ('Viðburður innan 24 klst', NOW() + INTERVAL '6 hours', 100, 5000, 1, 1);
