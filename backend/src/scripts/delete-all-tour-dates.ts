import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Eliminazione di tutte le tour dates...');
  
  const result = await prisma.tourDate.deleteMany({});
  
  console.log(`✅ Eliminate ${result.count} tour dates`);
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


