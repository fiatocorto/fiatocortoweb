import express, { Request, Response } from 'express';
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
    query('costType').optional().isIn(['free', 'paid']),
    query('minPrice').optional().isFloat(),
    query('maxPrice').optional().isFloat(),
    query('date').optional().isISO8601(),
  ],
  async (req: Request, res: Response) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { destination, language, costType, minPrice, maxPrice, date } = req.query;

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

      // Cost type filter (free or paid)
      if (costType === 'free') {
        // Show only free tours (priceAdult = 0)
        conditions.push({
          priceAdult: 0,
        });
      } else if (costType === 'paid') {
        // Show only paid tours (priceAdult > 0)
        conditions.push({
          priceAdult: {
            gt: 0,
          },
        });
      }

      // Price filters (only apply if costType is 'paid' or not set)
      if (costType !== 'free' && (minPrice || maxPrice)) {
        const priceFilter: any = {};
        if (minPrice) priceFilter.gte = parseFloat(String(minPrice));
        if (maxPrice) priceFilter.lte = parseFloat(String(maxPrice));
        conditions.push({
          priceAdult: priceFilter,
        });
      }

      // Date filter - filter by dateStart matching the selected date
      if (date) {
        const dateString = String(date);
        // Parse the date string (format: YYYY-MM-DD)
        const dateObj = new Date(dateString);
        // Set to start of day in local timezone
        const startOfDay = new Date(dateObj);
        startOfDay.setHours(0, 0, 0, 0);
        // Set to end of day in local timezone
        const endOfDay = new Date(dateObj);
        endOfDay.setHours(23, 59, 59, 999);
        
        console.log('Date filter:', {
          input: dateString,
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString()
        });
        
        conditions.push({
          dateStart: {
            gte: startOfDay,
            lte: endOfDay,
          },
        });
      }

      // Combine all conditions with AND
      const finalWhere = conditions.length > 0 
        ? { AND: conditions }
        : {};

      console.log('Search query:', { destination, language, costType, minPrice, maxPrice, date });
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
      
      // Calculate available seats for each tour
      const toursWithAvailability = await Promise.all(
        tours.map(async (tour) => {
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

          return {
            ...tour,
            availableSeats: Math.max(0, availableSeats), // Ensure non-negative
          };
        })
      );
      
      res.json({ tours: toursWithAvailability });
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
    body('whatsappLink').notEmpty().withMessage('Link WhatsApp richiesto'),
  ],
  async (req: AuthRequest, res: Response) => {
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
        whatsappLink,
        gpxTrack,
        latitude,
        longitude,
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
          whatsappLink: whatsappLink || '',
          gpxTrack: gpxTrack || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
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
        'whatsappLink',
        'gpxTrack',
        'latitude',
        'longitude',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (['images', 'includes', 'excludes'].includes(field)) {
            updateData[field] = JSON.stringify(req.body[field]);
          } else if (['dateStart', 'dateEnd'].includes(field) && req.body[field]) {
            updateData[field] = new Date(req.body[field]);
          } else if (['latitude', 'longitude'].includes(field)) {
            updateData[field] = req.body[field] ? parseFloat(req.body[field]) : null;
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

      // Ensure whatsappLink is not empty if provided
      if (updateData.whatsappLink !== undefined && (!updateData.whatsappLink || (typeof updateData.whatsappLink === 'string' && updateData.whatsappLink.trim() === ''))) {
        return res.status(400).json({ error: 'Link WhatsApp richiesto' });
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

// Duplicate tour (admin only)
router.post('/:id/duplicate', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Get the original tour
    const originalTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!originalTour) {
      return res.status(404).json({ error: 'Tour non trovato' });
    }

    // Generate new title and slug
    const newTitle = `${originalTour.title} (Copia)`;
    const baseSlug = generateSlug(newTitle);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create duplicate tour
    const duplicatedTour = await prisma.tour.create({
      data: {
        title: newTitle,
        slug,
        description: originalTour.description,
        priceAdult: originalTour.priceAdult,
        priceChild: originalTour.priceChild,
        language: originalTour.language,
        itinerary: originalTour.itinerary,
        durationValue: originalTour.durationValue,
        durationUnit: originalTour.durationUnit,
        coverImage: originalTour.coverImage,
        images: originalTour.images,
        includes: originalTour.includes,
        excludes: originalTour.excludes,
        terms: originalTour.terms,
        maxSeats: originalTour.maxSeats,
        difficulty: originalTour.difficulty,
        isMultiDay: originalTour.isMultiDay,
        dateStart: originalTour.dateStart,
        dateEnd: originalTour.dateEnd,
        gallery: originalTour.gallery,
        whatsappLink: originalTour.whatsappLink,
        gpxTrack: originalTour.gpxTrack,
        latitude: originalTour.latitude,
        longitude: originalTour.longitude,
        createdBy: req.userId!,
      },
    });

    res.status(201).json({ tour: duplicatedTour });
  } catch (error: any) {
    console.error('Duplicate tour error:', error);
    res.status(500).json({ error: 'Errore nella duplicazione tour' });
  }
});

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

