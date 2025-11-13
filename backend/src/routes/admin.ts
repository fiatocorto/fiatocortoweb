import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Create admin user
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Nome richiesto'),
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caratteri'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'ADMIN',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(201).json({ admin });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ error: 'Errore nella creazione admin' });
    }
  }
);

// Get dashboard stats
router.get('/dashboard/stats', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [totalTours, totalBookings, todayBookings, totalRevenue] = await Promise.all([
      prisma.tour.count(),
      prisma.booking.count({
        where: { paymentStatus: { not: 'CANCELLED' } },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          paymentStatus: { not: 'CANCELLED' },
        },
      }),
      prisma.booking.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalPrice: true },
      }),
    ]);

    // Calculate total available seats
    const tours = await prisma.tour.findMany({
      include: { bookings: { where: { paymentStatus: { not: 'CANCELLED' } } } },
    });

    let totalAvailableSeats = 0;
    tours.forEach((tour) => {
      const bookedSeats = tour.bookings.reduce(
        (sum, b) => sum + b.adults + b.children,
        0
      );
      totalAvailableSeats += tour.maxSeats - bookedSeats;
    });

    res.json({
      stats: {
        totalTours,
        totalBookings,
        todayBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalAvailableSeats,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero statistiche' });
  }
});

export default router;

