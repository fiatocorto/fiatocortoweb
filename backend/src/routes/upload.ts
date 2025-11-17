import express, { Response } from 'express';
import multer from 'multer';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadFileToStorage, deleteFileFromStorage } from '../utils/firebaseAdmin';

const router = express.Router();

// Configure multer to use memory storage (no disk writes)
const memoryStorage = multer.memoryStorage();

// Multer configuration for images
const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop() || '');
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi! (jpeg, jpg, png, gif, webp)'));
    }
  },
});

// Multer configuration for GPX files
const gpxUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only GPX files
    const extname = file.originalname.toLowerCase().endsWith('.gpx');
    const mimetype = file.mimetype === 'application/gpx+xml' || 
                     file.mimetype === 'application/xml' ||
                     file.mimetype === 'text/xml' ||
                     file.originalname.toLowerCase().endsWith('.gpx');

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo file GPX sono permessi!'));
    }
  },
});

// Upload single image
router.post(
  '/single',
  authenticate,
  requireAdmin,
  imageUpload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Upload to Firebase Storage
      const fileUrl = await uploadFileToStorage(
        req.file.buffer,
        req.file.originalname,
        'tour-images',
        req.file.mimetype
      );

      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Errore nel caricamento del file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Upload multiple images
router.post(
  '/multiple',
  authenticate,
  requireAdmin,
  imageUpload.array('images', 10), // Maximum 10 images
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      const files = req.files as Express.Multer.File[];
      
      // Upload all files to Firebase Storage
      const uploadPromises = files.map(file =>
        uploadFileToStorage(
          file.buffer,
          file.originalname,
          'tour-images',
          file.mimetype
        )
      );

      const urls = await Promise.all(uploadPromises);
      
      res.json({ urls });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Errore nel caricamento dei file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Upload GPX file
router.post(
  '/gpx',
  authenticate,
  requireAdmin,
  gpxUpload.single('gpx'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Upload to Firebase Storage
      const fileUrl = await uploadFileToStorage(
        req.file.buffer,
        req.file.originalname,
        'gpx-tracks',
        'application/gpx+xml'
      );

      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Errore nel caricamento del file GPX',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Delete file from Firebase Storage
router.delete(
  '/delete',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL del file richiesto' });
      }

      // Delete from Firebase Storage
      await deleteFileFromStorage(url);

      res.json({ message: 'File eliminato con successo' });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ 
        error: 'Errore nell\'eliminazione del file',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
