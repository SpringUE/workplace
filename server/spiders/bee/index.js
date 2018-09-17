const bee = require('../../router/bee')
const config = require('../config.js')
const puppeteer = require('puppeteer')
const {
  timeout
} = require('../eva/tools/tools.js')

// 蜜蜂原型
class Bee {
  constructor (query, socket) {
    this.query = query
    this.socket = socket
    this.browser = null
    this.table = {
      name: null,
      columns: [],
      data: []
    }
    this.isWorking = false
  }

  // 开始方法
  async go () {
    let vaild = await this.filter()
    let headless = this.query.headless
    let baseCogs = config.launch

    if (!vaild) {
      this.log('读取配置出错，已停止运行！')
      return false
    }
    baseCogs.headless = (headless === true || headless === 'true' || headless === 1) ? true : false
    this.log(`浏览器实例配置：${JSON.stringify(baseCogs)}`)

    this.isWorking = true
    
    puppeteer.launch(baseCogs).then(async (browser) => {
      this.browser = browser

      this.log(`------------startTime: ${new Date().toLocaleString()}------------`)
      this.log('打开浏览器')

      try {
        await this.gather()
        await this.update()
      } catch (error) {
        this.log(`已关闭浏览器，页面操作出错：${error}`)
      }

      await this.stop()
      this.log(`------------endTime: ${new Date().toLocaleString()}------------`)
    })
  }

  // 检测并过滤配置 返回布尔值
  async filter () {
    let errorCount = 0
    let {
      url,
      dbTableName,
      inputConfigs,
      outputConfigs
    } = await this.query

    this.log('检查配置数据...')

    try {
      if (!url) throw new Error(`配置缺少“url”！`)
      this.query.inputConfigs = inputConfigs = JSON.parse(inputConfigs)
      this.query.outputConfigs = outputConfigs = JSON.parse(outputConfigs)
      
      // 检测查询条件
      if (typeof inputConfigs !== 'object' || (inputConfigs.flows && !(inputConfigs.flows instanceof Array))) {
        throw new Error(`“查询条件”配置数据有误！正确示例：{flows: ["#el,type,黄金", "#su,click"]}`)
      }
      if (inputConfigs.flows && inputConfigs.flows.length) {
        let flows = inputConfigs.flows.reduce((curr, next) => {
          let item = {}
          let arr = next.split(',')

          if (arr[0]) {
            item['selector'] = arr[0]
          } else throw new Error(`“查询条件”配置“flows”缺少输入选择器！正确示例："#el,type,黄金"`)

          if (arr[1] === 'type' || arr[1] === 'input') {
            item['type'] = 'type'
            if (arr[2]) item['value'] = arr[2]
            else throw new Error(`“查询条件”配置“flows”输入值有误！正确示例："#el,type,黄金"`)
          } else if (arr[1] === 'click') {
            item['type'] = 'click'
          } else throw new Error(`“查询条件”配置“flows”输入类型有误！正确示例："#el,type,黄金"`)

          curr.push(item)
          return curr
        }, [])
        // 转换inputConfigs.flows JSON
        inputConfigs.flows = flows
      } else {
        // throw new Error(`“查询条件”配置缺少“flows”！正确示例：{flows: ["#el,type,黄金", "#su,click"]}`)
      }

      if (typeof outputConfigs !== 'object' || !outputConfigs.el || !(outputConfigs.fields instanceof Array)) {
        throw new Error(`“采集数据”配置数据有误！正确示例：
          {
            el: ".c-container", 
            nextPage: "#page > a:last-child",
            fields: ["title,标题,string,200,.t>a,text", "href,链接,string,1500,.t>a,attr,href", "content,内容,text,4000,.c-row,text", "html,HTML,string,2000,&,html"]
          }
        `)
      }
      if (!outputConfigs.fields.length) {
        throw new Error(`“采集数据”配置缺少“fields”！正确示例：fields: ["title,标题,string,200,.t>a,text", "href,链接,string,1500,.t>a,attr,href", "content,内容,text,4000,.c-row,text", "html,HTML,string,2000,&,html"]`)
      } else {
        let fields = outputConfigs.fields.reduce((curr, next) => {
          let item = {}
          let arr = next.split(',')
  
          // 字段名
          if (arr[0]) {
            item['fieldName'] = arr[0]
          } else throw new Error(`“采集数据”配置“fields”缺少字段名！正确示例："title,标题,string,200,.t>a,text"`)

          // 字段label
          if (arr[1]) {
            item['fieldLabel'] = arr[1]
          } else throw new Error(`“采集数据”配置“fields”缺少字段label！正确示例："title,标题,string,200,.t>a,text"`)
          
          // 字段类型
          if (arr[2]) {
            item['fieldType'] = arr[2]
          } else throw new Error(`“采集数据”配置“fields”缺少字段类型！正确示例："title,标题,string,200,.t>a,text"`)

          // 字段长度
          if (arr[3]) {
            item['fieldLength'] = arr[3]
          } else throw new Error(`“采集数据”配置“fields”缺少字段长度！正确示例："title,标题,string,200,.t>a,text"`)
  
          // 字段CSS选择器
          if (arr[4]) {
            item['selector'] = arr[4]
          } else throw new Error(`“采集数据”配置“fields”选择器有误！正确示例：".t>a"`)

          // 字段HTML取值类型
          if (arr[5] === 'text') {
            item['type'] = 'text'
          } else if (arr[5] === 'html') {
            item['type'] = 'html'
          } else if (arr[5] === 'attr') {
            item['type'] = 'attr'

            if (arr[5]) item['attr'] = arr[6]
            else throw new Error(`“采集数据”配置“fields”属性选择器有误！正确示例："href,链接,string,1500,.t>a,attr,href"`)
          } else throw new Error(`“采集数据”配置“fields”类型有误！正确示例："title,标题,string,200,.t>a,text"`)
  
          curr.push(item)
          return curr
        }, [])
        // 转换outputConfigs.fields JSON
        outputConfigs.fields = fields
        // 生成数据库字段
        fields.reduce((curr, next) => {
          curr.push({
            name: next.fieldName,
            type: next.fieldType,
            length: next.fieldLength
          })

          return curr
        }, this.table.columns)
      }
    } catch (error) {
      errorCount++
      this.log(error.message)
    }

    if (dbTableName) this.table.name = dbTableName
    else {
      this.log('缺少数据库-表名')
      errorCount++
    }

    return errorCount ? false : true
  }

