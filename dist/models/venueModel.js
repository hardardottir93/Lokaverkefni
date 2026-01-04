import db from '../config/db.js';
export const getAllVenues = async () => {
    return db.any(`SELECT *
    FROM venues
    ORDER BY name ASC`);
};
export const findVenueById = async (id) => {
    return db.oneOrNone(`SELECT *
    FROM venues
    WHERE id = $1`, [id]);
};
export const getUpcomingEventsByVenueId = async (venueId) => {
    return db.any(`SELECT
      e.id,
      e.name,
      e.event_date,
      c.name AS category
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.venue_id = $1
      AND e.event_date >= NOW()
    ORDER BY e.event_date ASC`, [venueId]);
};
