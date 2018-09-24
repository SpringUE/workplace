const Koa = require('koa')
const convert = require('koa-convert')
const error = require('koa-error')
const config = require('./config')
const router = require('./router')
const logger = require('koa-logger')
// const http = require('http')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const KoaSocket = require('koa-socket')
const socketInit = require('./socket')

const app = new Koa()
const socket = new KoaSocket()

// 禁止缓存
if (config.env === 'development') {
  app.use(function (ctx, next) {
    ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate') // HTTP 1.1.
    ctx.set('Pragma', 'no-cache') // HTTP 1.0.
    ctx.set('Expires', '0') // Proxies.
    return next()
  })
}

// 输出错误日志 开发环境使用
if (config.env === 'development') {
  app.use(convert(logger()))
  app.use(convert(error()))
} else {
  app.on('error', function (err, ctx) {
    ctx.status = err.status || 500
    ctx.body = err.message
  })
}

app.use(bodyParser())

router(app)

/**
 * 把webpack build好的文件设置为koa的静态文件目录 实现生产环境下的前后端端口一致
 */
app.use(serve(path.join(__dirname, '../')))
console.log('assets serve dir' + path.join(__dirname, '../'))

// module.exports = function createServerApp () {
//   console.log(config)
//   return http.createServer(app.callback()).listen(config.port, function () {
//     console.info('listen on', config.port)
//   })
// }

// socket
socket.attach(app)
socketInit(socket)

// 运行服务，监听端口
app.listen(config.port)
console.info('Service started successfully! listen on', config.port)
// http.createServer(app.callback()).listen(config.port, function () {
//   console.info('listen on', config.port)
// })

module.exports = {
  app,
  socket
}
