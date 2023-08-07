import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
// import { db } from './db';

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

  // http://localhost:9000/trpc/example.idGetAll
  idGetAll: publicProcedure
    .query(() => {
      return [1,2,3];
      // return db.example.findMany();
    })
});

