import db from '../config/db';

export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export type UserTokenPayload = {
  sub: number;
};

export type CreateUser = Pick<User, 'name' |'email' | 'password_hash'>;

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};

export const createUser = async (user: CreateUser): Promise<User> => {
  return await db.one(
    'INSERT INTO users (name, email, password_hash) VALUES($1, $2, $3) RETURNING id, name, email, created_at, updated_at',
    [user.name, user.email, user.password_hash]
  );
};
