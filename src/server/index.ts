
/*
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
// import db from './db';

const db = {
  users: {
    data: [ {a:1},{b:2},{c:3} ],
    findMany() {
      return this.data;
    },
    findById(id:string|any) {
      const found = this.data.find(el => Object.keys(el)[0] === id);
      // console.log("found", found);
      return found;
    }
  }
}


const appRouter = router({
  userList: publicProcedure
    .query(() => {
      const users = db.users.findMany();
      return users;
    }),
  userById: publicProcedure
    .input((val:unknown) => {
      return val;
    })
    .query(async (opts) => {
      const { input }  = opts;

      const user = db.users.findById(input)

      return user;
    })


});

const server = createHTTPServer({
  router: appRouter
});

server.listen(3000);

export type AppRouter = typeof appRouter;

*/

// NEW CODE.

//  * This is the API-handler of your app that contains all your API routes.
//  * On a bigger app, you will probably want to split this file up into multiple files.
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { z } from 'zod';

const t = initTRPC.create();

const publicProcedure = t.procedure;
const {router} = t;

const appRouter = router({
  greeting: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish(),
    )
    .query(({ input }) => {
      // This is what you're returning to your client
      return {
        text: `hello ${input?.name ?? 'world'}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log('running!');
    return {};
  },
}).listen(2023);

