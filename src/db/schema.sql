-- *******************************************
-- USERS
-- *******************************************
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- *******************************************
-- CATEGORIES
-- *******************************************
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- *******************************************
-- VENUES
-- *******************************************
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0)
);

-- *******************************************
-- EVENTS
-- *******************************************
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    available_tickets INTEGER NOT NULL CHECK (available_tickets >= 0),
    ticket_cost INTEGER NOT NULL CHECK (ticket_cost > 0),
    venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- *******************************************
-- BOOKINGS
-- *******************************************
CREATE TYPE payment_method_enum AS ENUM (
  'CARD',
  'PAYPAL',
  'APPLE_PAY'
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    payment_method payment_method_enum NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
