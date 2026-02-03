
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const results = await prisma.assessmentResult.findMany();
    console.log('Total Assessment Results:', results.length);
    
    for (const r of results) {
      const user = await prisma.user.findUnique({ where: { id: r.userId } });
      console.log(`Result ID: ${r.id}, User ID: ${r.userId}, User Found: ${!!user}, Process: ${r.process}`);
    }
    
    const users = await prisma.user.findMany({ select: { id: true, name: true, role: true, process: true } });
    console.log('Total Users:', users.length);
    users.forEach(u => console.log(`User: ${u.name}, ID: ${u.id}, Role: ${u.role}, Process: ${u.process}`));
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
