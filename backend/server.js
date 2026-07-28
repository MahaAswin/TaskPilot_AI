import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './database/connection.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import notFound from './middleware/notFoundMiddleware.js';
import errorHandler from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import creativeRoutes from './routes/creativeRoutes.js';
import productivityRoutes from './routes/productivityRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import coordinatorRouter from './agents/coordinator/CoordinatorRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env configuration
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

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
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/creative', creativeRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/coordinator', coordinatorRouter);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] TaskPilot AI enterprise server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
