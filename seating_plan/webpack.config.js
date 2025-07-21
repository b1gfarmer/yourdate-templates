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
    publicPath: '/',
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
      chunks: ['main'], // чтобы main.bundle.js подключался в index.html
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/templates', to: 'templates' },
        { from: 'public/images', to: 'images' }, // если есть папка с картинками
      ],
    }),
  ],
};
