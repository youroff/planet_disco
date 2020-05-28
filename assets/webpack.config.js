const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, options) => ({
  resolve: {
    mainFiles: ['index'],
    extensions: [".js", ".jsx"]
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    // minimize: true,
    // minimizer: [new UglifyJsPlugin()]
    // minimizer: [
    //   new TerserPlugin({
    //     cache: true,
    //     parallel: true,
    //     sourceMap: true,
    //     terserOptions: {
    //       parse: { 
    //         // Let terser parse ecma 8 code but always output 
    //         // ES5 compliant code for older browsers 
    //         ecma: 8 
    //       }, 
    //       compress: { 
    //         ecma: 5, 
    //         warnings: false, 
    //         comparisons: false 
    //       },
    //       module: true,
    //       toplevel: true,
    //       keep_fnames: true,
    //       keep_classnames: true
    //     }
    //   }),
    //   new OptimizeCSSAssetsPlugin({})
    // ]
  },
  entry: {
    './js/app.js': glob.sync('./vendor/**/*.js').concat(['./js/app.js'])
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../priv/static/js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ["es2015"]
          // }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin({ filename: '../css/app.css' }),
    new CopyWebpackPlugin([{ from: 'static/', to: '../' }])//,
    // new BundleAnalyzerPlugin()
  ]
});
