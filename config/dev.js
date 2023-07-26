const BaseConfig = require('./base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const cdn = require('./cdn-dev')
const esbuild = require('esbuild')
/**
 * @type {import('webpack').Configuration & {devServer:import('webpack-dev-server').DevServerConfiguration}}
 */
module.exports = merge(BaseConfig, {
  mode: 'development',
  // cache: {
  //   type: 'filesystem',
  //   allowCollectingMemory: true,
  //   buildDependencies: {
  //     config: [__filename],
  //   },
  // },
  devtool: 'inline-source-map',
  output: {
    publicPath: '/',
  },
  externals: cdn.externals,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vue3',
      template: './public/index.html',
      inject: 'body',
      cdn: cdn,
      base_url: '/',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', globOptions: { ignore: ['**/index.html'] } }],
    }),
  ],
  devServer: {
    hot: true,
    open: false,
    historyApiFallback: true,
  },
  stats: {
    preset: 'minimal',
    timings: true,
  },
})
