import dotnev from 'dotenv';

dotnev.config({ path: '.env.test '});

import db from '../src/config/db';

export const resetDb = async () => {
    await db.none("TRUNCATE TABLE users RESTART IDENTIDY CASCADE;")
}

