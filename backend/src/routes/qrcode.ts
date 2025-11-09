import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Verify QR code (admin only for check-in)
router.post(
  '/verify',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token QR mancante' });
      }

      const booking = await prisma.booking.findUnique({
        where: { qrCode: token },
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
                },
              },
            },
          },
        },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // Mark as checked in if not already
      if (!booking.checkedIn) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { checkedIn: true },
        });
      }

      res.json({
        valid: true,
        booking: {
          ...booking,
          checkedIn: true,
        },
      });
    } catch (error) {
      console.error('QR verify error:', error);
      res.status(500).json({ error: 'Errore nella verifica QR' });
    }
  }
);

// Get booking by QR token (public endpoint for display)
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { qrCode: token },
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
    });

    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get QR booking error:', error);
    res.status(500).json({ error: 'Errore nel recupero prenotazione' });
  }
});

export default router;

