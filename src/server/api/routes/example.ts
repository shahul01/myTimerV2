import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

// eslint-disable-next-line import/prefer-default-export
export const exampleRouter = createTRPCRouter({
  greeting: publicProcedure
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish(),
    )
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? 'world'}`,
      };
    }),

  // http://localhost:9000/api/v1/example.idGetAll
  idGetAll: publicProcedure
    .query(async ({ ctx }) => {
      // NOTE: findMany for [], groupBy for {}
      return ctx.prisma.example.findMany();
      // return ctx.prisma.example.groupBy({by: 'id'});
    })
});

