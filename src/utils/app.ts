import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import authRoutes from '../routes/authRoutes.js';
import eventRoutes from '../routes/eventRoutes.js';
import venueRoutes from '../routes/venueRoutes.js';
import bookingRoutes from '../routes/bookingRoutes.js';
import userRoutes from '../routes/userRoutes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/venues', venueRoutes);
app.use('/bookings', bookingRoutes);
app.use('/user', userRoutes);


app.use(errorHandler); 

export default app;
