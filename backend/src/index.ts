import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import toursRoutes from './routes/tours';
import bookingsRoutes from './routes/bookings';
import qrcodeRoutes from './routes/qrcode';
import notificationsRoutes from './routes/notifications';
import adminRoutes from './routes/admin';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/qrcode', qrcodeRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admins', adminRoutes);

// Export app for serverless (Vercel)
export default app;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export { prisma };

