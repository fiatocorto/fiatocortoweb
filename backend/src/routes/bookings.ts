import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notifications';

const router = express.Router();
const prisma = new PrismaClient();

// Get bookings (admin sees all, user sees only their own)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.query;
    const isAdmin = req.userRole === 'ADMIN';

    const where: any = {};
    if (!isAdmin) {
      where.userId = req.userId;
    } else if (userId) {
      where.userId = userId as string;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tourDate: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Errore nel recupero prenotazioni' });
  }
});

// Get single booking
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tourDate: {
          include: {
            tour: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    // Check authorization
    if (req.userRole !== 'ADMIN' && booking.userId !== req.userId) {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Errore nel recupero prenotazione' });
  }
});

// Create booking
router.post(
  '/',
  authenticate,
  [
    body('tourDateId').isUUID().withMessage('Tour date ID non valido'),
    body('adults').isInt({ min: 1 }).withMessage('Numero adulti non valido'),
    body('children').optional().isInt({ min: 0 }),
    body('paymentMethod').isIn(['ONSITE', 'CARD_STUB']).withMessage('Metodo pagamento non valido'),
    body('notes').optional().isString(),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tourDateId, adults, children = 0, paymentMethod, notes } = req.body;

      // Get tour date with tour info
      const tourDate = await prisma.tourDate.findUnique({
        where: { id: tourDateId },
        include: { tour: true },
      });

      if (!tourDate) {
        return res.status(404).json({ error: 'Data tour non trovata' });
      }

      if (tourDate.status !== 'ACTIVE') {
        return res.status(400).json({ error: 'Data tour non disponibile' });
      }

      // Check availability
      const existingBookings = await prisma.booking.findMany({
        where: {
          tourDateId,
          paymentStatus: { not: 'CANCELLED' },
        },
      });

      const bookedSeats = existingBookings.reduce(
        (sum, b) => sum + b.adults + b.children,
        0
      );

      const requestedSeats = adults + children;
      if (bookedSeats + requestedSeats > tourDate.capacityMax) {
        return res.status(400).json({
          error: 'Posti non disponibili',
          availableSeats: tourDate.capacityMax - bookedSeats,
        });
      }

      // Calculate price
      const pricePerAdult = tourDate.priceOverride || tourDate.tour.priceAdult;
      const pricePerChild = tourDate.tour.priceChild;
      const totalPrice = adults * pricePerAdult + children * pricePerChild;

      // Generate QR code token
      const qrToken = uuidv4();

      // Create booking
      const booking = await prisma.booking.create({
        data: {
          userId: req.userId!,
          tourDateId,
          adults,
          children,
          totalPrice,
          paymentMethod,
          paymentStatus: paymentMethod === 'CARD_STUB' ? 'PENDING' : 'PENDING',
          qrCode: qrToken,
          notes,
        },
        include: {
          tourDate: {
            include: {
              tour: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      // Create notification for admin
      await createNotification('NEW_BOOKING', {
        bookingId: booking.id,
        tourTitle: tourDate.tour.title,
        userName: req.userId,
        totalPrice,
      });

      res.status(201).json({
        booking,
        qrToken,
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Errore nella creazione prenotazione' });
    }
  }
);

// Update booking
router.put(
  '/:id',
  authenticate,
  [
    body('adults').optional().isInt({ min: 1 }),
    body('children').optional().isInt({ min: 0 }),
    body('paymentStatus').optional().isIn(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED']),
    body('notes').optional().isString(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { tourDate: { include: { tour: true } } },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // Check authorization
      if (req.userRole !== 'ADMIN' && booking.userId !== req.userId) {
        return res.status(403).json({ error: 'Accesso negato' });
      }

      const updateData: any = {};
      if (req.body.adults !== undefined) updateData.adults = req.body.adults;
      if (req.body.children !== undefined) updateData.children = req.body.children;
      if (req.body.paymentStatus !== undefined) updateData.paymentStatus = req.body.paymentStatus;
      if (req.body.notes !== undefined) updateData.notes = req.body.notes;

      // Recalculate price if adults/children changed
      if (updateData.adults !== undefined || updateData.children !== undefined) {
        const adults = updateData.adults ?? booking.adults;
        const children = updateData.children ?? booking.children;
        const pricePerAdult = booking.tourDate.priceOverride || booking.tourDate.tour.priceAdult;
        const pricePerChild = booking.tourDate.tour.priceChild;
        updateData.totalPrice = adults * pricePerAdult + children * pricePerChild;
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: {
          tourDate: {
            include: {
              tour: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      // Create notification
      await createNotification('BOOKING_UPDATED', {
        bookingId: updatedBooking.id,
        changes: Object.keys(updateData),
      });

      res.json({ booking: updatedBooking });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento prenotazione' });
    }
  }
);

// Delete booking or request refund
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { requestRefund } = req.query;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { tourDate: { include: { tour: true } } },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    // Check authorization
    if (req.userRole !== 'ADMIN' && booking.userId !== req.userId) {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    if (requestRefund === 'true') {
      // Request refund (update status)
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { paymentStatus: 'CANCELLED' },
      });

      await createNotification('REFUND_REQUESTED', {
        bookingId: booking.id,
        tourTitle: booking.tourDate.tour.title,
        amount: booking.totalPrice,
      });

      return res.json({
        booking: updatedBooking,
        message: 'Richiesta rimborso inviata',
      });
    } else {
      // Delete booking (admin only or own booking)
      await prisma.booking.delete({ where: { id } });

      await createNotification('BOOKING_DELETED', {
        bookingId: booking.id,
      });

      return res.json({ message: 'Prenotazione eliminata' });
    }
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione prenotazione' });
  }
});

export default router;

