import { exampleRouter } from './routes/example';
import { taskRouter } from './routes/task';
import { logByDateRouter } from './routes/logByDate';
import { createTRPCRouter } from './trpc';


export const appRouter = createTRPCRouter({
  example: exampleRouter,
  task: taskRouter,
  logByDate: logByDateRouter,
});

export type AppRouter = typeof appRouter;
