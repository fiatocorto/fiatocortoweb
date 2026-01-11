import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import toursRoutes from './routes/tours';
import bookingsRoutes from './routes/bookings';
import qrcodeRoutes from './routes/qrcode';
import notificationsRoutes from './routes/notifications';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';

const app = express();
const prisma = new PrismaClient();

// CORS configuration - automatically accept the origin from the request
// This works for both development and production without needing FRONTEND_URL
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
    if (!origin) return callback(null, true);
    
    // Automatically accept any origin that makes a request
    // This allows the frontend to work from any URL (localhost, IP, domain, etc.)
    // without needing to configure FRONTEND_URL
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
app.use('/api/upload', uploadRoutes);

// Export app for serverless (Vercel)
export default app;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  });
}

export { prisma };

