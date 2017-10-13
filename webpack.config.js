'use strict'

const HTMLPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('extract-text-webpack-plugin')

let plugins = [
  new ExtractPlugin('bundle-[hash].css'),
  new HTMLPlugin({template: `${__dirname}/src/index.html`}),
]

module.exports = {
  plugins,
  entry: `${__dirname}/src/main.js`,
  devServer: { 
    historyApiFallback: true,
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle-[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_module/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: ExtractPlugin.extract({
          use: [
            'css-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, 
                includePaths: [`${__dirname}/src/style`],
              }
            }
          ],
        }),
      },
      {
        test: /\.icon.svg$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(woff|woff2|ttf|eot).*/,
        exclude: /\.icon.svg/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'font/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|tiff|svg)$/,
        exclude: /\.icon.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 60000,
              name: 'image/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mp3|aac|aiff|wav|flac|m4a|ogg)$/,
        exclude: /\.glyph.svg/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'audio/[name].[ext]' },
          },
        ],
      },
    ],
  },
}
