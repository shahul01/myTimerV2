import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';

// https://chat.openai.com/c/275f539f-dfc5-45fa-a403-a5ddf79fcf2c
// https://www.bing.com/search?form=MY02AX&OCID=MY02AX&q=Bing+AI&showconv=1

// db.ts isnt buid to js file?
// "start-server": "./node_modules/.bin/tsc && node build/index.js"
// https://blog.logrocket.com/build-full-stack-typescript-app-trpc-react/

// D:\Shahul\test-codes\fullstack\t3\my-t3-dec-11\.next\server\app\api\trpc\[trpc]\route.js
// "D:\Shahul\SH\unsaved docs - notepad++\js build process by webpack w next prisma trpc t3.txt"

// what is a sourcemap?

// # this works
// cd src/server
// tsc --outDir ../../release/app/dist/server
// cd ../../release/app/dist/server/api
// node index.js

// # error
// prod.ts doesnt properly compile to js via `build:server`
// as the built file is missing db.js
// but direct `tsc` command properly compiles to js

// hack
// just run tsc command for npm build script



const configuration: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  entry: {
    main: './src/server/api/index.ts',
    additional: './src/server/**/*.ts'
  },
  output: {
    path: path.resolve(__dirname, '../../release/app/dist/server/'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // why use ts-loader
  // as renderer's dev & production config doesnt use it
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/
      }
    ]
  },
  // plugins: [],
  // node: {},
};

export default configuration;
