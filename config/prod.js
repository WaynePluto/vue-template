const BaseConfig = require('./base')

const { merge } = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const CopyPlugin = require('copy-webpack-plugin')

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
  devtool: 'nosources-source-map',
  externals: cdn.externals,
  module: {
    rules: [
      {
        test: /\.[t|j]s$/,
        exclude: /node_modules/,
        include: /src/,
        use: [
          'babel-loader',
          {
            loader: 'esbuild-loader',
            options: { loader: 'ts', implementation: esbuild },
          },
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerPort: 'auto' }),
    new HtmlWebpackPlugin({
      title: 'Vue3',
      template: './public/index.html',
      inject: 'body',
      cdn: cdn,
      base_url: './',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', globOptions: { ignore: ['**/index.html'] } }],
    }),
    new CompressionPlugin({
      test: /\.js$|\.html$|\.css/,
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
        filename: 'css/[name].css',
        chunkFilename: 'css/[name]-chunk.css',
      }),
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        terserOptions: {},
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 200 * 2048,
      maxSize: 500 * 2048,
      minChunks: 1,
      cacheGroups: {
        // lodash: {
        //   priority: 1,
        //   name: 'lodash',
        //   test: /[\\/]node_modules[\\/]lodash[\\/]/,
        //   reuseExistingChunk: true,
        // },
        // arco: {
        //   priority: 1,
        //   name: 'arco',
        //   test: /[\\/]node_modules[\\/]@arco-design[\\/]web-vue/,
        //   reuseExistingChunk: true,
        // },
        // vendor: {
        //   name: 'vendors',
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10,
        //   reuseExistingChunk: true,
        // },
      },
    },
  },
  output: {
    publicPath: './',
    filename: 'js/[name]-[chunkhash].js',
    clean: true,
  },
  stats: {
    preset: 'normal',
    assets: true,
    colors: true,
  },
})
