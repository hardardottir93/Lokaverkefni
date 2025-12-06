import express from 'express';
import cuisineRoutes from './routes/cuisineRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

const app = express();

app.use(express.json());

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


//Breyta
//app.use('/api/cuisines', cuisineRoutes);
//app.use('/api/recipes', recipeRoutes);

export default app;
