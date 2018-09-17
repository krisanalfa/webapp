const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const bundleOutputDir = './wwwroot/dist'

const baseStyleLoader = (isDevBuild) => [
  {
    loader: isDevBuild ? 'vue-style-loader' : MiniCssExtractPlugin.loader
  },
  {
    loader: 'css-loader'
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: [
        require('postcss-preset-env')(),
        require('autoprefixer')()
      ].concat(isDevBuild ? [
        // Plugins that apply in development builds only
      ] : [
        // Plugins that apply in production builds only
      ])
    }
  }
]

module.exports = (isDevBuild) => ({
  mode: isDevBuild ? 'development' : 'production',
  devtool: isDevBuild ? 'eval' : false,
  stats: {
    modules: isDevBuild
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './ClientApp')
    }
  },
  output: {
    path: path.join(__dirname, bundleOutputDir),
    filename: isDevBuild ? '[name].js' : '[name]-[contenthash:10].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'vue-loader',
        options: {
          // enable CSS extraction
          extractCSS: !isDevBuild
        }
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: false,
            presets: [
              [ 'vue-app' ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: baseStyleLoader(isDevBuild)
      },
      {
        test: /\.scss$/,
        use: baseStyleLoader(isDevBuild).concat(['sass-loader'])
      },
      {
        test: /\.(png|jpg|jpeg|woff|woff2|eot|ttf|svg|webp)$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: false
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['wwwroot/dist'], {
      root: __dirname,
      exclude: ['.gitignore'],
      verbose: false,
      dry: process.env.DOTNET_RUNNING_IN_CONTAINER === 'true'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isDevBuild ? 'development' : 'production')
    }),
    new VueLoaderPlugin()
  ].concat(isDevBuild ? [
    // Plugins that apply in development builds only
    new webpack.NamedModulesPlugin()
  ] : [
    // Plugins that apply in production builds only
    new MiniCssExtractPlugin({
      filename: isDevBuild ? '[name].css' : '[name]-[contenthash:10].css'
    }),
    new ManifestPlugin()
  ])
})
