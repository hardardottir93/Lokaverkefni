import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET in environment");
}

export const JWT_SECRET: string = jwtSecret;