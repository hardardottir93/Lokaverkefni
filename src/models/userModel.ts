import db from '../config/db';

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export type UserTokenPayload = {
  id: number;
  email: string;
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
    'INSERT INTO users (name, email, password_hash) VALUES($1, $2, $3) RETURNING name, id, email, created_at, updated_at',
    [user.name, user.email, user.password_hash]
  );
};

export type UpdateUser = Partial<Pick<User, 'name' | 'email' | 'password_hash'>>;

export const updateUserById = async (
  id: number,
  updates: UpdateUser
): Promise<Pick<User, 'id' | 'name' | 'email' | 'created_at' | 'updated_at'> | null> => {
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (updates.name !== undefined) {
    sets.push(`name = $${idx++}`);
    values.push(updates.name);
  }

  if (updates.email !== undefined) {
    sets.push(`email = $${idx++}`);
    values.push(updates.email);
  }

  if (updates.password_hash !== undefined) {
    sets.push(`password_hash = $${idx++}`);
    values.push(updates.password_hash);
  }

  if (sets.length === 0) return null;

  sets.push(`updated_at = NOW()`);

  values.push(id);

  const query = `
    UPDATE users
    SET ${sets.join(', ')}
    WHERE id = $${idx}
    RETURNING id, name, email, created_at, updated_at
  `;

  return db.oneOrNone(query, values);
};
