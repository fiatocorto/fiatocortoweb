import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.tour.findUnique({
      where: { slug },
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Get all tours with filters
router.get(
  '/',
  [
    query('destination').optional().isString(),
    query('language').optional().isString(),
    query('minPrice').optional().isFloat(),
    query('maxPrice').optional().isFloat(),
    query('date').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const { destination, language, minPrice, maxPrice, date } = req.query;

      const where: any = {};

      if (destination) {
        where.title = { contains: destination as string, mode: 'insensitive' };
      }

      if (language) {
        where.language = language as string;
      }

      if (minPrice || maxPrice) {
        where.priceAdult = {};
        if (minPrice) where.priceAdult.gte = parseFloat(minPrice as string);
        if (maxPrice) where.priceAdult.lte = parseFloat(maxPrice as string);
      }

      const whereDate: any = {};
      if (date) {
        whereDate.dateStart = {
          gte: new Date(date as string),
          lte: new Date(new Date(date as string).setHours(23, 59, 59)),
        };
      }

      const tours = await prisma.tour.findMany({
        where: { ...where, ...whereDate },
        orderBy: { createdAt: 'desc' },
      });

      console.log(`Found ${tours.length} tours`);
      res.json({ tours });
    } catch (error) {
      console.error('Get tours error:', error);
      res.status(500).json({ error: 'Errore nel recupero tour' });
    }
  }
);

// Get single tour by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await prisma.tour.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour non trovato' });
    }

    // Calculate available seats
    const bookings = await prisma.booking.findMany({
      where: {
        tourId: tour.id,
        paymentStatus: { not: 'CANCELLED' },
      },
    });

    const bookedSeats = bookings.reduce(
      (sum, b) => sum + b.adults + b.children,
      0
    );

    const availableSeats = tour.maxSeats - bookedSeats;

    res.json({
      tour: {
        ...tour,
        availableSeats,
        bookedSeats,
      },
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({ error: 'Errore nel recupero tour' });
  }
});

// Create tour (admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('title').notEmpty().withMessage('Titolo richiesto'),
    body('description').notEmpty().withMessage('Descrizione richiesta'),
    body('priceAdult').isFloat({ min: 0 }).withMessage('Prezzo adulto non valido'),
    body('priceChild').optional().isFloat({ min: 0 }).withMessage('Prezzo bambino non valido'),
    body('language').notEmpty().withMessage('Lingua richiesta'),
    body('itinerary').optional().notEmpty().withMessage('Itinerario richiesto'),
    body('durationValue').isInt({ min: 1 }).withMessage('Durata non valida'),
    body('durationUnit').notEmpty().withMessage('Unità durata richiesta'),
    body('coverImage').optional().isString().withMessage('Immagine copertina non valida'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        title,
        description,
        priceAdult,
        priceChild,
        language,
        itinerary,
        durationValue,
        durationUnit,
        coverImage,
        images = [],
        includes = [],
        excludes = [],
        terms = '',
        maxSeats,
        difficulty,
        isMultiDay = false,
        dateStart,
        dateEnd,
        gallery,
      } = req.body;

      // Generate slug from title
      const baseSlug = generateSlug(title);
      const slug = await ensureUniqueSlug(baseSlug);

      const tour = await prisma.tour.create({
        data: {
          title,
          slug,
          description,
          priceAdult,
          priceChild: priceChild ?? 0,
          language,
          itinerary: itinerary || '',
          durationValue,
          durationUnit,
          coverImage: coverImage || '',
          images: JSON.stringify(images),
          includes: JSON.stringify(includes),
          excludes: JSON.stringify(excludes),
          terms,
          maxSeats: maxSeats || 20,
          difficulty: difficulty || null,
          isMultiDay: isMultiDay || false,
          dateStart: dateStart ? new Date(dateStart) : new Date(),
          dateEnd: dateEnd ? new Date(dateEnd) : new Date(),
          gallery: gallery || null,
          createdBy: req.userId!,
        },
      });

      res.status(201).json({ tour });
    } catch (error: any) {
      console.error('Create tour error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug già esistente' });
      }
      res.status(500).json({ error: 'Errore nella creazione tour' });
    }
  }
);

// Update tour (admin only)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updateData: any = {};

      const allowedFields = [
        'title',
        'description',
        'priceAdult',
        'priceChild',
        'language',
        'itinerary',
        'durationValue',
        'durationUnit',
        'coverImage',
        'images',
        'includes',
        'excludes',
        'terms',
        'maxSeats',
        'difficulty',
        'isMultiDay',
        'dateStart',
        'dateEnd',
        'gallery',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (['images', 'includes', 'excludes'].includes(field)) {
            updateData[field] = JSON.stringify(req.body[field]);
          } else if (['dateStart', 'dateEnd'].includes(field) && req.body[field]) {
            updateData[field] = new Date(req.body[field]);
          } else {
            updateData[field] = req.body[field];
          }
        }
      });

      const tour = await prisma.tour.update({
        where: { id },
        data: updateData,
      });

      res.json({ tour });
    } catch (error: any) {
      console.error('Update tour error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Tour non trovato' });
      }
      res.status(500).json({ error: 'Errore nell\'aggiornamento tour' });
    }
  }
);

// Delete tour (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.tour.delete({
      where: { id },
    });

    res.json({ message: 'Tour eliminato con successo' });
  } catch (error: any) {
    console.error('Delete tour error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tour non trovato' });
    }
    res.status(500).json({ error: 'Errore nell\'eliminazione tour' });
  }
});

export default router;

