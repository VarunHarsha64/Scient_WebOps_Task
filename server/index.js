import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import slotRoutes from './routes/slotRoutes.js'
import { initializeSlots } from './controllers/slotController.js';
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


connectDB(); //conect to mongodb

//initialize slots every 7 days on server starting
initializeSlots();

//routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slots', slotRoutes );

// Start the server
const { PORT = 5000 } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
