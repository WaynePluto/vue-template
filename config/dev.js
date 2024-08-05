const webpack = require('webpack')
const BaseConfig = require('./base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin')
const esbuild = require('esbuild')
const chalk = require('chalk')
const path = require('path')
const portfinder = require('portfinder')
const { merge } = require('webpack-merge')
const cdn = require('./utils/cdn-dev')
const proxy = require('./utils/proxy')
const publicPath = '/'

/**
 * @type {import('webpack').Configuration & {devServer:import('webpack-dev-server').Configuration}}
 */
module.exports = async function () {
  const port = await portfinder.getPortPromise({ port: '8080' })
  const localUrl = `http://localhost:${port}${publicPath}`
  const getIPAdress = require('./utils/get-ip')
  const hostUrl = `http://${getIPAdress()}:${port}${publicPath}`

  return merge(BaseConfig, {
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
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          include: /src/,
          use: [
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
                presets: ['@babel/preset-typescript'],
                plugins: ['@vue/babel-plugin-jsx'],
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
    output: {
      publicPath: publicPath,
      filename: 'js/[name].js',
      clean: true,
    },
    externals: cdn.externals,
    plugins: [
      new HtmlWebpackPlugin({
        title: 'vue-webpack',
        template: path.join(__dirname, '../public/index.html'),
        inject: 'body',
        cdn,
        publicPath,
      }),
      new webpack.DefinePlugin({
        CC_DEV: false,
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`App running at:`, `- Local: \t${chalk.cyan(localUrl)}`, `- Host: \t${chalk.cyan(hostUrl)}\n`],
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
        options: {
          ignorePermissionErrors: true,
          ignored: path.join(__dirname, '../public'),
        },
      },
    },
  })
}
