import path from 'path';
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals';
// import TerserPlugin from 'terser-webpack-plugin';
// import { merge } from 'webpack-merge';
// import baseConfig from './webpack.config.base';

// TODO: fix this file so it can build server via webpack config
// what is a sourcemap?

const configuration: webpack.Configuration = {
  mode: 'production',
  target: 'node',
  entry: {
    main: './src/server/api/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '../../release'),
    filename: 'app/dist/server/bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/
      }
    ]
  },
  externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false
  }
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       parallel: true,
  //     })
  //   ]
  // },
  // plugins: [
  //   new webpack.EnvironmentPlugin({
  //     NODE_ENV: 'production',
  //     // DEBUG_PROD: false
  //   })
  // ],
  // node: {}

};

export default configuration;


// const configuration: webpack.Configuration = {
//   mode: 'production',
//   target: 'electron-main',
//   entry: './src/main/server.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'index.js',
//   },
//   node: {
//     __dirname: false,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//         }
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['.js', '.jsx'],
//   },
//   optimization: {
//     minimizer: [new TerserPlugin()] // Minifies code
//   },
//   performance: {
//     hints: process.env.NODE_ENV === 'production' ? "warning" : false
//   }
// };


// export default merge(baseConfig, configuration);

