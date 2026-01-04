import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/utils/app.js';

describe('GET /venues/:id', () => {

  it('should return venue details with upcoming events', async () => {
    const res = await request(app).get('/venues/1');

    expect(res.status).toBe(200);

    
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('address');
    expect(res.body).toHaveProperty('capacity');

    // events
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);

    // if events exist
    if (res.body.events.length > 0) {
      const event = res.body.events[0];
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('event_date');
      expect(event).toHaveProperty('category');
    }
  });

  it('should return 404 if venue does not exist', async () => {
    const res = await request(app).get('/venues/999999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid venue id', async () => {
    const res = await request(app).get('/venues/abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Id á stað ekki gilt');
  });

});