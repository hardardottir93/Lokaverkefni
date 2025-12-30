import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../src/utils/app';
import db from '../src/config/db';

// Mock user
vi.mock('../src/middleware/authMiddleware', () => {
  return {
    authenticateUser: (_req: any, res: any, next: any) => {
      res.locals.user = { id: 1 };
      next();
    },
  };
});

describe('GET /bookings/my  -  DELETE /booking/my', () => {

  it('should return an empty list if user has no bookings', async () => {
    const res = await request(app).get('/bookings/my');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return bookings for logged in user', async () => {
    const res = await request(app).get('/bookings/my');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const booking = res.body[0];

      expect(booking).toHaveProperty('booking_id');
      expect(booking).toHaveProperty('quantity');
      expect(booking).toHaveProperty('total_price');

      expect(booking).toHaveProperty('event');
      expect(booking.event).toHaveProperty('id');
      expect(booking.event).toHaveProperty('name');
      expect(booking.event).toHaveProperty('date');
    }
  });

  
  it('DELETE /booking/:id', async () => {
     // Get events
    const eventsRes = await request(app).get('/events');
    expect(eventsRes.status).toBe(200);

    const futureEvent = eventsRes.body.events.find((e: any) => {
      return new Date(e.event_date).getTime() > Date.now() + 48 * 60 * 60 * 1000;
    });

    expect(futureEvent).toBeDefined();

    // Create a booking, should succeed
    const bookingRes = await request(app)
      .post('/bookings')
      .send({
        eventId: futureEvent.id,
        quantity: 1,
        paymentMethod: 'CARD',
      });

    expect(bookingRes.status).toBe(201);

    const bookingId = bookingRes.body.bookingId ?? bookingRes.body.id;

    // Create an event in 24 hours
    await db.none(
      `UPDATE events
      SET event_date = NOW() + INTERVAL '12 hours'
      WHERE id = $1`, 
      [futureEvent.id]);

    // Try to cancel, should fail
    const cancelRes = await request(app)
      .delete(`/bookings/${bookingId}`);

    expect(cancelRes.status).toBe(400);
    expect(cancelRes.body.error).toContain('24');
    });

});
