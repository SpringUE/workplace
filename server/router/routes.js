const db = require('../utils')
const bee = require('./bee.js')
const Router = require('koa-router')
const spiders = require('../spiders')

let router = Router({
  prefix: '/api/spiders'
})

// 小蜜蜂-增
router.post('/bee/create', bee.create)

// 小蜜蜂-查
router.get('/bee/list', bee.list)

// 小蜜蜂-改
router.post('/bee/edit', bee.edit)

// 小蜜蜂-删
router.post('/bee/delete', bee.delete)

// 信息搜集-查询数据
router.get('/list', async (ctx) => {
  let querydb = async (sql) => {
    let data = await db.query(sql)
    return data
  }
  let requestQuery = ctx.request.query
  let {
    pageIndex,
    pageSize
  } = requestQuery
  let page = {
    pageIndex,
    pageSize
  }
  let where = []
  let likefields = ['keyword', 'title', 'content']
  let equalfields = ['source']

  likefields.forEach(item => {
    if (requestQuery[item] && requestQuery[item] != 0)
      where.push(`${item} like '%${requestQuery[item]}%'`)
  })

  equalfields.forEach(item => {
    if (requestQuery[item] && requestQuery[item] != 0)
      where.push(`${item} = '${requestQuery[item]}'`)
  })

  where = where.length ? `where ${where.join(' AND ')}` : ''

  let LIMIT = [(pageIndex - 1) * pageSize, pageSize]
  let table = 'top10'
  // let sqlCount = `select count as totalcount from ${table}`
  let sqlCount = `
    SELECT * FROM ${table}
    ${where}
  `
  // let sql = `SELECT * FROM ${table} order by createdDate desc`
  let sql = `
    SELECT * FROM ${table} 
    ${where}
    order by createdDate desc LIMIT ${LIMIT[0]}, ${LIMIT[1]}
  `
  console.log(`查询sql: ${sql}`)

  // 查询数据
  let dataList = await querydb(sql)
  // 查询总记录数
  let pageTotal = await querydb(sqlCount)
  page.pageTotal = pageTotal.length || dataList.length

  ctx.response.body = {
    status: '200',
    data: dataList,
    page: page,
    message: 'OK!'
  }
})

// 小蜜蜂-查看
router.get('/bee/schema/list', bee.schema.list)

module.exports = router
