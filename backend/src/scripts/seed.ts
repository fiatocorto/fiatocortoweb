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
      title: 'Monte Inici',
      slug: 'monte-inici',
      description: 'Ascendi il Monte Inici e scopri uno dei panorami più spettacolari della Sicilia nord-occidentale. Escursione guidata tra sentieri panoramici, macchia mediterranea e viste mozzafiato sul Golfo di Castellammare. Un\'esperienza indimenticabile tra natura e storia.',
      priceAdult: 110.00,
      priceChild: 55.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 7:00 a Castellammare del Golfo. Partenza per il sentiero che porta alla vetta del Monte Inici. Soste panoramiche per fotografie e osservazione del paesaggio. Pranzo al sacco incluso in cima. Ritorno previsto per le 19:00.',
      durationValue: 12,
      durationUnit: 'ore',
      coverImage: '/resources/inici.jpg',
      images: JSON.stringify([
        '/resources/inici.jpg',
      ]),
      includes: JSON.stringify([
        'Guida esperta',
        'Pranzo al sacco',
        'Trasporto da punto di ritrovo',
        'Assicurazione',
      ]),
      excludes: JSON.stringify([
        'Bevande',
        'Equipaggiamento personale',
      ]),
      terms: 'Percorso di media-alta difficoltà. Consigliata buona forma fisica. Scarpe da trekking obbligatorie. Portare acqua, crema solare e cappello.',
      createdBy: admin1.id,
    },
    {
      title: 'Bosco di Ficuzza',
      slug: 'bosco-di-ficuzza',
      description: 'Immergiti nella natura incontaminata del Bosco di Ficuzza, una delle riserve naturali più belle della Sicilia. Sentieri tra querce secolari, fauna selvatica e panorami mozzafiato ti aspettano in questa escursione indimenticabile.',
      priceAdult: 85.00,
      priceChild: 45.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 9:00 all\'ingresso della riserva. Escursione guidata lungo i sentieri del bosco con soste per osservazione della fauna e fotografie. Pranzo al sacco in area attrezzata. Ritorno previsto per le 16:00.',
      durationValue: 7,
      durationUnit: 'ore',
      coverImage: '/resources/ficuzza.jpg',
      images: JSON.stringify([
        '/resources/ficuzza.jpg',
      ]),
      includes: JSON.stringify([
        'Guida esperta',
        'Assicurazione',
        'Materiale informativo sulla riserva',
      ]),
      excludes: JSON.stringify([
        'Pranzo al sacco',
        'Bevande',
        'Equipaggiamento personale',
      ]),
      terms: 'Percorso di media difficoltà. Consigliati scarpe da trekking, abbigliamento comodo e adatto alla stagione. Portare acqua e pranzo al sacco.',
      createdBy: admin1.id,
    },
    {
      title: 'Madonie Rare',
      slug: 'madonie-rare',
      description: 'Scopri le rarità botaniche e faunistiche del Parco delle Madonie, uno dei gioielli naturalistici della Sicilia. Escursione guidata tra specie endemiche, faggete secolari e panorami montani mozzafiato che ti porteranno alla scoperta di un ecosistema unico.',
      priceAdult: 70.00,
      priceChild: 35.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 8:30 all\'ingresso del parco. Escursione guidata lungo i sentieri naturalistici con osservazione di flora e fauna rare. Soste per fotografie e spiegazioni naturalistiche. Pranzo al sacco in area attrezzata. Ritorno previsto per le 17:00.',
      durationValue: 8,
      durationUnit: 'ore',
      coverImage: '/resources/madonie.jpg',
      images: JSON.stringify([
        '/resources/madonie.jpg',
      ]),
      includes: JSON.stringify([
        'Guida naturalistica esperta',
        'Assicurazione',
        'Materiale informativo sul parco',
      ]),
      excludes: JSON.stringify([
        'Pranzo al sacco',
        'Bevande',
        'Equipaggiamento personale',
      ]),
      terms: 'Percorso di media difficoltà. Consigliati scarpe da trekking, abbigliamento a strati e adatto alla montagna. Portare acqua, pranzo al sacco e binocolo (opzionale).',
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

