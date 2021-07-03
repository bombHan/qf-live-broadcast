const path = require("path")
const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "",
  // filenameHashing: false,
  assetsDir: 'static',
  outputDir: 'live_main',
  devServer: {
    host: "0.0.0.0",
    port: "8080", //代理端口
    open: false, //项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    disableHostCheck: true, //穿透 如果不配置，穿透不了
    proxy: {
      "^/fileupload": {
        target: "https://hyx9d.zjqfxx.net", 
        changeOrigin: true,
        ws: false,
      },
      '.*': {
          target: "https://hyx9d.zjqfxx.net", // 最新开发环境
        // target: "http://www2.test.com", // 测试服务器
        // target: "http://hyx9.test.com", // 最新测试环境
        // target: "http://192.168.1.174:2069", // 冬朋
        // target: "http://192.168.1.170:8070", //回头配置开发本地地址
        changeOrigin: true,
        ws: false,
      },
      
    }
  },
  chainWebpack: config => { // 配置路径
    config.resolve.alias
      .set("@img", resolve("src/assets/img"))
      .set("@", resolve("src"))
      .set("@views", resolve("src/views"))
      .set("@api", resolve("src/api"))
      .set("@static", resolve("static"))
      .set("@css", resolve("src/assets/css"))
      .set("@public", resolve("public"))
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugins.delete('prefetch')
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
  },
  // 配置less
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },

}