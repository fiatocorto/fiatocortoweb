import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.tourDate.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // Create admin users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin Fiato Corto',
      email: 'admin@fiatocorto.it',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'Mario Rossi',
      email: 'mario.rossi@fiatocorto.it',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin users');

  // Create customer users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.create({
    data: {
      name: 'Giulia Bianchi',
      email: 'giulia.bianchi@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Luca Verdi',
      email: 'luca.verdi@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Sofia Neri',
      email: 'sofia.neri@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Created customer users');

  // Create tours
  const tours = [
    {
      title: 'Escursione al Monte Bianco',
      slug: 'escursione-monte-bianco',
      description: 'Un\'indimenticabile escursione ai piedi del Monte Bianco, con panorami mozzafiato e guida esperta. Percorso adatto a tutti, con soste fotografiche e pranzo incluso.',
      priceAdult: 89.00,
      priceChild: 45.00,
      language: 'Italiano',
      itinerary: 'Partenza da Courmayeur alle 8:00. Arrivo al rifugio e breve pausa. Escursione panoramica con guida. Pranzo al sacco incluso. Ritorno previsto per le 18:00.',
      durationValue: 10,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      ]),
      includes: JSON.stringify([
        'Guida esperta',
        'Pranzo al sacco',
        'Assicurazione',
        'Trasporto da punto di ritrovo',
      ]),
      excludes: JSON.stringify([
        'Bevande extra',
        'Equipaggiamento personale',
      ]),
      terms: 'Cancellazione gratuita fino a 48h prima. In caso di maltempo, l\'escursione può essere rimandata.',
      createdBy: admin1.id,
    },
    {
      title: 'Trekking nelle Cinque Terre',
      slug: 'trekking-cinque-terre',
      description: 'Percorri i sentieri panoramici che collegano i borghi delle Cinque Terre. Un\'esperienza unica tra mare e montagna, con soste nei caratteristici villaggi.',
      priceAdult: 75.00,
      priceChild: 38.00,
      language: 'Italiano',
      itinerary: 'Partenza da Riomaggiore alle 9:00. Percorso: Riomaggiore - Manarola - Corniglia - Vernazza - Monterosso. Pranzo libero. Ritorno alle 17:00.',
      durationValue: 8,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
      ]),
      includes: JSON.stringify([
        'Guida locale',
        'Biglietto treno tra i borghi',
        'Mappa del percorso',
      ]),
      excludes: JSON.stringify([
        'Pranzo',
        'Bevande',
      ]),
      terms: 'Percorso di media difficoltà. Consigliate scarpe da trekking.',
      createdBy: admin1.id,
    },
    {
      title: 'Tour in Bici del Lago di Como',
      slug: 'tour-bici-lago-como',
      description: 'Pedala lungo le rive del Lago di Como, tra ville storiche e panorami da sogno. Bici elettrica inclusa, adatto a tutti i livelli.',
      priceAdult: 65.00,
      priceChild: 35.00,
      language: 'Italiano',
      itinerary: 'Ritrovo a Como alle 9:00. Percorso lungo la ciclabile del lago con soste a Villa Olmo, Tremezzo, e Bellagio. Pranzo libero. Ritorno alle 16:00.',
      durationValue: 7,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ]),
      includes: JSON.stringify([
        'Bici elettrica',
        'Casco',
        'Guida',
        'Assicurazione',
      ]),
      excludes: JSON.stringify([
        'Pranzo',
        'Bevande',
      ]),
      terms: 'Età minima 12 anni. Esperienza di ciclismo consigliata.',
      createdBy: admin1.id,
    },
    {
      title: 'Escursione Noturna alle Stelle',
      slug: 'escursione-noturna-stelle',
      description: 'Un\'esperienza magica sotto le stelle. Escursione notturna con guida astronomica, osservazione del cielo e cena al sacco.',
      priceAdult: 55.00,
      priceChild: 28.00,
      language: 'Italiano',
      itinerary: 'Ritrovo al tramonto. Escursione fino al punto panoramico. Osservazione del cielo con telescopio. Cena al sacco. Ritorno a mezzanotte.',
      durationValue: 5,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
      ]),
      includes: JSON.stringify([
        'Guida astronomica',
        'Telescopio',
        'Cena al sacco',
        'Coperta',
      ]),
      excludes: JSON.stringify([
        'Bevande',
      ]),
      terms: 'Portare abbigliamento caldo. In caso di cielo nuvoloso, l\'escursione può essere rimandata.',
      createdBy: admin1.id,
    },
    {
      title: 'Rafting sul Fiume Adige',
      slug: 'rafting-fiume-adige',
      description: 'Avventura adrenalinica sul fiume Adige. Adatto a principianti e esperti, con istruttori qualificati e attrezzatura completa.',
      priceAdult: 95.00,
      priceChild: 50.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 10:00. Briefing e distribuzione attrezzatura. Discesa del fiume (circa 2 ore). Pranzo incluso. Ritorno alle 15:00.',
      durationValue: 5,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      ]),
      includes: JSON.stringify([
        'Attrezzatura completa',
        'Istruttore qualificato',
        'Pranzo',
        'Assicurazione',
      ]),
      excludes: JSON.stringify([
        'Bevande extra',
        'Cambio abiti',
      ]),
      terms: 'Età minima 8 anni. Saper nuotare obbligatorio. Portare costume e asciugamano.',
      createdBy: admin1.id,
    },
    {
      title: 'Trekking nel Parco Nazionale del Gran Paradiso',
      slug: 'trekking-gran-paradiso',
      description: 'Esplora il primo parco nazionale italiano, tra valli alpine, laghi cristallini e fauna selvatica. Guida naturalistica esperta.',
      priceAdult: 110.00,
      priceChild: 55.00,
      language: 'Italiano',
      itinerary: 'Partenza alle 7:00. Arrivo al parco e inizio trekking. Avvistamento fauna, soste fotografiche. Pranzo al sacco incluso. Ritorno alle 19:00.',
      durationValue: 12,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ]),
      includes: JSON.stringify([
        'Guida naturalistica',
        'Pranzo al sacco',
        'Trasporto',
        'Ingresso parco',
      ]),
      excludes: JSON.stringify([
        'Bevande',
        'Equipaggiamento personale',
      ]),
      terms: 'Percorso di media-alta difficoltà. Consigliata buona forma fisica.',
      createdBy: admin1.id,
    },
    {
      title: 'Kayak nel Golfo di Orosei',
      slug: 'kayak-golfo-orosei',
      description: 'Esplora le calette segrete del Golfo di Orosei in kayak. Acque cristalline, grotte marine e spiagge incontaminate.',
      priceAdult: 85.00,
      priceChild: 45.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 9:00. Briefing e distribuzione kayak. Escursione lungo la costa con soste per bagno. Pranzo libero. Ritorno alle 16:00.',
      durationValue: 7,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      ]),
      includes: JSON.stringify([
        'Kayak e pagaia',
        'Giubbotto salvagente',
        'Guida',
        'Assicurazione',
      ]),
      excludes: JSON.stringify([
        'Pranzo',
        'Bevande',
      ]),
      terms: 'Saper nuotare obbligatorio. Portare costume, crema solare e cappello.',
      createdBy: admin1.id,
    },
    {
      title: 'Escursione in E-Bike sui Colli Euganei',
      slug: 'ebike-colli-euganei',
      description: 'Pedala tra i vigneti e le terme dei Colli Euganei. Bici elettrica inclusa, percorso adatto a tutti con soste enogastronomiche.',
      priceAdult: 70.00,
      priceChild: 35.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 9:30. Percorso tra i colli con soste a cantine e punti panoramici. Degustazione vini (opzionale). Ritorno alle 17:00.',
      durationValue: 7,
      durationUnit: 'ore',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ]),
      includes: JSON.stringify([
        'E-bike',
        'Casco',
        'Guida',
        'Mappa',
      ]),
      excludes: JSON.stringify([
        'Pranzo',
        'Degustazione vini',
      ]),
      terms: 'Età minima 14 anni. Degustazione vini disponibile per maggiorenni.',
      createdBy: admin1.id,
    },
  ];

  const createdTours = [];
  for (const tourData of tours) {
    const tour = await prisma.tour.create({ data: tourData });
    createdTours.push(tour);
  }

  console.log('✅ Created tours');

  // Create tour dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const tour of createdTours) {
    // Create dates for next 3 months
    for (let i = 0; i < 8; i++) {
      const dateStart = new Date(today);
      dateStart.setDate(today.getDate() + 7 + i * 7); // Starting next week, then weekly
      dateStart.setHours(9, 0, 0, 0);

      const dateEnd = new Date(dateStart);
      dateEnd.setHours(dateStart.getHours() + tour.durationValue);

      await prisma.tourDate.create({
        data: {
          tourId: tour.id,
          dateStart,
          dateEnd,
          capacityMin: 2,
          capacityMax: 20,
          timezone: 'Europe/Rome',
          status: 'ACTIVE',
        },
      });
    }
  }

  console.log('✅ Created tour dates');

  // Create some bookings
  const tourDates = await prisma.tourDate.findMany({
    take: 5,
    include: { tour: true },
  });

  for (let i = 0; i < tourDates.length; i++) {
    const tourDate = tourDates[i];
    const customer = i % 2 === 0 ? customer1 : customer2;

    const adults = Math.floor(Math.random() * 3) + 1;
    const children = Math.random() > 0.5 ? 1 : 0;
    const totalPrice = adults * tourDate.tour.priceAdult + children * tourDate.tour.priceChild;

    await prisma.booking.create({
      data: {
        userId: customer.id,
        tourDateId: tourDate.id,
        adults,
        children,
        totalPrice,
        paymentMethod: i % 2 === 0 ? 'ONSITE' : 'CARD_STUB',
        paymentStatus: i < 2 ? 'PAID' : 'PENDING',
        qrCode: `qr-${Date.now()}-${i}`,
        notes: i === 0 ? 'Cliente vegetariano' : null,
      },
    });
  }

  console.log('✅ Created bookings');

  // Create some notifications
  await prisma.notification.create({
    data: {
      type: 'NEW_BOOKING',
      payload: JSON.stringify({
        bookingId: 'example',
        tourTitle: 'Escursione al Monte Bianco',
        message: 'Nuova prenotazione ricevuta',
      }),
      seen: false,
    },
  });

  console.log('✅ Created notifications');

  console.log('\n📋 Credenziali di accesso:');
  console.log('\n👤 Admin:');
  console.log('   Email: admin@fiatocorto.it');
  console.log('   Password: admin123');
  console.log('\n👤 Admin 2:');
  console.log('   Email: mario.rossi@fiatocorto.it');
  console.log('   Password: admin123');
  console.log('\n👤 Cliente 1:');
  console.log('   Email: giulia.bianchi@example.com');
  console.log('   Password: customer123');
  console.log('\n👤 Cliente 2:');
  console.log('   Email: luca.verdi@example.com');
  console.log('   Password: customer123');
  console.log('\n✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

