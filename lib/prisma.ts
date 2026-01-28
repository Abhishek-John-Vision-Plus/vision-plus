import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const getExtendedPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "";
  
  // Neon pooler specific fix: append pgbouncer=true and connect_timeout if missing
  let finalUrl = connectionString;
  if (finalUrl.includes('neon.tech')) {
    if (!finalUrl.includes('pgbouncer=true')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }
    if (!finalUrl.includes('connect_timeout')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'connect_timeout=30';
    }
    if (finalUrl.includes('channel_binding=require')) {
      finalUrl = finalUrl.replace('channel_binding=require', 'channel_binding=disable');
    }
    if (finalUrl.includes('-pooler.')) {
      finalUrl = finalUrl.replace('-pooler.', '.');
      finalUrl = finalUrl.replace(/([?&])pgbouncer=true(&|$)/, '$1').replace(/[?&]$/, '');
    }
  }

  const pool = new Pool({
    connectionString: finalUrl,
    ssl: finalUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 30000, 
    max: 20, 
    idleTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    statement_timeout: 30000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma || getExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
