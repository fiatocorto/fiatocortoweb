import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configurazione multer per salvare i file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva nella cartella public/resources/TourImages del frontend
    // Usa path.resolve per gestire meglio i percorsi relativi
    const uploadPath = path.resolve(__dirname, '../../../frontend/public/resources/TourImages');
    
    // Crea la cartella se non esiste
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Genera un nome file unico
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accetta solo immagini
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi!'));
    }
  }
});

// Configurazione storage per file GPX
const gpxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva nella cartella frontend/public/tracceGPX
    const uploadPath = path.resolve(__dirname, '../../../frontend/public/tracceGPX');
    
    // Crea la cartella se non esiste
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Genera un nome file unico
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

// Configurazione multer per file GPX
const gpxUpload = multer({
  storage: gpxStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accetta solo file GPX
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.gpx') {
      return cb(null, true);
    } else {
      cb(new Error('Solo file GPX sono permessi!'));
    }
  }
});

// Upload singola immagine
router.post(
  '/single',
  authenticate,
  requireAdmin,
  upload.single('image'),
  (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Restituisce l'URL relativo del file
      const fileUrl = `/resources/TourImages/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Errore nel caricamento del file' });
    }
  }
);

// Upload multiple immagini
router.post(
  '/multiple',
  authenticate,
  requireAdmin,
  upload.array('images', 10), // Massimo 10 immagini
  (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      const files = req.files as Express.Multer.File[];
      const urls = files.map(file => `/resources/TourImages/${file.filename}`);
      
      res.json({ urls });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Errore nel caricamento dei file' });
    }
  }
);

// Upload file GPX
router.post(
  '/gpx',
  authenticate,
  requireAdmin,
  gpxUpload.single('gpx'),
  (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }

      // Restituisce l'URL relativo del file
      const fileUrl = `/tracceGPX/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Errore nel caricamento del file GPX' });
    }
  }
);

export default router;

