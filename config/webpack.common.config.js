const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');
const resolve = dir => path.join(__dirname, '..', dir);

module.exports = {
  entry: {
    app: resolve('./src/index.js'),
  },
  output: {
    filename: '[name].bundle.[contenthash:8].js',
    path: resolve('dist'),
    chunkFilename: '[name].chunk.[contenthash:8].js',
    // crossOriginLoading: 'use-credentials',
  },
  target: 'web',
  cache: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.(css|less)$/,
        exclude: [
          resolve('node_modules'),
          /global\.css$/
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { modules: { localIdentName: '[path][name]-[local]-[contenthash:8]' } }
          },
          'postcss-loader',
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(css|less)$/,
        exclude: [
          resolve('src'),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { modules: false }
          },
          'postcss-loader',
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /global\.css$/, // global.css should not be converted to css module
        include: [
          resolve('src'),
        ],
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { modules: false }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 8192, esModule: false }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'My project',
      filename: 'index.html',
      template: resolve('src/index.html'),
      inject: 'body',
      favicon: resolve('static/images/icon.ico'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
      ignoreOrder: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('src/'),
      'components': resolve('src/components/'),
      'pages': resolve('src/pages/'),
      'store': resolve('src/store/'),
      'static': resolve('static/'),
    }
  },
  optimization: {
    moduleIds: 'named',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        }
      }
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ]
  }
};
