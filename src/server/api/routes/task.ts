import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// eslint-disable-next-line import/prefer-default-export
export const taskRouter = createTRPCRouter({

  getAllTasks: publicProcedure
    .query(({ ctx }) => {
      // console.log(`task: `, ctx.prisma.task.findMany());
      // return [1,2,3];
      return ctx.prisma.task.findMany();
    })

});
