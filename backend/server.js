import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Ensure dotenv loads BEFORE any route or provider code imports execute with override: true
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });
dotenv.config({ override: true });

// 2. Route & Database imports (loaded AFTER dotenv)
import connectDB from './database/connection.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import notFound from './middleware/notFoundMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import creativeRoutes from './routes/creativeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import coordinatorRouter from './agents/coordinator/CoordinatorRouter.js';
import learningRoutes from './routes/learningRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import emailCoachRoutes from './routes/emailCoachRoutes.js';
import emailBriefingRoutes from './routes/emailBriefingRoutes.js';
import grammarRoutes from './routes/grammarRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';

// Mongoose Connection
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Access Logging
app.use(loggerMiddleware);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// REST Api Mappings
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'TaskPilot AI Backend', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'TaskPilot AI Backend API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/creative', creativeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/coordinator', coordinatorRouter);
app.use('/api/learning', learningRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/email-coach', emailCoachRoutes);
app.use('/api/email-briefing', emailBriefingRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/job-application', jobApplicationRoutes);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] TaskPilot AI enterprise server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[OAuth Config] GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
  console.log(`[OAuth Config] GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/email/google/callback'}`);
});
