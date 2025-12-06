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
    venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- *******************************************
-- TICKETS
-- *******************************************
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    remaining_quantity INTEGER NOT NULL CHECK (remaining_quantity >= 0),
    ticket_type TEXT NOT NULL DEFAULT 'general'
);

-- *******************************************
-- BOOKINGS
-- *******************************************
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- *******************************************
-- BOOKING_TICKETS
-- *******************************************
CREATE TABLE booking_tickets (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);