const Koa = require('koa')
const IO = require('koa-socket')
const io = new IO()
const app = new Koa()
const router = require('koa-router')()

// app.use(router.routes())
io.attach(app)
io.on('join', (ctx, data) => {
  console.log('接收到消息：', data)
  // io.send('欢迎！')
  console.log(ctx);

  // io.emit('getMsg', '你说了：' + data)
  io.broadcast('serverMessage', '你说了：' + data)
})

app.listen(9988)

console.log('server running 9988');