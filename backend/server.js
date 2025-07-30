import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import 'dotenv/config';

import userRoutes from './routes/userRoute.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ important
app.use('/uploads', express.static(path.join(path.resolve(), 'backend/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Routes
app.use('/api/user', userRoutes); // ✅ use routes AFTER app is defined

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

