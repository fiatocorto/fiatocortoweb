import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('🔐 Creazione Admin\n');

  try {
    // Get user input
    const firstName = await question('Nome: ');
    const lastName = await question('Cognome: ');
    const email = await question('Email: ');
    const password = await question('Password (minimo 6 caratteri): ');

    if (!firstName.trim() || !lastName.trim()) {
      console.error('❌ Nome e cognome sono obbligatori');
      process.exit(1);
    }

    if (!email.trim() || !email.includes('@')) {
      console.error('❌ Email non valida');
      process.exit(1);
    }

    if (!password || password.length < 6) {
      console.error('❌ Password deve essere di almeno 6 caratteri');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (existingUser) {
      console.error('❌ Email già registrata');
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name,
        email: email.trim(),
        passwordHash,
        role: 'ADMIN',
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

    console.log('\n✅ Admin creato con successo!');
    console.log('📋 Dettagli:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.firstName} ${admin.lastName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Ruolo: ${admin.role}`);
    console.log(`   Creato: ${admin.createdAt.toLocaleString('it-IT')}`);
    console.log('\n⚠️  Nota: Questo utente esiste solo nel database locale.');
    console.log('   Per autenticarsi, deve anche essere creato in Firebase Authentication.');
    console.log('   Puoi registrarti normalmente con questa email/password tramite il frontend.');
  } catch (error) {
    console.error('❌ Errore nella creazione admin:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();

