import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const patients = await prisma.patient.findMany();
  console.log('Patients:', patients);
}

run();
