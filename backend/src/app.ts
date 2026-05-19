import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
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
