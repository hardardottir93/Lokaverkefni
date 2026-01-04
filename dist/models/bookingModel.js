import db from '../config/db.js';
export const createBooking = async (userId, eventId, quantity, paymentMethod) => {
    return db.tx(async (t) => {
        const event = await t.oneOrNone(`SELECT id, event_date, available_tickets, ticket_cost
      FROM events
      WHERE id = $1
      FOR UPDATE`, [eventId]);
        if (!event) {
            const err = new Error('Viðburður fannst ekki');
            err.status = 404;
            throw err;
        }
        if (new Date(event.event_date) < new Date()) {
            const err = new Error('Viðburður er liðinn');
            err.status = 400;
            throw err;
        }
        if (event.available_tickets < quantity) {
            const err = new Error('Ekki nægir miðar');
            err.status = 400;
            throw err;
        }
        if (quantity <= 0) {
            const err = new Error('Ógilt magn');
            err.status = 400;
            throw err;
        }
        const totalPrice = event.ticket_cost * quantity;
        await t.none(`UPDATE events
      SET available_tickets = available_tickets - $1
      WHERE id = $2`, [quantity, eventId]);
        const booking = await t.one(`INSERT INTO bookings (user_id, event_id, quantity, total_price, payment_method)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`, [userId, eventId, quantity, totalPrice, paymentMethod]);
        return booking;
    });
};
export const getAllBookings = async () => {
    return db.any(`SELECT *
    FROM bookings
    ORDER BY created_at ASC`);
};
export const getBookingsByUserId = async (userId) => {
    return db.any(`SELECT
      b.id,
      b.quantity,
      b.total_price,
      b.payment_method,
      b.created_at,

      e.id AS event_id,
      e.name AS event_name,
      e.event_date,

      v.id AS venue_id,
      v.name AS venue_name,
      v.address AS venue_address
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    JOIN venues v ON e.venue_id = v.id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC`, [userId]);
};
export const getBookingById = async (bookingId) => {
    return db.oneOrNone(`SELECT
      b.id,
      b.user_id,
      b.quantity,
      b.event_id,
      e.event_date
    FROM bookings b
    JOIN events e ON e.id = b.event_id
    WHERE b.id = $1`, [bookingId]);
};
export const cancelBooking = async (booking) => {
    return db.tx(async (t) => {
        // Skila miðum í db
        await t.none(`UPDATE events
      SET available_tickets = available_tickets + $1
      WHERE id = $2`, [booking.quantity, booking.event_id]);
        // Eyða bókuninni úr db
        await t.none(`DELETE FROM bookings
      WHERE id = $1`, [booking.id]);
    });
};
