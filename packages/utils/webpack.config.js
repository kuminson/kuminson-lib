const webpack = require("webpack");
const path = require('path')
// const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

console.log('process.env.env_report', process.env.env_report);


module.exports = {
  mode: 'production',
  entry: {
    utils: path.resolve(__dirname, 'lib/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'utils',
    libraryTarget: "umd"
  },
  devtool: 'source-map',
  module: {
    rules: [
      // 想了想不应该做babel，直接让使用者引入后和其自己的代码一起babel
      // {
      //   test: /\.m?js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: require.resolve('babel-loader')
      //   }
      // }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ // 配置的全局常量 (指定为生产环境，进而让一些library可以做一些优化)
      'process.env.env_report': JSON.stringify(process.env.env_report)
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: process.env.env_report === '1', // 是否生成stats.json文件
    }),
  ],
  // resolve: {
  //   plugins: [
  //     PnpWebpackPlugin,
  //   ],
  // },
  // resolveLoader: {
  //   plugins: [
  //     PnpWebpackPlugin.moduleLoader(module),
  //   ],
  // }
}