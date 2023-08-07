import { exampleRouter } from './routes/example';
import { createTRPCRouter } from './trpc';


export const appRouter = createTRPCRouter({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
