import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import productivityRoutes from './routes/productivityRoutes.js';

// Setup __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env configuration from root workspace path first, fallback to local backend path
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Allow all origins in development, easy to configure
  credentials: true
}));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), app: 'TaskPilot AI Backend' });
});

// Map API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/productivity', productivityRoutes);

// Fallback Middleware mappings
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] TaskPilot AI backend listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
