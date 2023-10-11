const BaseConfig = require('./base')

const { merge } = require('webpack-merge')

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const CopyPlugin = require('copy-webpack-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const CompressionPlugin = require('compression-webpack-plugin')

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const TerserPlugin = require('terser-webpack-plugin')

const cdn = require('./cdn-prod')

const esbuild = require('esbuild')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(BaseConfig, {
  mode: 'production',
  externals: cdn.externals,
  module: {
    rules: [
      {
        test: /\.[t|j]s$/,
        include: /src/,
        use: [
          'babel-loader',
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              implementation: esbuild,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin({ analyzerPort: 'auto' }),
    new HtmlWebpackPlugin({
      title: 'vue',
      template: path.join(__dirname, '../public/index.html'),
      inject: 'body',
      cdn,
      publicPath: './',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', globOptions: { ignore: ['**/index.html'] } }],
    }),
    new CompressionPlugin({
      test: /\.js$|\.css/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
  optimization: {
    mergeDuplicateChunks: true,
    minimize: true,
    minimizer: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
      }),
      new TerserPlugin({
        terserOptions: {
          format: { comments: false },
        },
        extractComments: false,
        exclude: ['static'],
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 200 * 2048,
      maxSize: 500 * 2048,
      minChunks: 1,
    },
  },
  output: {
    publicPath: './',
    filename: 'js/[name]-[chunkhash].js',
    clean: true,
    path: path.resolve(__dirname, '../dist'),
  },
  stats: {
    preset: 'summary',
    assets: true,
    colors: true,
  },
})
