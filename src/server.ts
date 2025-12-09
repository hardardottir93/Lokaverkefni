import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("Missing JWT_SECRET in environment");
}

export const JWT_SECRET: string = secret;



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
