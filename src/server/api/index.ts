//  * This is the API-handler of your app that contains all your API routes.
//  * On a bigger app, you will probably want to split this file up into multiple files.

// import cors from 'cors';
import { z } from 'zod';
import express from 'express';
// IMPORTANT:
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
// import { db } from './db';

// created for each request
const createContext = ({ req, res }:
  trpcExpress.CreateExpressContextOptions
) => ({
});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC
  .context<Context>()
  .create();

const publicProcedure = t.procedure;

const appRouter = t.router({
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
  // http://localhost:9000/trpc/idGetAll
  idGetAll: publicProcedure
    .query(() => {
      return [1,2,3];
      // return db.example.findMany();
    })
});

// export the type definition of the API & only that to client.
export type AppRouter = typeof appRouter;

// create server
// createHTTPServer({
//   middleware: cors(),
//   router: appRouter,
//   createContext() {
//     console.log('running!');
//     return {};
//   },
// }).listen(2023);



const app = express();

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
);


app.listen(9000);
