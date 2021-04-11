const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const cssModulesNameFormat = '[name]__[local]___[hash:base64:5]'

const clientConfig = {
  name: 'client',
  entry: './src/browser.tsx',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build/public'),
  },
  devtool: 'source-map',
  cache: true,
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: cssModulesNameFormat,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  'postcss-import': {},
                  'postcss-preset-env': {},
                  cssnano: {},
                },
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          reportFiles: ['src/**/*.{ts,tsx}'],
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[contenthash].[ext]',
        },
      },
    ],
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: path.resolve(__dirname, 'manifest.json'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
  ],
}

const serverConfig = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    nodeEnv: false,
  },
  devtool: 'source-map',
  cache: true,
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: {
            exportOnlyLocals: true,
            localIdentName: cssModulesNameFormat,
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          reportFiles: ['src/**/*.{ts,tsx}'],
        },
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[contenthash].[ext]',
          outputPath: 'public/images',
          publicPath: 'images/',
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [],
}

module.exports = [clientConfig, serverConfig]
