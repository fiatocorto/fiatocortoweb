import express, { Response } from 'express';
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
  async (req, res: Response) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { destination, language, minPrice, maxPrice, date } = req.query;

      // First, handle search separately to get tour IDs
      let searchTourIds: string[] | null = null;
      if (destination) {
        const searchTerm = String(destination).trim();
        if (searchTerm) {
          try {
            // Use Prisma query with case-insensitive search (more reliable than raw SQL)
            const allTours = await prisma.tour.findMany({
              select: { id: true, title: true, description: true },
            });
            const lowerSearchTerm = searchTerm.toLowerCase();
            searchTourIds = allTours
              .filter(t => 
                t.title.toLowerCase().includes(lowerSearchTerm) ||
                t.description.toLowerCase().includes(lowerSearchTerm)
              )
              .map(t => t.id);
            console.log(`Search found ${searchTourIds.length} matching tours for "${searchTerm}"`);
          } catch (searchError: any) {
            console.error('Search error:', searchError);
            // If search fails, return empty results
            searchTourIds = [];
          }
        }
      }

      // Build where clause step by step
      const conditions: any[] = [];

      // Add search filter if we have results
      if (searchTourIds !== null) {
        if (searchTourIds.length > 0) {
          conditions.push({
            id: { in: searchTourIds },
          });
        } else {
          // If no search results, return empty array
          return res.json({ tours: [] });
        }
      }

      // Language filter
      if (language) {
        conditions.push({
          language: String(language),
        });
      }

      // Price filters
      if (minPrice || maxPrice) {
        const priceFilter: any = {};
        if (minPrice) priceFilter.gte = parseFloat(String(minPrice));
        if (maxPrice) priceFilter.lte = parseFloat(String(maxPrice));
        conditions.push({
          priceAdult: priceFilter,
        });
      }

      // Date filter
      if (date) {
        const dateObj = new Date(String(date));
        const endDate = new Date(dateObj);
        endDate.setHours(23, 59, 59, 999);
        conditions.push({
          dateStart: {
            gte: dateObj,
            lte: endDate,
          },
        });
      }

      // Combine all conditions with AND
      const finalWhere = conditions.length > 0 
        ? { AND: conditions }
        : {};

      console.log('Search query:', { destination, language, minPrice, maxPrice, date });
      console.log('Where clause:', JSON.stringify(finalWhere, null, 2));

      // Execute query with safe ordering
      const tours = await prisma.tour.findMany({
        where: finalWhere,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' } // Fallback ordering
        ],
      });

      console.log(`Found ${tours.length} tours`);
      if (tours.length > 0) {
        console.log('Tours:', tours.map(t => ({ id: t.id, title: t.title })));
      } else if (destination || language || minPrice || maxPrice || date) {
        console.log('No tours found with the specified filters');
      }
      
      res.json({ tours });
    } catch (error: any) {
      console.error('Get tours error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      res.status(500).json({ 
        error: 'Errore nel recupero tour',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get single tour by ID or slug
router.get('/:id', async (req, res: Response) => {
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
    body('coverImage').notEmpty().withMessage('Immagine copertina richiesta'),
    body('difficulty').notEmpty().withMessage('Difficoltà richiesta'),
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
          difficulty,
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

      // Ensure coverImage is not empty if provided
      if (updateData.coverImage !== undefined && (!updateData.coverImage || (typeof updateData.coverImage === 'string' && updateData.coverImage.trim() === ''))) {
        return res.status(400).json({ error: 'Immagine copertina richiesta' });
      }

      // Ensure difficulty is not empty if provided
      if (updateData.difficulty !== undefined && (!updateData.difficulty || (typeof updateData.difficulty === 'string' && updateData.difficulty.trim() === ''))) {
        return res.status(400).json({ error: 'Difficoltà richiesta' });
      }

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

