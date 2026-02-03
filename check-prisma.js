
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Checking Prisma Client...');
    // Try to access the new model
    if (prisma.assignedQuestion) {
      console.log('AssignedQuestion model exists on client.');
      const count = await prisma.assignedQuestion.count();
      console.log('Count:', count);
    } else {
      console.log('AssignedQuestion model DOES NOT exist on client.');
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
