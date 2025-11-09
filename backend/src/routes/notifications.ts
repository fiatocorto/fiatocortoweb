import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get notifications (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { seen, limit = 50 } = req.query;

    const where: any = {};
    if (seen !== undefined) {
      where.seen = seen === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Errore nel recupero notifiche' });
  }
});

// Mark notification as seen
router.put('/:id/seen', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { seen: true },
    });

    res.json({ notification });
  } catch (error) {
    console.error('Mark notification seen error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento notifica' });
  }
});

// Mark all as seen
router.put('/seen/all', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { seen: false },
      data: { seen: true },
    });

    res.json({ message: 'Tutte le notifiche sono state segnate come lette' });
  } catch (error) {
    console.error('Mark all seen error:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento notifiche' });
  }
});

// Get unread count
router.get('/unread/count', authenticate, requireAdmin, async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { seen: false },
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Errore nel recupero conteggio' });
  }
});

export default router;

