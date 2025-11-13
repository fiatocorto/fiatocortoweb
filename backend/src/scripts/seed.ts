import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.booking.deleteMany();
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

  // Create tours - 6 trekking siciliani
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tours = [
    {
      title: 'Monte Inici - Vetta Panoramica',
      slug: 'monte-inici-vetta-panoramica',
      description: 'Ascendi il Monte Inici e scopri uno dei panorami più spettacolari della Sicilia nord-occidentale. Escursione guidata tra sentieri panoramici, macchia mediterranea e viste mozzafiato sul Golfo di Castellammare. Un\'esperienza indimenticabile tra natura e storia.',
      priceAdult: 110.00,
      priceChild: 55.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 7:00 a Castellammare del Golfo. Partenza per il sentiero che porta alla vetta del Monte Inici (1064m). Soste panoramiche per fotografie e osservazione del paesaggio. Pranzo al sacco incluso in cima. Ritorno previsto per le 19:00.',
      durationValue: 12,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 giorni da oggi
      dateEnd: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
      maxSeats: 20,
      difficulty: 'Difficile',
      isMultiDay: false,
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
      title: 'Bosco di Ficuzza - Riserva Naturale',
      slug: 'bosco-di-ficuzza-riserva',
      description: 'Immergiti nella natura incontaminata del Bosco di Ficuzza, una delle riserve naturali più belle della Sicilia. Sentieri tra querce secolari, fauna selvatica e panorami mozzafiato ti aspettano in questa escursione indimenticabile.',
      priceAdult: 85.00,
      priceChild: 45.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 9:00 all\'ingresso della riserva. Escursione guidata lungo i sentieri del bosco con soste per osservazione della fauna e fotografie. Pranzo al sacco in area attrezzata. Ritorno previsto per le 16:00.',
      durationValue: 7,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 giorni da oggi
      dateEnd: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
      maxSeats: 25,
      difficulty: 'Intermedio',
      isMultiDay: false,
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
      title: 'Parco delle Madonie - Trekking Naturalistico',
      slug: 'parco-madonie-trekking',
      description: 'Scopri le rarità botaniche e faunistiche del Parco delle Madonie, uno dei gioielli naturalistici della Sicilia. Escursione guidata tra specie endemiche, faggete secolari e panorami montani mozzafiato che ti porteranno alla scoperta di un ecosistema unico.',
      priceAdult: 70.00,
      priceChild: 35.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 8:30 all\'ingresso del parco. Escursione guidata lungo i sentieri naturalistici con osservazione di flora e fauna rare. Soste per fotografie e spiegazioni naturalistiche. Pranzo al sacco in area attrezzata. Ritorno previsto per le 17:00.',
      durationValue: 8,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 giorni da oggi
      dateEnd: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      maxSeats: 18,
      difficulty: 'Intermedio',
      isMultiDay: false,
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
    {
      title: 'Etna - Crateri Sommitali',
      slug: 'etna-crateri-sommitali',
      description: 'Vivi l\'emozione di camminare sul vulcano attivo più alto d\'Europa. Escursione guidata ai crateri sommitali dell\'Etna con panorami mozzafiato sulla Sicilia orientale. Un\'esperienza unica tra lava, fumarole e paesaggi lunari.',
      priceAdult: 150.00,
      priceChild: 75.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 6:00 a Rifugio Sapienza (1900m). Ascesa in funivia fino a 2500m. Trekking guidato ai crateri sommitali (3300m) con spiegazioni vulcanologiche. Pranzo al sacco incluso. Ritorno previsto per le 18:00.',
      durationValue: 12,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 giorni da oggi
      dateEnd: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
      maxSeats: 15,
      difficulty: 'Difficile',
      isMultiDay: false,
      coverImage: '/resources/IMG_3672.JPEG',
      images: JSON.stringify([
        '/resources/IMG_3672.JPEG',
        '/resources/IMG_4294.JPEG',
      ]),
      includes: JSON.stringify([
        'Guida vulcanologica esperta',
        'Funivia (andata e ritorno)',
        'Pranzo al sacco',
        'Assicurazione',
        'Attrezzatura tecnica (casco, bastoni)',
      ]),
      excludes: JSON.stringify([
        'Bevande',
        'Abbigliamento tecnico',
      ]),
      terms: 'Percorso di alta difficoltà. Richiesta ottima forma fisica. Abbigliamento tecnico obbligatorio (giacca antivento, scarpe da trekking, guanti). Età minima 12 anni. L\'escursione può essere modificata in base alle condizioni meteo e vulcaniche.',
      createdBy: admin1.id,
    },
    {
      title: 'Riserva dello Zingaro - Sentiero Costiero',
      slug: 'riserva-zingaro-sentiero-costiero',
      description: 'Percorri il sentiero costiero della Riserva dello Zingaro, tra calette cristalline, torri di avvistamento e panorami sul mare turchese. Un trekking tra natura incontaminata e storia siciliana lungo uno dei tratti costieri più belli d\'Italia.',
      priceAdult: 65.00,
      priceChild: 35.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 8:00 all\'ingresso nord della riserva (Scopello). Trekking lungo il sentiero costiero con soste alle calette più belle per bagno e snorkeling. Visita al Museo Naturalistico. Pranzo al sacco incluso. Ritorno previsto per le 16:00.',
      durationValue: 8,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 giorni da oggi
      dateEnd: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      maxSeats: 22,
      difficulty: 'Intermedio',
      isMultiDay: false,
      coverImage: '/resources/IMG_4870.JPEG',
      images: JSON.stringify([
        '/resources/IMG_4870.JPEG',
        '/resources/IMG_4993.JPEG',
      ]),
      includes: JSON.stringify([
        'Guida naturalistica',
        'Ingresso alla riserva',
        'Pranzo al sacco',
        'Assicurazione',
      ]),
      excludes: JSON.stringify([
        'Bevande',
        'Attrezzatura snorkeling',
        'Costume da bagno',
      ]),
      terms: 'Percorso di facile-media difficoltà. Adatto a tutti. Consigliati scarpe da trekking, costume da bagno, asciugamano e crema solare. Portare acqua e attrezzatura snorkeling (opzionale).',
      createdBy: admin1.id,
    },
    {
      title: 'Gole dell\'Alcantara - Canyon Naturale',
      slug: 'gole-alcantara-canyon',
      description: 'Esplora le spettacolari Gole dell\'Alcantara, un canyon naturale scavato dalla lava e dall\'acqua. Trekking tra pareti di basalto colonnare, pozze cristalline e cascate. Un\'esperienza unica tra geologia e natura siciliana.',
      priceAdult: 55.00,
      priceChild: 30.00,
      language: 'Italiano',
      itinerary: 'Ritrovo alle 9:30 all\'ingresso delle Gole. Discesa guidata nel canyon con spiegazioni geologiche. Soste per fotografie e bagno nelle pozze naturali. Pranzo al sacco incluso. Ritorno previsto per le 15:30.',
      durationValue: 6,
      durationUnit: 'ore',
      dateStart: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 giorni da oggi
      dateEnd: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      maxSeats: 20,
      difficulty: 'Facile',
      isMultiDay: false,
      coverImage: '/resources/IMG_5010.JPEG',
      images: JSON.stringify([
        '/resources/IMG_5010.JPEG',
        '/resources/IMG_5065.JPEG',
      ]),
      includes: JSON.stringify([
        'Guida geologica',
        'Ingresso alle Gole',
        'Pranzo al sacco',
        'Assicurazione',
        'Stivali in gomma (per attraversamento acqua)',
      ]),
      excludes: JSON.stringify([
        'Bevande',
        'Costume da bagno',
        'Asciugamano',
      ]),
      terms: 'Percorso di facile difficoltà. Adatto a tutti, anche famiglie con bambini. Consigliati scarpe da trekking o stivali, costume da bagno, asciugamano e cambio abiti. L\'acqua può essere fredda anche d\'estate.',
      createdBy: admin1.id,
    },
  ];

  const createdTours = [];
  for (const tourData of tours) {
    const tour = await prisma.tour.create({ data: tourData });
    createdTours.push(tour);
  }

  console.log('✅ Created tours');

  // Create some bookings
  for (let i = 0; i < Math.min(createdTours.length, 4); i++) {
    const tour = createdTours[i];
    const customer = i % 2 === 0 ? customer1 : customer2;

    const adults = Math.floor(Math.random() * 3) + 1;
    const children = Math.random() > 0.5 ? 1 : 0;
    const totalPrice = adults * tour.priceAdult + children * tour.priceChild;

    await prisma.booking.create({
      data: {
        userId: customer.id,
        tourId: tour.id,
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

