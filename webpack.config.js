const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlwebpackplugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const data = [ 'login', 'index','register','tests','testResult','analysis','information','examinationbank']


function entryPage() {
  var entry = {};
  data.forEach((item, index) => {
    entry[item] = `./src/js/${item}.js`
  })
  return entry;
}

function htmlwebpackpluginPage() {
  return data.map((item) => {
    return new htmlwebpackplugin({
      template: `./src/${item}.html`,
      filename: `${item}.html`,
      chunks:[item],
    })
  })
}


module.exports = {
  //mode打包模式可选项有："production" | "development" | "none"
  mode: 'development',
  entry: { ...entryPage() },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [
                  require('autoprefixer'),
                  require('postcss-preset-env')
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        }
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:3][ext]'
        },
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlwebpackpluginPage(),
    new CopyPlugin({
      patterns: [{
        from: './src/images',
        to: 'images'//基础目录就是生成目录
      }]
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css'
    })
  ],
  devServer: {
    client: {
      reconnect: true,
    },
    hot: true,
    port: 4000,
    //服务器启动时，自动打开浏览器
    open: 'login.html',
    //开启服务端压缩
    compress: true,
    //使用 History 路由模式时，若404错误时被替代为 index.html
    historyApiFallback: true,
   
  }
};