const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
        exclude: /node_modules/,
        include: /src/,
        use: ['vue-loader'],
      },
      {
        test: /\.less$/i,
        use: [...baseCssLoader, 'less-loader'],
      },
      {
        test: /\.scss$/i,
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
      // 不扫描任何组件，只用来生成第三方库的组件声明
      dirs: [],
      dts: true,
    }),
  ],
}
