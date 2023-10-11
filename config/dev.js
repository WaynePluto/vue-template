const BaseConfig = require('./base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin')
const chalk = require('chalk')
const path = require('path')
const { DefinePlugin } = require('webpack')
const esbuild = require('esbuild')
const { merge } = require('webpack-merge')
const cdn = require('./cdn-dev')
const proxy = require('./proxy')
const publicPath = '/h5_release/vue/'
const port = '8080'
const localUrl = `http://localhost:${port}${publicPath}`

const getIPAdress = require('./utils/get-ip')

const hostUrl = `http://${getIPAdress()}:${port}${publicPath}`

/**
 * @type {import('webpack').Configuration & {devServer:import('webpack-dev-server').Configuration}}
 */
module.exports = merge(BaseConfig, {
  mode: 'development',
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    buildDependencies: {
      config: [__filename],
    },
    store: 'pack',
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: publicPath,
    filename: 'js/[name].js',
    clean: true,
  },
  externals: cdn.externals,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'vue',
      template: path.join(__dirname, '../public/index.html'),
      inject: 'body',
      cdn,
      publicPath,
    }),
    new DefinePlugin({
      CC_DEV: false,
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `App running at:`,
          `- Local: \t${chalk.cyan(localUrl)}`,
          `- Host: \t${chalk.cyan(hostUrl)}\n`,
        ],
      },
      clearConsole: true,
    }),
  ],
  stats: {
    preset: 'errors-warnings',
    timings: true,
  },
  devServer: {
    hot: true,
    open: false,
    port,
    proxy,
    historyApiFallback: {
      rewrites: [{ from: /./, to: `${publicPath}index.html` }],
    },
    static: {
      watch: false,
      publicPath,
      directory: path.join(__dirname, '../public'),
    },
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        ignorePermissionErrors: true,
      },
    },
  },
})
