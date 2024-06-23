import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// eslint-disable-next-line import/prefer-default-export
export const taskRouter = createTRPCRouter({

  // TODO: make all public procedure private
  getAllTasks: publicProcedure
    .query(async ({ ctx }) => {
      // console.log(`task: `, ctx.prisma.task.findMany());
      // return [1,2,3];
      const allTasks = await ctx.prisma.task.findMany();
      return allTasks;
    }),

  addTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        timerInput: z.string(),
        currentTimer: z.string()
      })
    )
    .mutation(async ({ctx, input}) => {
      const task = await ctx.prisma.task.create({
        data: {
          id: input.id,
          title: input.title,
          timerInput: input.timerInput,
          currentTimer: input.currentTimer,
        }
      })

      return task;
    }),

  editTaskTitle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const editTaskTitle = await ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          title: input.title
        }
      })

      return editTaskTitle;
    }),

  editTaskTime: publicProcedure
    .input(
      z.object({
        id: z.string(),
        timerInput: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const editTaskTime = await ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          timerInput: input.timerInput
        }
      })
      return editTaskTime;
    }),

  updateCurrentTimer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        currentTimer: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log(`input mutation: `, input);
      const updatedTimer = await ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          currentTimer: input.currentTimer
        }
      })

      return updatedTimer;
    }),

  deleteTask: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ctx, input}) => {
      const deleteTask = await ctx.prisma.task.delete({
        where: {
          id: input.id
        }
      })
      return deleteTask
    })
    // https://stackoverflow.com/a/75614613/15187131
    // .query(async ({ ctx, input }) => {
    //   return await ctx.prisma.task.get({
    //     where: {
    //       id: input.id
    //     }
    //   })
    // })
});