  // 处理页面
  async gather () {
    let {
      url,
      noImage,
      inputConfigs,
      pageCount
    } = this.query

    // 0.创建页面实例
    let page = await this.browser.newPage()
    this.log('创建页面实例')

    // 无图模式
    if (noImage) {
      this.log('--无图模式--')
      await page.setRequestInterception(true)
      // 请求拦截
      page.on('request', req => {
        let url = req.url()
        if (/((\.png)|(\.jpg))$/i.test(url)) req.abort()
        else req.continue()
      })
    }

    // 1.跳转至相应的页面
    await page.goto(url)
    this.log(`跳转至：${url}`)

    // page事件监听
    await page.on('console', (message) => {
      // for (let i = 0; i < message.args().length; ++i) {
      //   this.log(`${i}: ${message.args()[i]}`)
      // }
    })

    await timeout(3000 * Math.random())

    // 2.处理输入条件 --> example: {flows: ['#kw,input,黄金', '#su,click']}
    if (inputConfigs.flows) {
      let clickElem
      for (let i = 0, j = inputConfigs.flows.length; i < j; i++) {
        let {selector, type, value} = inputConfigs.flows[i]
    
        if (type === 'type') {
          // 输入值
          await page.type(selector, value, {delay: 100})
        }

        if (type === 'click') {
          // 点击元素
          clickElem = await page.$(selector)
          await clickElem.click()
        }
      }
    }

    // 3.点击提交

    // 4.获取页面数据，写入数据库
    let {
      el,
      fields,
      nextPage
    } = this.query.outputConfigs
    pageCount = pageCount || 0

    this.log(`已就绪，准备采集第1页，共${pageCount}页.`)
    await this.digest(page, el, fields)

    // 6.翻页，数据写文件，注意：从第二页开始
    if (pageCount && nextPage) {
      for (let index = 1; index < pageCount; index++) {
        let $nextPage = await page.$(nextPage)
        this.log(`准备采集第${index + 1}页，共${pageCount}页.`)
        await $nextPage.click()
        await timeout(3000 * Math.random())
        await this.digest(page, el, fields)
      }
    }

    // 7.关闭页面
    await timeout(300 * Math.random())
    await page.close()
    this.log(`采集完毕！关闭页面.`)
  }

  // 从dom获取并消化数据
  async digest (page, selector, fields) {
    await timeout(1500)
    let data = await page.evaluate((selector, fields) => {
      let $element = [...document.querySelectorAll(selector)]
      /*
      {
          el: '.c-container', 
          fields: ['title,.t>a,text', 'href,.t>a,attr,href', 'content,.c-row,text', 'html,&,html'],
          nextPage: '#page > a:last-child'
      }
      */
      // let count = 0
      let hash = +new Date()
      return $element.map(el => {
        // let id = `item_${hash}_${count}`
        let row = {}

        // row['id'] = id
        row['createdDate'] = hash

        fields.forEach(item => {
          let $el = item.selector === '&' ? el : el.querySelector(item.selector)
          $el =  $el || el
          // count++
          console.log(item.selector, $el)

          if (item.type === 'text') {
            row[item.fieldName] = $el.innerText
          } else if (item.type === 'html') {
            row[item.fieldName] = $el.innerHTML
          } else if (item.type === 'attr') {
            row[item.fieldName] = $el.getAttribute(item.attr)
          } else {
            row[item.fieldName] = null
          }
        })
        
        return row
      })
    }, selector, fields)

    this.saveData(data)
  }

  // 写入数据库
  async saveData (data) {
    this.table.data = data
    await bee.schema.save(this.table)
    this.log(`写入字段：${JSON.stringify(this.table.columns)}`)
    // this.log(`写入数据：${JSON.stringify(this.table.data)}`)
  }

  // 停止方法
  async stop () {
    await this.browser && this.browser.close()
    this.isWorking = false
    this.socket.broadcast('bee.stop', this.query.id)
    this.log(`Successfully, 已停止采集！已关闭浏览器.`)
    // 更新数据量、抓取次数、最近时间
    let data = await bee.schema.update(this.query)
    this.update('info', data)
  }

  // 更新信息
  async update (business, data) {
    let {id} = this.query
    this.socket.broadcast('bee.update', {
      id,
      business,
      data
    })
  }

  // 日志打印
  log (message) {
    console.log(message)
    let {id} = this.query
    this.socket.broadcast('bee.log', {
      id,
      message
    })
  }
}

module.exports = Bee
