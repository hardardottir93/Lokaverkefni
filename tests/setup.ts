import { beforeAll } from 'vitest';
import db from '../src/config/db.js';
import bcrypt from 'bcrypt';

let hasRun = false;

beforeAll(async () => {
  if (hasRun) {
    return;
  }

  hasRun = true;
  await resetDatabase();
});

export const resetDatabase = async () => {
  await db.tx(async (t) => {
    // Hreinsa
    await t.none(`
      TRUNCATE TABLE
        bookings,
        events,
        venues,
        categories,
        users
      RESTART IDENTITY CASCADE
    `);

    // Testa notanda
    const hashedPassword = await bcrypt.hash('password123', 10);

    await t.none(`
      INSERT INTO users (name, email, password_hash)
      VALUES (
        'Test User',
        'test@example.com',
        $1
      )
    `, [hashedPassword]);

    // Categories
    await t.none(`
      INSERT INTO categories (name)
      VALUES
        ('Tónleikar'),
        ('Leikhús')
    `);

    // Venues
    await t.none(`
        INSERT INTO venues (name, address, capacity)
        VALUES
            ('Harpa', 'Reykjavík', 1800),
            ('Borgarleikhúsið', 'Reykjavík', 900)
        `);

    // Event
    await t.none(`
      INSERT INTO events
        (name, event_date, category_id, venue_id, ticket_cost, available_tickets)
        VALUES
        ('Test Event', '2030-01-01', 1, 1, 5000, 100),
        ('Test Event <24h', NOW() + INTERVAL '12 hours', 1, 1, 5000, 100);
    `
        );
  });
};