const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const UnVueCom = require('unplugin-vue-components/webpack')

const { ArcoResolver } = require('unplugin-vue-components/resolvers')

const UnAudoImport = require('unplugin-auto-import/webpack')

const esbuild = require('esbuild')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

const baseCssLoader = [stylesHandler, 'css-loader', 'postcss-loader']

/**
 * @type {import('webpack').Configuration & {devServer:import('webpack-dev-server').DevServerConfiguration}}
 */
module.exports = {
  entry: './src/main.ts',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.vue'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        include: /src/,
        use: ['vue-loader'],
      },
      {
        test: /\.[t|j]s$/,
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
        exclude: /node_modules/,
        include: /src/,
        use: [
          'thread-loader',
          'babel-loader',
          {
            loader: 'esbuild-loader',
            options: { jsxFactory: 'h' },
          },
        ],
      },
      {
        test: /\.less$/i,
        include: /src|@arco-design/,
        use: [...baseCssLoader, 'less-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        include: /src/,
        use: [
          ...baseCssLoader,
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "@/styles/global.scss";
            @import "@/styles/breakpoint.scss";`,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: /src|nprogress|@arco-design/,
        use: [...baseCssLoader],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        exclude: /node_modules/,
        include: /src/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    UnAudoImport({
      dts: true,
      imports: ['vue', 'vue-router'],
      resolvers: [
        ArcoResolver({
          resolveIcons: true,
        }),
      ],
    }),
    UnVueCom({
      dts: true,
      resolvers: [
        ArcoResolver({
          sideEffect: true,
          esm: true,
          resolveIcons: true,
        }),
      ],
    }),
  ],
}
