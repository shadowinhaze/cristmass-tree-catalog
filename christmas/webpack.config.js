/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ESLintPlugin({ extensions: ['ts', 'js'] }),
    ]
  }
  return config
};

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.ts',
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  stats: 'none',
  devServer: {
    port: 4200,
    hot: isDev,
    compress: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4200/",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    static: {
      directory: path.join(__dirname, 'src', 'index.html'),
      watch: true,
    }
  },
  optimization: optimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/data/cm-toys.json'),
          to: path.resolve(__dirname, 'dist/assets/data/cm-toys.json')
        },
        {
          from: path.resolve(__dirname, 'src/assets/img/toys'),
          to: path.resolve(__dirname, 'dist/assets/img/toys')
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.html', '.css', '.scss', '.png', '.jpg', '.svg', '.jpeg'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@svg': path.resolve(__dirname, 'src/assets/svg'),
      '@img': path.resolve(__dirname, 'src/assets/img'),
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: isDev } },
          { loader: 'sass-loader', options: { sourceMap: isDev } },
        ]
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'cashed/img/[hash][ext]'
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'cashed/svg/[hash][ext]'
        },
      },
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
};
