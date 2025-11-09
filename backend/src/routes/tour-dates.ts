import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get tour dates (optionally filtered by tourId)
router.get('/', [query('tourId').optional().isUUID()], async (req, res) => {
  try {
    const { tourId } = req.query;

    const where: any = {};
    if (tourId) {
      where.tourId = tourId as string;
    }

    const tourDates = await prisma.tourDate.findMany({
      where,
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
          },
        },
      },
      orderBy: { dateStart: 'asc' },
    });

    // Calculate availability
    const datesWithAvailability = await Promise.all(
      tourDates.map(async (date) => {
        const bookings = await prisma.booking.findMany({
          where: {
            tourDateId: date.id,
            paymentStatus: { not: 'CANCELLED' },
          },
        });

        const bookedSeats = bookings.reduce(
          (sum, b) => sum + b.adults + b.children,
          0
        );

        return {
          ...date,
          availableSeats: date.capacityMax - bookedSeats,
          bookedSeats,
        };
      })
    );

    res.json({ tourDates: datesWithAvailability });
  } catch (error) {
    console.error('Get tour dates error:', error);
    res.status(500).json({ error: 'Errore nel recupero date' });
  }
});

// Create tour date (admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('tourId').isUUID().withMessage('Tour ID non valido'),
    body('dateStart').isISO8601().withMessage('Data inizio non valida'),
    body('dateEnd').optional().isISO8601(),
    body('capacityMin').isInt({ min: 1 }).withMessage('Capacità minima non valida'),
    body('capacityMax').isInt({ min: 1 }).withMessage('Capacità massima non valida'),
    body('timezone').optional().isString(),
    body('priceOverride').optional().isFloat({ min: 0 }),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        tourId,
        dateStart,
        dateEnd,
        capacityMin = 1,
        capacityMax,
        timezone = 'Europe/Rome',
        priceOverride,
      } = req.body;

      // Verify tour exists
      const tour = await prisma.tour.findUnique({ where: { id: tourId } });
      if (!tour) {
        return res.status(404).json({ error: 'Tour non trovato' });
      }

      const tourDate = await prisma.tourDate.create({
        data: {
          tourId,
          dateStart: new Date(dateStart),
          dateEnd: dateEnd ? new Date(dateEnd) : null,
          capacityMin,
          capacityMax,
          timezone,
          priceOverride,
          status: 'ACTIVE',
        },
        include: {
          tour: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      res.status(201).json({ tourDate });
    } catch (error) {
      console.error('Create tour date error:', error);
      res.status(500).json({ error: 'Errore nella creazione data' });
    }
  }
);

export default router;

