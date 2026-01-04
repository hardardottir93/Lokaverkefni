import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/utils/app.js';
import db from '../src/config/db.js';

describe('POST /auth/signup', () => {
  it('should create a user successfully', async () => {
    //Bý til notanda með date.now til þess að email verði ekki það sama.
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';

    const res = await request(app).post('/auth/signup').send({
      name: 'Test User',
      email,
      password,
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(email);

    // staðfesta að lykilorð sé hassað í DB
    const userInDb = await db.one(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    expect(userInDb.password_hash).not.toBe(password);
    
  });
});

describe('POST /auth/login', () => {
  it('should return a token when user and password are correct', async () => {
    const email = `login-${Date.now()}@example.com`;
    const password = 'password123';

    // signup
    await request(app).post('/auth/signup').send({
      name: 'Login User',
      email,
      password,
    });

    // login
    const res = await request(app).post('/auth/login').send({
      email,
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return 401 if the password is incorrec', async () => {
    const email = `wrong-${Date.now()}@example.com`;
    const password = 'password123';

    // signup
    await request(app).post('/auth/signup').send({
      name: 'Wrong Password User',
      email,
      password,
    });

    // login með vitlausu lykilorði
    const res = await request(app).post('/auth/login').send({
      email,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 if the email does not exist', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
  });
});
