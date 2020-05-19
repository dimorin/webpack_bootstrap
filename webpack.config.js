const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/* const apiMocker = require("connect-api-mocker"); */
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    main: "./src/js/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    overlay: true,
    stats: "errors-only",    
    proxy: {
      // /api URL 경로는 아래 proxy 서버를 이용한다.
      '/api/' : {
        target: 'https://kapi.kakao.com',
        pathRewrite: {'^/api' : ''},
        changeOrigin : true
      }
    },    
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/, //.css 확장자로 끝나는 모든 파일
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      /* {
          test:/\.(png|jpg|gif|svg)$/,   
          loader:'file-loader',
          options:{
              publicPath:'./dist/',
              name:'[name].[ext]?[hash]'
          }
      }, */
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          /* publicPath: "./dist/", */ //HtmlWebpackPlugin 에서 index.html이 src폴더 안으로 들어왔기 때문에 dist 경로 지워준다.
          name: "[name].[ext]?[hash]",
          limit: 20000, //20kb 2kb미만은 base64로 변환하고 이상은 파일로더가 실행
        },
      },
      {
        test: /\.js$/, //.js 확장자로 끝나는 모든 파일
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
                Build Date : ${new Date().toLocaleString()}
                Commit Version : ${childProcess.execSync(
                  "git rev-parse --short HEAD"
                )}
                Author : ${childProcess.execSync("git config user.name")}
            `,
    }),
    new webpack.DefinePlugin({
      TRANSLATE_KEY: JSON.stringify("66bf2fa17300ae3641da9b59e8d265ae"),
    }),
    new HtmlWebpackPlugin({
      // html 파일을 동적으로 만들어 낸다. js 파일과 css 파일을 동적으로 넣어준다.
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(), //build 할 때마다 dist 폴더를 지워준다.
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })] //자바스크립트 파일에서 css 파일을 분리해 낸다.
      : []),    
    new CopyPlugin({
      patterns: [
        { from: './node_modules/axios/dist/axios.min.js', to: './axios.min.js' },       
        { from: './node_modules/jquery/dist/jquery.min.js', to: './jquery.min.js' },    
        { from: './node_modules/bootstrap/dist/js/bootstrap.min.js', to: './bootstrap.min.js' },       
      ],
    }),
  ],
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그를 제거한다
                },
              },
            }),
          ]
        : [],    
  },
  externals:{ //build 대상에서 제외된다.
    axios:"axios",
    jquery:"jquery",
    bootstrap:"bootstrap"
  }
};
