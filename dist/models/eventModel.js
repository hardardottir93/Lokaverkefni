import db from '../config/db.js';
export const findEventById = async (id) => {
    const query = `
    SELECT
      e.id,
      e.name,
      e.description,
      e.event_date,
      c.name AS category,
      v.name AS venue,
      e.available_tickets,
      e.ticket_cost
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN venues v ON e.venue_id = v.id
    WHERE e.id = $1
  `;
    return db.oneOrNone(query, [id]);
};
export const getAllEvents = async () => {
    return await db.query('SELECT * FROM events');
};
export const getEventsByFilter = async (filters) => {
    const conditions = [];
    const values = [];
    let index = 1;
    let joinClause = `LEFT JOIN venues v
    ON e.venue_id = v.id`;
    if (filters.venueName?.trim()) {
        joinClause =
            `INNER JOIN venues v
        ON e.venue_id = v.id
      AND v.name ILIKE $${index++}`;
        values.push(`%${filters.venueName.trim()}%`);
    }
    if (filters.categoryId !== undefined) {
        conditions.push(`e.category_id = $${index++}`);
        values.push(filters.categoryId);
    }
    if (filters.venueId !== undefined) {
        conditions.push(`e.venue_id = $${index++}`);
        values.push(filters.venueId);
    }
    if (filters.fromDate) {
        conditions.push(`e.event_date >= $${index++}`);
        values.push(filters.fromDate);
    }
    if (filters.toDate) {
        conditions.push(`e.event_date <= $${index++}`);
        values.push(filters.toDate);
    }
    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';
    const query = `SELECT
    e.id,
    e.name,
    e.description,
    e.event_date,
    e.created_at,

    c.name AS category,        

    v.name AS venue_name
  FROM events e
  LEFT JOIN categories c ON e.category_id = c.id
  ${joinClause}
  ${whereClause}
  ORDER BY e.event_date ASC;`;
    return db.any(query, values);
};
