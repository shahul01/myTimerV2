import { PrismaClient } from "@prisma/client";


// Important: Fixing Prisma Errors
// run `npx prisma generate` // to use prisma
// run `npx prisma db push` // to create db w/ tables

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const tempEnv:'development'|'production' = 'development';

// eslint-disable-next-line import/prefer-default-export
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      tempEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });

// if (tempEnv !== "production") globalForPrisma.prisma = prisma;
