//  * This is the API-handler of your app that contains all your API routes.
//  * On a bigger app, you will probably want to split this file up into multiple files.

// import cors from 'cors';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc';
import { appRouter } from './route';

// export the type definition of the API & only that to client.
export type AppRouter = typeof appRouter;

const app = express();

app.use(
  // '/api/v1/',
  '/trpc/',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
);


app.listen(9000);
