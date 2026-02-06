const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create an Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@visionplus.in' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@visionplus.in',
      empId: 'ADMIN001',
      password: 'adminpassword', // Note: Plain text as per existing login logic
      process: 'elderLine',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create users from logs
  const user1 = await prisma.user.upsert({
    where: { empId: 'moh380' },
    update: {},
    create: {
      name: 'Mohamed 380',
      email: 'moh380@example.com',
      empId: 'moh380',
      password: 'password123',
      process: 'elderLine',
      role: 'USER',
    },
  });
  console.log('User 1 created:', user1.empId);

  const user2 = await prisma.user.upsert({
    where: { empId: 'moh375' },
    update: {},
    create: {
      name: 'Mohamed 375',
      email: 'moh375@example.com',
      empId: 'moh375',
      password: 'password123',
      process: 'elderLine',
      role: 'USER',
    },
  });
  console.log('User 2 created:', user2.empId);

  // Create some initial Topic Rules for elderLine
  const rules = [
    { category: 'Introduction', maxDisplay: 5, minAttempt: 3, order: 1 },
    { category: 'Module 1', maxDisplay: 10, minAttempt: 7, order: 2 },
    { category: 'Module 2', maxDisplay: 8, minAttempt: 5, order: 3 },
  ];

  for (const rule of rules) {
    await prisma.topicRule.upsert({
      where: {
        process_category: {
          process: 'elderLine',
          category: rule.category,
        },
      },
      update: rule,
      create: {
        process: 'elderLine',
        ...rule,
      },
    });
  }
  console.log('Topic rules created for elderLine');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
