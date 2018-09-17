const Bee = require('../spiders/bee')
const bees = {}

const go = (socket, ctx, data) => {
  socket.broadcast('bee.log', '接收到采集指令：', data)
  if (data.id && data.dbTableName) {
    bees[data.id] = new Bee(data, socket)
    bees[data.id].go() // Bee
  } else {
    socket.broadcast('bee.log', '缺少配置，服务已停止！')
  }
}

const stop = (socket, ctx, data) => {
  socket.broadcast('bee.log', '接收到停止采集指令：', data)
  if (data.id && bees[data.id]) {
    bees[data.id].isWorking && bees[data.id].stop()
  } else {
    socket.broadcast('bee.log', '停止失败，缺少bee id！')
  }
}

module.exports = {
  go, stop
}
