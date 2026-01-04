import db from '../config/db.js';
export const findUserByEmail = async (email) => {
    return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};
export const findUserById = async (id) => {
    return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};
export const deleteUserById = async (id) => {
    return db.result("DELETE FROM users WHERE id = $1", [id], (r) => r.rowCount);
};
export const createUser = async (user) => {
    return await db.one('INSERT INTO users (name, email, password_hash) VALUES($1, $2, $3) RETURNING name, id, email, created_at, updated_at', [user.name, user.email, user.password_hash]);
};
export const updateUserById = async (id, updates) => {
    const sets = [];
    const values = [];
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
    if (sets.length === 0)
        return null;
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
