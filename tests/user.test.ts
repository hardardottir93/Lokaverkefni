import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/utils/app";
import db from "../src/config/db";

let mockUserId = 1;

vi.mock("../src/middleware/authMiddleware", () => {
    return {
        authenticateUser: (_req: any, res: any, next: any) => {
        res.locals.user = { id: mockUserId };
        next();
        },
    };
});

const insertUser = async (name: string, email: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 12);
    return db.one(
        `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email`,
        [name, email, password_hash]
    );
};

describe("PATCH /user/update", () => {
    beforeEach(async () => {
        await db.none("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
        const u = await insertUser("Gamla Nafn", "test@example.com", "secret123");
        mockUserId = u.id;
  });

    it("should return 200 and update name", async () => {
        const res = await request(app)
        .patch("/user/update")
        .send({ name: "Nýtt Nafn" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeTruthy();
        expect(res.body.user.name).toBe("Nýtt Nafn");

        const row = await db.one("SELECT name FROM users WHERE id = $1", [mockUserId]);
        expect(row.name).toBe("Nýtt Nafn");
    });

    it("should return 200 and update email if it doesn't exists", async () => {
        const res = await request(app)
        .patch("/user/update")
        .send({ email: "new@example.com" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe("new@example.com");
    });

    it("should return 400 if the email is in use already", async () => {
        await insertUser("Other", "other@example.com", "secret123");

        const res = await request(app)
        .patch("/user/update")
        .send({ email: "other@example.com" });

        expect(res.status).toBe(400);
    
        expect(res.body.success).toBe(false);
    });

    it("should return 200 update password and hash it", async () => {
        const before = await db.one("SELECT password_hash FROM users WHERE id = $1", [mockUserId]);

        const res = await request(app)
        .patch("/user/update")
        .send({ password: "newsecret123" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const after = await db.one("SELECT password_hash FROM users WHERE id = $1", [mockUserId]);

        expect(after.password_hash).not.toBe(before.password_hash);

        const ok = await bcrypt.compare("newsecret123", after.password_hash);
        expect(ok).toBe(true);
    });

    it("should return 400 if all the information are missing", async () => {
        const res = await request(app).patch("/user/update").send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
