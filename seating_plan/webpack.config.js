const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    catalog: './src/scripts/exportTemplate.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/yourdate-templates/seating_plan/',
  },
  mode: 'production',
  devServer: {
    static: path.resolve(__dirname, 'dist'),  // <- Важно: отдаем dist
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
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: './src/catalog.html',
      filename: 'catalog.html',
      chunks: ['catalog']
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/templates', to: 'templates' },
        { from: 'public/images', to: 'images' },
      ],
    }),
  ],

};
