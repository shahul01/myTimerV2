//  * This is the API-handler of your app that contains all your API routes.
//  * On a bigger app, you will probably want to split this file up into multiple files.

import cors from 'cors';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc';
import { appRouter } from './route';

// export the type definition of the API & only that to client.
export type AppRouter = typeof appRouter;


console.log('api/index.ts');

const app = express();
const port = 9000;

app.use(cors({
  // TODO: Remove hardcode
  origin: 'http://localhost:1212',
  // credentials: true
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(
  '/api/v1/',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext

  }),

);


// TODO: remove hard code
app.listen(port, () => {
  console.log('Server listenting on port', port);
});
