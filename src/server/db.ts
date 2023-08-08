import { Prisma, PrismaClient } from "@prisma/client";


// Important: Fixing Prisma Errors
// run `npx prisma generate` // to use prisma client // TODO: add this to postinsall
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

type ModelNames = Prisma.ModelName;

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<
      PrismaClient[Uncapitalize<M>]["findUnique"]
    >>,
    null
  >;
};

// if (tempEnv !== "production") globalForPrisma.prisma = prisma;
