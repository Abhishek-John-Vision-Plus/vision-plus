import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  // @ts-ignore
  globalForPrisma.prisma_v2 ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// @ts-ignore
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v2 = db;
