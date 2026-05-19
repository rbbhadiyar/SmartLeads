import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) and any localhost port
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(errorHandler);

export default app;
