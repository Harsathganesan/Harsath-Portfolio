import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from '../server/routes/portfolioRoutes.js';
import Portfolio from '../server/models/Portfolio.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Cached database connection state for Vercel serverless functions
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI && !MONGODB_URI.includes('<username>')) {
    try {
      await mongoose.connect(MONGODB_URI);
      isConnected = true;
      console.log('Vercel Serverless: Successfully connected to MongoDB Atlas!');
    } catch (err) {
      console.error('Vercel Serverless: MongoDB Atlas Connection Error:', err.message);
    }
  }
};

// Ensure database connection is ready before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Base API route check
app.get('/api', (req, res) => {
  res.json({ status: 'online', message: 'Portfolio MongoDB Backend API Server Running on Vercel' });
});

export default app;
