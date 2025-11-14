import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as admin from 'firebase-admin';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Try to load from environment variable first
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountEnv) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountEnv)),
      });
      console.log('Firebase Admin initialized from environment variable');
    } else {
      // Try to load from file (for local development)
      try {
        const path = require('path');
        const fs = require('fs');
        // Try multiple possible paths
        const possiblePaths = [
          path.join(__dirname, '../../fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'), // From src/routes
          path.join(process.cwd(), 'fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'), // From backend root
          path.join(process.cwd(), 'backend', 'fiato-corto-ba53e-firebase-adminsdk-fbsvc-6ecef97388.json'), // From project root
        ];
        
        let serviceAccountPath: string | null = null;
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            serviceAccountPath = possiblePath;
            console.log('Found service account file at:', serviceAccountPath);
            break;
          }
        }
        
        if (serviceAccountPath) {
          const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
          console.log('Firebase Admin initialized from service account file');
        } else {
          console.error('Service account file not found. Tried paths:', possiblePaths);
          throw new Error('Service account file not found');
        }
      } catch (fileError: any) {
        console.error('Error loading service account file:', fileError.message);
        // If file doesn't exist, try GOOGLE_APPLICATION_CREDENTIALS
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          try {
            admin.initializeApp({
              credential: admin.credential.applicationDefault(),
            });
            console.log('Firebase Admin initialized from GOOGLE_APPLICATION_CREDENTIALS');
          } catch (appDefaultError: any) {
            console.error('Error initializing with application default credentials:', appDefaultError.message);
            console.warn('Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT environment variable or place service account file in backend/ directory.');
          }
        } else {
          console.warn('Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT environment variable or place service account file in backend/ directory.');
        }
      }
    }
  } catch (error: any) {
    console.error('Error initializing Firebase Admin:', error);
    console.error('Error details:', error.message, error.stack);
  }
}

// Register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('Nome richiesto'),
    body('lastName').trim().notEmpty().withMessage('Cognome richiesto'),
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caratteri'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const name = `${firstName} ${lastName}`.trim();
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          name,
          email,
          passwordHash,
          role: 'CUSTOMER', // All new registrations are CUSTOMER by default
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

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Errore durante la registrazione' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email non valida'),
    body('password').notEmpty().withMessage('Password richiesta'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      // Check if user has a password (not OAuth-only user)
      if (!user.passwordHash) {
        return res.status(401).json({ error: 'Account registrato con Google. Usa il login con Google.' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Errore durante il login' });
    }
  }
);

// Firebase Authentication
router.post(
  '/firebase',
  [
    body('token').notEmpty().withMessage('Token richiesto'),
    body('email').isEmail().withMessage('Email non valida'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return res.status(500).json({ error: 'Firebase Admin non configurato. Verifica la configurazione del backend.' });
    }

    try {
      const { token, email, displayName, photoURL, firstName, lastName } = req.body;

      console.log('Firebase auth request received:', { email, hasToken: !!token, hasFirstName: !!firstName });

      // Verify Firebase token
      let decodedToken;
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Firebase token verified successfully:', { uid: decodedToken.uid, email: decodedToken.email });
      } catch (error: any) {
        console.error('Firebase token verification error:', error);
        return res.status(401).json({ error: 'Token Firebase non valido', details: error.message });
      }

      const firebaseUid = decodedToken.uid;
      const firebaseEmail = decodedToken.email || email;

      if (!firebaseEmail) {
        return res.status(400).json({ error: 'Email non disponibile' });
      }

      // Use provided firstName/lastName or parse from displayName
      const finalFirstName = firstName || (displayName ? displayName.split(' ')[0] : null);
      const finalLastName = lastName || (displayName ? displayName.split(' ').slice(1).join(' ') : null);
      const fullName = displayName || (finalFirstName && finalLastName ? `${finalFirstName} ${finalLastName}`.trim() : firebaseEmail.split('@')[0]);

      // Check if user exists by email or firebaseUid (stored in googleId field)
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: firebaseEmail },
            { googleId: firebaseUid },
          ],
        },
      });

      let finalUser;
      if (user) {
        // Update user if needed
        if (!user.googleId || user.googleId !== firebaseUid) {
          finalUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: firebaseUid,
              firstName: finalFirstName || user.firstName,
              lastName: finalLastName || user.lastName,
              name: fullName || user.name,
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
        } else {
          finalUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          };
        }
      } else {
        // Create new user - all new registrations are CUSTOMER by default
        finalUser = await prisma.user.create({
          data: {
            googleId: firebaseUid,
            firstName: finalFirstName,
            lastName: finalLastName,
            name: fullName,
            email: firebaseEmail,
            passwordHash: null, // No password for Firebase users
            role: 'CUSTOMER', // All new registrations are CUSTOMER by default
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
      }

      if (!finalUser) {
        return res.status(500).json({ error: 'Errore nella creazione/aggiornamento utente' });
      }

      const jwtToken = jwt.sign(
        { userId: finalUser.id, role: finalUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: finalUser,
        token: jwtToken,
      });
    } catch (error: any) {
      console.error('Firebase auth error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Errore durante l\'autenticazione Firebase',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
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

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Errore nel recupero utente' });
  }
});

// Update current user
router.put(
  '/me',
  authenticate,
  [
    body('firstName').optional().trim().notEmpty().withMessage('Nome non può essere vuoto'),
    body('lastName').optional().trim().notEmpty().withMessage('Cognome non può essere vuoto'),
    body('email').optional().isEmail().withMessage('Email non valida'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, email } = req.body;

      // Check if email is being changed and if it's already taken
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser && existingUser.id !== req.userId) {
          return res.status(400).json({ error: 'Email già registrata' });
        }
      }

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;

      // Update name if firstName or lastName changed
      if (firstName !== undefined || lastName !== undefined) {
        const finalFirstName = firstName !== undefined ? firstName : (await prisma.user.findUnique({ where: { id: req.userId } }))?.firstName;
        const finalLastName = lastName !== undefined ? lastName : (await prisma.user.findUnique({ where: { id: req.userId } }))?.lastName;
        updateData.name = `${finalFirstName || ''} ${finalLastName || ''}`.trim() || email?.split('@')[0] || '';
      }

      const user = await prisma.user.update({
        where: { id: req.userId },
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

      res.json({ user });
    } catch (error: any) {
      console.error('Update user error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email già registrata' });
      }
      res.status(500).json({ error: 'Errore nell\'aggiornamento utente' });
    }
  }
);

export default router;

