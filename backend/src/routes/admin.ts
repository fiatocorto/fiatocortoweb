import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getFirebaseAdmin } from '../utils/firebaseAdmin';

const router = express.Router();
const prisma = new PrismaClient();

// Create user (admin only - can create both ADMIN and CUSTOMER)
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('firstName').trim().notEmpty().withMessage('Nome richiesto'),
    body('lastName').trim().notEmpty().withMessage('Cognome richiesto'),
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caratteri'),
    body('role').optional().isIn(['ADMIN', 'CUSTOMER']).withMessage('Ruolo non valido'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, email, password, role = 'CUSTOMER' } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      const trimmedEmail = email.trim();

      // Get Firebase Admin instance
      const firebaseAdmin = getFirebaseAdmin();

      // Create user in Firebase Authentication
      let firebaseUser;
      try {
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: trimmedEmail,
          password: password,
          displayName: name,
          emailVerified: false,
        });
        console.log('Firebase user created:', firebaseUser.uid);
      } catch (firebaseError: any) {
        console.error('Error creating Firebase user:', firebaseError);
        // If Firebase user already exists, try to get it
        if (firebaseError.code === 'auth/email-already-exists') {
          try {
            firebaseUser = await firebaseAdmin.auth().getUserByEmail(trimmedEmail);
            console.log('Firebase user already exists, retrieved:', firebaseUser.uid);
          } catch (getError: any) {
            return res.status(400).json({ error: 'Email già registrata in Firebase' });
          }
        } else {
          return res.status(500).json({ 
            error: 'Errore nella creazione utente in Firebase',
            details: process.env.NODE_ENV === 'development' ? firebaseError.message : undefined
          });
        }
      }

      // Create user in database
      const user = await prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name,
          email: trimmedEmail,
          passwordHash,
          role: role as 'ADMIN' | 'CUSTOMER',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(201).json({ user });
    } catch (error: any) {
      console.error('Create user error:', error);
      res.status(500).json({ 
        error: 'Errore nella creazione utente',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get all users (admin only)
router.get('/users', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        passwordHash: true,
        googleId: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format users with registration method
    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      registrationMethod: user.googleId ? 'Google' : user.passwordHash ? 'Email/Password' : 'Unknown',
      role: user.role,
      createdAt: user.createdAt,
      bookingsCount: user._count.bookings,
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Errore nel recupero utenti' });
  }
});

// Update user (admin only)
router.put(
  '/users/:id',
  authenticate,
  requireAdmin,
  [
    body('firstName').optional().trim().notEmpty().withMessage('Nome richiesto'),
    body('lastName').optional().trim().notEmpty().withMessage('Cognome richiesto'),
    body('email').optional().isEmail().withMessage('Email non valida'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }

      // Prepare update data
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (email !== undefined) {
        const trimmedEmail = email.trim();
        // Check if email is already taken by another user
        const existingUser = await prisma.user.findFirst({
          where: {
            email: trimmedEmail,
            id: { not: id },
          },
        });
        if (existingUser) {
          return res.status(400).json({ error: 'Email già registrata' });
        }
        updateData.email = trimmedEmail;
        // Update name if firstName or lastName changed
        if (firstName !== undefined || lastName !== undefined) {
          const finalFirstName = firstName !== undefined ? firstName.trim() : user.firstName;
          const finalLastName = lastName !== undefined ? lastName.trim() : user.lastName;
          updateData.name = `${finalFirstName} ${finalLastName}`.trim();
        }
      } else if (firstName !== undefined || lastName !== undefined) {
        // Update name even if email is not provided
        const finalFirstName = firstName !== undefined ? firstName.trim() : user.firstName;
        const finalLastName = lastName !== undefined ? lastName.trim() : user.lastName;
        updateData.name = `${finalFirstName} ${finalLastName}`.trim();
      }

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.json({ user: updatedUser });
    } catch (error: any) {
      console.error('Update user error:', error);
      res.status(500).json({
        error: 'Errore nell\'aggiornamento utente',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Delete user (admin only)
router.delete('/users/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.userId) {
      return res.status(400).json({ error: 'Non puoi eliminare il tuo stesso account' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Check if user has bookings
    if (user.bookings.length > 0) {
      return res.status(400).json({ 
        error: `Impossibile eliminare l'utente: ha ${user.bookings.length} prenotazione/i attive` 
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione utente' });
  }
});

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

