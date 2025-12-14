import db from '../config/db';
import pool from '../config/db';
import { QueryResult } from 'pg';

export interface Event {
  id: number;
  name: string;
  description: string;
  event_date: Date;
  venue_id: number;
  category_id: number;
  created_at: Date;
}

export interface EventFilter {
  categoryId?: number;
  fromDate?: string;
  toDate?: string;
  venueId?: number; 
  venueName?: string;
  cityName?: string;
}

export interface EventWithVenue {
  id: number;
  name: string;
  description: string;
  event_date: Date;
  created_at: Date;

  category: string | null;
  venue_name: string | null;
  city: string | null;
}

export const findEventById = async (id: number): Promise<Event | null> => {
  return await db.oneOrNone('SELECT * FROM events WHERE id = $1', [id]);
};

export const getAllEvents = async (): Promise<Event[] | null> => {
  return await db.query('SELECT * FROM events');
};


export const getEventsByFilter = async (
  filters: EventFilter
): Promise<EventWithVenue[]> => {
  const conditions: string[] = [];
  const values: any[] = [];
  let index = 1;

  let joinClause = `
    LEFT JOIN venues v
      ON e.venue_id = v.id
  `;

  if (filters.venueName?.trim()) {
    joinClause += ` AND v.name ILIKE $${index++}`;
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

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

const query = `
  SELECT
    e.id,
    e.name,
    e.description,
    e.event_date,
    e.created_at,

    c.name AS category,        

    v.name AS venue_name,
    TRIM(SPLIT_PART(v.address, ',', 2)) AS city
  FROM events e
  LEFT JOIN categories c ON e.category_id = c.id
  ${joinClause}
  ${whereClause}
  ORDER BY e.event_date ASC;
`;

  return db.any<EventWithVenue>(query, values);
};