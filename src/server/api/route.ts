import { taskRouter } from './routes/task';
import { exampleRouter } from './routes/example';
import { createTRPCRouter } from './trpc';


export const appRouter = createTRPCRouter({
  example: exampleRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
