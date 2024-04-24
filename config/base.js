const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const esbuild = require('esbuild')

const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')

const UnVueCom = require('unplugin-vue-components/webpack')

const UnAudoImport = require('unplugin-auto-import/webpack')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = isProduction
  ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../',
      },
    }
  : 'style-loader'

const baseCssLoader = [stylesHandler, 'css-loader', 'postcss-loader']

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/main.ts',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue'],
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
        use: ['vue-loader'],
      },
      {
        test: /\.tsx$/,
        use: [
          'babel-loader',
          // {
          //   loader: 'ts-loader',
          //   options: { appendTsxSuffixTo: [/TSX\.vue$/] },
          // },
          {
            loader: 'esbuild-loader',
            options: {
              jsxFactory: 'h',
              jsxFragment: 'Vue.Fragment',
              implementation: esbuild,
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [...baseCssLoader, 'less-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [...baseCssLoader, 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [...baseCssLoader],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|mp3)$/i,
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
    }),
    UnVueCom({
      dts: true,
    }),
  ],
}
