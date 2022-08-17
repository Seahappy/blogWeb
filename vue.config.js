/*
 * @Author: Cxy
 * @Date: 2021-03-04 16:39:19
 * @LastEditors: Cxy
 * @LastEditTime: 2022-08-06 22:30:07
 * @FilePath: \blogGitee\blogWeb\vue.config.js
 */
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  outputDir: 'blogWeb',
  assetsDir: 'assets',
  indexPath: 'index.html',
  runtimeCompiler: true, // 关键点在这
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV === 'developmen', // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
    if (process.env.NODE_ENV === 'production') {
      config.plugin('CompressionPlugin')
        .use(new CompressionPlugin({
          algorithm: 'gzip', // 压缩算法/函数。
          test: /\.html$|\.css$|\.js$/, // 匹配所有对应的文件。
          filename: '[path].gz[query]',
          threshold: 1024, // 只处理比这个值大的资源。按字节计算
          minRatio: 1, // 压缩率比   压缩大小 / 原始大小
          deleteOriginalAssets: false
        }))
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...
      config.mode = 'production'
      config['performance'] = { // 这些选项可以控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
        'hints': 'warning',
        'maxEntrypointSize': 1048576,
        'maxAssetSize': 10485760
      }
    }
  },
  devServer: {
    // open: true,  // npm run serve后自动打开页面
    // host: '0.0.0.0', // 匹配本机IP地址(默认是0.0.0.0)
    // port: 1314, // 本地启动端口
    https: true, // 启用https
    // 设置代理
    proxy: {
      '/api': {
        target: 'https://127.0.0.1:1314', // 域名
        ws: false, // 是否启用websockets
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: { // 重写路径运行后就代理到对应的地址
          '^/api': ''
          // '^/api': '/api'   // 这种接口配置出来     http://XX.XX.XX.XX:8083/api/login
        }
      },
      '/SeaHappy-Blog': {
        target: 'https://127.0.0.1:520',
        changeOrigin: true,
        ws: true
      },
      '/music': {
        target: 'https://127.0.0.1:3000',
        ws: false, // 是否启用websockets
        changeOrigin: true,
        pathRewrite: {
          '^/music': ''
        }
      },
      '/headPortrait': {
        target: 'http://127.0.0.1:1314',
        ws: false, // 是否启用websockets
        changeOrigin: true
      },
      '/liveImage': {
        target: 'http://127.0.0.1:1314',
        ws: false, // 是否启用websockets
        changeOrigin: true
      },
      '/home': {
        target: 'http://127.0.0.1:1314',
        ws: false, // 是否启用websockets
        changeOrigin: true
      },
      '/seaLive': {
        target: 'http://127.0.0.1:8442',
        ws: false, // 是否启用websockets
        changeOrigin: true
      }
    }
  }
}

