import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// eslint-disable-next-line import/prefer-default-export
export const taskRouter = createTRPCRouter({

  getAllTasks: publicProcedure
    .query(async ({ ctx }) => {
      // console.log(`task: `, ctx.prisma.task.findMany());
      // return [1,2,3];
      const allTasks = await ctx.prisma.task.findMany();
      return allTasks;
    }),

  // make this private
  UpdateCurrentTimer: publicProcedure
    .input(
      z.object({
        id: z.number(),
        currentTimer: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {

      console.log(`input mutation: `, input);
      const updatedTimer = await ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          currentTimer: input.currentTimer
        }
      })

      return updatedTimer;
    })

});
