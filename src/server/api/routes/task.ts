import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';


// eslint-disable-next-line import/prefer-default-export
export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.task.groupBy({by: 'id'});
      // return ctx.prisma.task.
    })
});

