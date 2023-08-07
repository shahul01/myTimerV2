import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

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
    .query(({ctx, input}) => {

      console.log(`input: `, input);
      const data = ctx.prisma.logByDate.findMany(
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


      return data;
    }),

  getAllLogs: publicProcedure
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.logByDate.findMany();
      return data;
    })

});


