// IMPORTANT:
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
// import { appRouter } from './route';

// created for each request
export const createContext = ({ req, res }:
    trpcExpress.CreateExpressContextOptions
  ) => (
    {}
);

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC
  .context<Context>()
  .create();

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
