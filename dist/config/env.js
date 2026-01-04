import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    const err = new Error('Missing JWT_SECRET in environment');
    err.status = 404;
    throw err;
}
export const JWT_SECRET = jwtSecret;
