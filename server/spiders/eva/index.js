const puppeteer = require('puppeteer')
const { timeout } = require('./tools/tools.js')
const config = require('../config.js')
// const key = require('./config.js').key
const company = require('./config.js').company
const koaSocket = require('koa-socket')
const socket = new koaSocket()

let workingBrowser = null
const eva = {}
const start = function (query, options) {
  let cogs = config.launch

  Object.assign(cogs, options.launch || {})
  console.log(`浏览器实例配置：${JSON.stringify(cogs)}`)
  
  puppeteer.launch(cogs).then(async (browser) => {
    let key = query.keyword
    let needPageMaxNum = query.pageCount

    console.log('startTime:', new Date().toLocaleString())
    console.log('打开浏览器实例')
    workingBrowser = browser
    try {
      /**
       * 搜索引擎
       */
      // await require('./data-source/so.js')(browser, timeout, key)
      // await require('./data-source/sogou.js')(browser, timeout, key)
      await require('./data-source/baidu.js')(options, browser, timeout, key, needPageMaxNum)
      // await require('./data-source/bing.js')(browser, timeout, key)

      /**
       * 段子
       */
      // await require('./duanzi/pengfu.js')(browser, timeout, company)
      // await require('./duanzi/qiubai-detail.js')(browser, timeout, company)
      // await require('./duanzi/gaoxiaogif-detail.js')(browser, timeout, company)
      // await require('./duanzi/budejie-detail.js')(browser, timeout, company)

      /**
       * 企业信息
       */
      // await require('./data-source/tianyancha.js')(browser, timeout, company)
    } catch (error) {
      console.log(error)
      console.log('endTime:', new Date().toLocaleString())
    }
    console.log('endTime:', new Date().toLocaleString())
  })
}

// 停止方法
const stop = async (browser) => {
  if (!browser) return
  await browser.close()
}

eva.start = start
eva.stop = () => stop(workingBrowser)
module.exports = eva
