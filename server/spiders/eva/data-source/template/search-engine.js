const mysql = require('mysql')
const db = require('../../../../utils')
const koaSocket = require('koa-socket')
const socket = new koaSocket()

module.exports = async (
  options, browser, timeout, key,
  source, url, inputSelectName, submitSelectName, domSelectName,
  nextPageSelectName, needPageMaxNum
) => {
  // 从dom获取数据，并写文件/数据库
  var getDataFromDom = async () => {
    await timeout(1500)
    var data = await page.evaluate((domSelectName) => {
      var list = [...document.querySelectorAll(domSelectName)]

      return list.map(el => {
        let $title = el.querySelector('a')
        let href = $title.href
        let title = $title.innerText

        return {
          html: el.innerHTML,
          title,
          content: el.innerText,
          href
        }
      })
    }, domSelectName)

    var content = []
    data.forEach(element => {
      content.push({
        title: element.title,
        content: element.content,
        contentUrl: element.href
      })
      // console.log(content)
    })

    var index = 0
    var time = +new Date()

    db.connect(mysql, 'news').then(ctx => {
      content.forEach(item => {
        var fields = {
          id: time + '.' + index,
          title: item.title,
          keyword: key,
          content: item.content,
          contentUrl: item.contentUrl,
          createdDate: time,
          source: source
        }

        ctx.query('INSERT INTO top10 SET ?', fields, function (error, results, fields) {
          if (error) throw error
          // console.log(results)
        })

        index++
      })

      ctx.end()
    })

    // await fs.appendFileSync(`./download/data/${key}-${source}.txt`, `startTime: ${new Date().toLocaleString()}`+'\r');
    // await fs.appendFileSync(`./download/data/${key}-${source}.txt`, JSON.stringify(content, null , ' ')+'\r');
    // await fs.appendFileSync(`./download/data/${key}-${source}.txt`, `endTime: ${new Date().toLocaleString()}`+'\r\r');
  }

  // 1.跳转至相应的页面
  var page = await browser.newPage()

  // 无图模式
  if (options && options.page && options.page.noImage) {
    console.log('--无图模式--')
    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        interceptedRequest.abort()
      else
        interceptedRequest.continue()
    })
  }
  await page.goto(url)

  // 2.输入关键字
  await timeout(3000 * Math.random())
  await page.type(inputSelectName, key, {
    delay: 100
  })

  // 3.点击提交
  var submit = await page.$(submitSelectName)
  await submit.click()

  // 4.获取数据，数据写文件
  await getDataFromDom()

  // 6.翻页，数据写文件
  for (let index = 0; index < needPageMaxNum; index++) {
    var nextPage = await page.$(nextPageSelectName)
    await nextPage.click()
    await timeout(3000 * Math.random());
    await getDataFromDom()
  }

  // 7.关闭页面
  await timeout(3000 * Math.random());
  await page.close()
}