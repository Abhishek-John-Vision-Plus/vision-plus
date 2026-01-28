const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function promote() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email: bun promote-user.js your-email@example.com");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log(`Successfully promoted ${user.name} (${user.email}) to SUPER_ADMIN`);
  } catch (error) {
    console.error("Error promoting user:", error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

promote();
