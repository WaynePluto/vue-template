const webpack = require('webpack')

const esbuild = require('esbuild')

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

const cdn = require('./utils/cdn-prod')

const publicPath = '/'

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(BaseConfig, {
  mode: 'production',
  externals: cdn.externals,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        include: /src/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    'useBuiltIns': 'usage',
                    'corejs': '3',
                  },
                ],
              ],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
          {
            loader: 'esbuild-loader',
            options: { loader: 'ts', implementation: esbuild },
          },
        ],
      },
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // babel-loader 编译 ts 速度更快
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    'useBuiltIns': 'usage',
                    'corejs': '3',
                  },
                ],
              ],
              plugins: ['@vue/babel-plugin-jsx', '@babel/plugin-transform-runtime'],
            },
          },
          // ts-loader语法支持更全，但是速度慢
          // {
          //   loader: 'ts-loader',
          //   options: { appendTsxSuffixTo: [/TSX\.vue$/] },
          // },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    }),
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin({ analyzerPort: 'auto' }),
    new HtmlWebpackPlugin({
      title: 'vue-webpack',
      template: path.join(__dirname, '../public/index.html'),
      inject: 'body',
      cdn,
      publicPath,
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
        // esbuild minify兼容性有问题, swcMinify测试平台打包报错
        // minify: TerserPlugin.terserMinify(),
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
    publicPath,
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
