let {go, stop, goTask} = require('./bee')

let socketInit = (socket) => {
  // 开始采集
  socket.on('bee.go', (ctx, data) => {
    go(socket, ctx, data)
  })
  
  // 停止采集
  socket.on('bee.stop', (ctx, data) => {
    stop(socket, ctx, data)
  })

  // 定时采集
  socket.on('bee.goTask', (ctx, data) => {
    goTask(socket, ctx, data)
  })
}

module.exports = socketInit
