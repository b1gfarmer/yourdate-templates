const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/', // чтобы пути работали корректно
  },
  mode: 'development',
  devServer: {
    static: './public',
    open: true,
    port: 8080, // можешь поменять, если нужно
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // можно добавить другие loader'ы, если нужно
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/templates', to: 'templates' }, // копируем templates в dist/templates
      ],
    }),
  ],
};
