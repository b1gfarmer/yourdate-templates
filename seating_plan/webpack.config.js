const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    main: './src/index.js',
    catalog: './src/scripts/exportTemplate.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: isProd ? '/yourdate-templates/seating_plan/' : '/',
  },
  mode: isProd ? 'production' : 'development',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['main'],
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/catalog.html',
      chunks: ['catalog'],
      filename: 'catalog.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/templates', to: 'templates' },
        { from: 'public/images', to: 'images' },
      ],
    }),
  ],
};
