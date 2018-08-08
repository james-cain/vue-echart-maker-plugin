const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const NODE_ENV = process.env.NODE_ENV;

const npm_config_report = process.env.npm_config_report;

const resolve = dir => path.join(__dirname, dir);

const buildingForLocal = () => NODE_ENV === 'development';

const setPublicPath = () => {
  let env = NODE_ENV;
  if (env === 'production') {
    return 'https://coracain.top/vue-echart-maker-plugin/';
  }
  return '/';
}

const extractHTML = new HtmlWebpackPlugin({
  title: 'vue-echart-maker-plugin',
  filename: 'index.html',
  inject: true,
  template: resolve('index.ejs'),
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true,
  },
  environment: NODE_ENV,
  isLocalBuild: buildingForLocal(),
  imgPath: (!buildingForLocal()) ? 'assets' : 'src/assets'
});

const config = {
  entry: {
    build: resolve('/src/index.js')
  },
  output: {
    path: buildingForLocal() ? path.resolve(__dirname) : resolve('dist'),
    publicPath: setPublicPath(),
    library: 'echartMaker',
    libraryTarget: 'umd',
    filename: 'js/vue-echart-maker-plugin.min.js' 
  },
  resolveLoader: {
    modules: [resolve('node_modules')]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    }
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  plugins: [
    extractHTML,
    new MiniCssExtractPlugin({
      filename: 'css/vue-echart-maker-plugin.min.css',
      chunkFilename: '[id].css'
    }),
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: !buildingForLocal() ?
          [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader'
          ] :
          [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]?[hash:7]'
        }
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   query: {
      //     name: '[name].[ext]?[hash]',
      //     useRelativePath: !buildingForLocal()
      //   }
      // }
    ]
  }
};

// 生产环境要把vue给剔除
if (NODE_ENV !== 'development') {
  config.externals = {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    echarts: {
      root: 'window.echarts',
      commonjs: 'echarts',
      commonjs2: 'echarts',
      amd: 'echarts'
    },
  };
  config.plugins.push(
    new CleanWebpackPlugin(['dist'], {
      root: resolve('./')
    })
  );
}

if (npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;
