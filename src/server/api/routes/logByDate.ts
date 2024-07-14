import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaModels } from '../../db';


type TLogByDate = PrismaModels['LogByDate'];

// eslint-disable-next-line import/prefer-default-export
export const logByDateRouter = createTRPCRouter({

  getByDate: publicProcedure
    .input(
      z.object({
        // TODO: change these to date type?
        startDate: z.string(),
        endDate: z.string()
      })
    )
    .query(async ({ctx, input}) => {

      console.log(`input: `, input);
      const resGetByDate = await ctx.prisma.logByDate.findMany(
        {
          where: {
            date: {
              gte: new Date('2010-03-19T14:21:00+0200'),
              // lte: new Date('2070-06-20T14:21:00+0200'),
              lte: input.endDate
            }
            // date: { gte: new Date('2050-01-30') }
          }
        }
      );

      // const logData = ctx.prisma.logByDate.fields.date.typeName;
      // console.log(`logData: `, logData);

      return resGetByDate;
    }),

  getAllLogs: publicProcedure
    .query(async ({ ctx }) => {
      const resGetAllLogs = await ctx.prisma.logByDate.findMany();

      return resGetAllLogs;
    }),

  // TODO: use upsert(?)
  postLog: publicProcedure
    .input(z.object(
      {
        id: z.string(),
        date: z.string(),
        taskName: z.string(),
        timeSpent: z.string()
      }
    ))
    .mutation(async ({ ctx, input }) => {
      const resPostLog = await ctx.prisma.logByDate.create({
        data: {
          id: input.id,
          date: input.date,
          taskName: input.taskName,
          timeSpent: input.timeSpent
        }
      });

      return resPostLog;
    }),

  patchLog: publicProcedure
    .input(z.object({
      id: z.string(),
      date: z.string(),
      taskName: z.string(),
      timeSpent: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const resPatchLog = await ctx.prisma.logByDate.updateMany({
        where: {
          id: input.id,
        },
        data: {
          date: input.date,
          taskName: input.taskName,
          timeSpent: input.timeSpent
        }

      });

      return resPatchLog;
    }),

  deleteLog: publicProcedure
    .input(z.object({
      ids: z.string().array()
    }))
    .mutation(async ({ctx, input}) => {
      const deleteLog = await ctx.prisma.logByDate.deleteMany({
        where: {
          id: { in: input.ids }
        }
      })

      return deleteLog
    })

});


