import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import app from '../src/utils/app';
import db from "../src/config/db";


interface SignupInput {
  name: string;
  email: string;
  password: string;
}

const users: SignupInput[] = [
  {
    "name": "Hafrún Test",
    "email": "hafrun@test.com",
    "password": "Password123!"
  },
  {
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "AdminPass1!"
  },
  {
    "name": "Duplicate User",
    "email": "duplicate@test.com",
    "password": "Test1234"
  },
  {
    "name": "Second User",
    "email": "second@test.com",
    "password": "Secret777"
  },
  {
    "name": "Login User",
    "email": "login@test.com",
    "password": "mypassword"
  }
];

beforeEach(async () => {
  await db.none("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
});

afterAll(async () => {
  await db.$pool.end();
});

describe("POST /auth/signup", () => {

  it("should create a new user successfully", async () => {
    const user = users[0];

    const res = await request(app)
      .post("/auth/signup")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.name).toBe(user.name);
    expect(res.body.user.id).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    const user = users[1];

    // First signup
    await request(app).post("/auth/signup").send(user);

    // Second signup (same email)
    const res = await request(app).post("/auth/signup").send(user);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should reject invalid email", async () => {
    const badUser = {
      name: "Broken Email",
      email: "notanemail",
      password: "Test1234"
    };

    const res = await request(app)
      .post("/auth/signup")
      .send(badUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

});


