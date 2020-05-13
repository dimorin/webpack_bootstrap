const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports={
    mode:'development',
    entry:{
        main:'./src/app.js'
    },
    output:{
        path:path.resolve('./dist'),
        filename:'[name].js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,   //.js 확장자로 끝나는 모든 파일
                use:[path.resolve('./myloader.js')]
            },
            {
                test:/\.(scss|css)$/,   //.css 확장자로 끝나는 모든 파일
                use:[
                    process.env.NODE_ENV === 'production'
                    ? MiniCssExtractPlugin.loader
                    : "style-loader", // 개발 환경
          "css-loader",
          "sass-loader"
                ]
            },
            /* {
                test:/\.(png|jpg|gif|svg)$/,   //.png 확장자로 끝나는 모든 파일
                loader:'file-loader',
                options:{
                    publicPath:'./dist/',
                    name:'[name].[ext]?[hash]'
                }
            } */
            {
                test:/\.(png|jpg|gif|svg)$/,   //.png 확장자로 끝나는 모든 파일
                loader:'url-loader',
                options:{
                    /* publicPath:'./dist/', */
                    name:'[name].[ext]?[hash]',
                    limit:20000, //20kb 2kb미만은 base64로 변환하고 이상은 파일로더가 실행
                }
            },
            {
                test:/\.js$/,   //.js 확장자로 끝나는 모든 파일
                loader:'babel-loader',
                exclude:/node_modules/
            }
        ]
    },
    plugins:[
        new webpack.BannerPlugin({
            banner:`
                Build Date : ${new Date().toLocaleString()}
                
            `
        }),
        new webpack.DefinePlugin({
            TWO:'1+1',
            TWO_s:JSON.stringify('1+1'),
            'api.domain':JSON.stringify('http://dev.api.domain.com')
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            templateParameters:{
                env:process.env.NODE_ENV === 'development' ? '(개발용)' : ''
            },
            minify:process.env.NODE_ENV === 'production' ? {
                collapseWhitespace:true,
                removeComments:true,
            } : false
        }),
        new CleanWebpackPlugin(),
        ...(process.env.NODE_ENV === 'production'
            ? [new MiniCssExtractPlugin({filename:'[name].css'})]
            : []
        )
    ]
}