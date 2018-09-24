const Bee = require('../spiders/bee')
const bees = {}

const go = (socket, ctx, data) => {
  let {id, dbTableName} = data
  if (id && dbTableName) {
    let bee = bees[id]
    if (!bee) bee = bees[id] = new Bee(data, socket) // Bee
    bee.log(`接收到采集指令：${data}`)
    bee.go()
  } else {
    socket.broadcast('bee.log', '缺少配置，服务已停止！')
  }
}

const stop = (socket, ctx, data) => {
  let {id} = data
  if (id && bees[id]) {
    let bee = bees[id]
    bee.isWorking && bee.stop()
    bee.log(`接收到停止采集指令：${data}`)
  } else {
    socket.broadcast('bee.log', '停止失败，缺少bee id！')
  }
}

const goTask = (socket, ctx, data) => {
  let {id, taskValue} = data
  if (id && taskValue) {
    let bee = bees[id]
    if (!bee) bee = bees[id] = new Bee(data, socket) // Bee
    if (!bee.tasking || bee.time !== taskValue) {
      bee.log(`接收到定时采集指令：${data}`)
      bee.goTask()
    }
  } else {
    socket.broadcast('bee.log', '缺少配置，服务已停止！')
  }
}

module.exports = {
  go, stop, goTask
}
