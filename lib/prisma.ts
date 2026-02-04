import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma_v3: PrismaClient };

export const db =
  // @ts-ignore
  globalForPrisma.prisma_v3 ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// @ts-ignore
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v3 = db;
