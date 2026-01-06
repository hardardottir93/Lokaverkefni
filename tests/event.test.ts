import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/utils/app.js';


describe('GET /events', () => {
  it('should return a list of events', async () => {
    const res = await request(app).get('/events');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body).toHaveProperty('count');
  });
});


describe('GET /events/search', () => {
  it('should filter events by categoryId', async () => {
    const res = await request(app).get('/events/search?categoryId=1');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);

    for (const event of res.body.events) {
      expect(event.category).toBeDefined();
    }
  });

  it('should filter events by date range', async () => {
    const res = await request(app).get(
      '/events/search?fromDate=2025-06-01&toDate=2025-06-30'
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
  });


  it('should fail on invalid query params', async () => {
    const res = await request(app).get('/events/search?categoryIdÖ2');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return empty list if no events match filters', async () => {
    const res = await request(app).get(
      '/events/search?fromDate=2099-01-01&toDate=2099-12-31'
    );

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.events).toEqual([]);
  });

    it('filters by venue name', async () => {
    const res = await request(app)
      .get('/events/search')
      .query({ venueName: 'Laugardalshöll' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);

    for (const event of res.body.events) {
      expect(event.venue_name).toBeTruthy();
      expect(event.venue_name).toContain('Laugardal');
    }
  });


  it('returns empty list if no events match', async () => {
    const res = await request(app)
      .get('/events/search')
      .query({ venueName: 'EkkiTil' });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.events).toEqual([]);
  });

  it('fails on invalid query params (Zod strict)', async () => {
    const res = await request(app)
      .get('/events/search?venueNameÖVilla');

    expect(res.status).toBe(400);
  });

});


describe('GET /events/:id', () => {

  it('should return event details for valid id', async () => {
    const res = await request(app).get('/events/2');

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('event_date');

    expect(res.body).toHaveProperty('category');
    expect(res.body).toHaveProperty('venue');
  });

  it('should return 404 if event does not exist', async () => {
    const res = await request(app).get('/events/999999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid event id', async () => {
    const res = await request(app).get('/events/abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Id er ekki gilt');
  });

});