import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise({});

// Support both DATABASE_URL (production) and individual env vars (local dev)
const db = process.env.DATABASE_URL
  ? pgp(process.env.DATABASE_URL)
  : pgp({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

db.connect()
  .then((obj) => {
    console.log('✅ Connected to PostgreSQL database');
    obj.done();
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
  });

export default db;
