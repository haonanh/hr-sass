'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

let externals = {}
let cdn = {
  css: [],
  js: []
}
// 通过环境变量 来区分是否使用cdn
const isProd = process.env.NODE_ENV === 'production' // 开发环境不需要排除包和使用cdn  只有生产环境才需要
if (isProd) {
  // 如果是生产环境 就排除打包 否则不排除
  externals = {
    // externals首先会排除掉 定义的包名,空出来的位置  会用全局变量名来替换
    'vue': 'Vue', // 应该是 js中的全局对象名
    'element-ui': 'ELEMENT', // （value值）后面的名字不能随便起 应该是 js中的全局对象名
    'xlsx': 'XLSX' // 应该是 js中的全局对象名
  }
  cdn = {
    css: [
      // element-ui css
      'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css' // 样式表
    ],
    js: [
      // vue must at first!  先有vue，后有element-ui
      'https://unpkg.com/vue@2.6.10/dist/vue.js', // vuejs
      // element-ui js
      'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/index.js', // elementUI
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js',
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js'
    ]
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // 配置反向代理              正向代理就是代理客户端，反向代理就是代理服务器。正向代理客户需要配置，反向代理客户无感知
    proxy: {
      // 当我们本地的请求内含有/api时，就会触发代理机制
      '/api': {
        target: 'http://ihrm.itheima.net', // 要代理的目标服务器地址
        changeOrigin: true // 是否跨域
        // 路径重写，去除请求地址中的/api
        // pathRewrite:{
        //   '^/api':''
        // }
      }
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  // 配置webpack
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // externals排除
    // 要排除的包名
    // key(是要排除的包名): value(实际上是实际引入的包的全局的变量名 )
    // 因为要排除element-ui 所以后面要引入CDN文件 CDN文件中有ELEMENTUI的全局变量名
    externals: externals

  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 通过 `html-webpack-plugin`注入到 `index.html`之中
    // 将cdn注入
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      return args
    })

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
