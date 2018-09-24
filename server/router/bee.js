const db = require('../utils')
const bee = {}
const table = 'bee_list'
const getFields = object => {
  const result = {}
  const fields = [
    'LastModifiedDate',
    'collectTimes',
    'createdDate',
    'emailInError',
    'headless',
    'inputConfigs',
    'isAcceptRobot',
    'name',
    'noImage',
    'outputConfigs',
    'pageCount',
    'pageTotal',
    'redoInError',
    'status',
    'task',
    'taskType',
    'taskValue',
    'url',
    'id'
  ]

  fields.forEach(item => {
    result[item] = object[item]
  })

  return result
}

// 创建
bee.create = async (ctx, args) => {
  console.log('POST参数：', ctx.request.body)
  const id = guid()
  const params = ctx.request.body
  const cover = {
    id, // id
    status: 0, // status
    keyword: getKeyword(params),
    createdDate: +new Date(), // createdDate
    dbTableName: 'bee' + id
  }
  const fields = Object.assign(getFields(params), cover)
  console.log('写入字段：', fields)

  // 写入数据库
  await db.knex(table).insert(fields)
  ctx.response.body = {
    status: '200',
    data: fields,
    message: 'success!'
  }
}

// 查询
bee.list = async (ctx, args) => {
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
  let likefields = ['name', 'url', 'keyword']
  let equalfields = ['pageCount']

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
}

// 改
bee.edit = async (ctx, args) => {
  const params = ctx.request.body
  const id = params.id
  const fields = getFields(params)

  fields.keyword = getKeyword(params)
  await db.knex(table)
    .where('id', '=', id)
    .update(fields)
  ctx.response.body = {
    status: '200',
    data: fields,
    message: 'success!'
  }
}

// 删
bee.delete = async (ctx, args) => {
  const params = ctx.request.body
  const id = params.id
  await db.knex(table)
    .where('id', id)
    .del()

  console.log(id)
  ctx.response.body = {
    status: '200',
    data: {
      id
    },
    message: 'success!'
  }
}

/**
 * 全局唯一标识符（GUID，Globally Unique Identifier）也称作 UUID(Universally Unique IDentifier) 。
 * GUID是一种由算法生成的二进制长度为128位的数字标识符。
 * GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”，其中的 x 是 0-9 或 a-f 范围内的一个32位十六进制数。
 * 在理想情况下，任何计算机和计算机集群都不会生成两个相同的GUID。
 * GUID 的总数达到了2^128（3.4×10^38）个，所以随机生成两个相同GUID的可能性非常小，但并不为0。
 * GUID一词有时也专指微软对UUID标准的实现。
 */
function guid () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function ($0) {
    var r = Math.random() * 16 | 0
    var v = $0 == 'x' ? r : (r & 0x3 | 0x8)

    return v.toString(16)
  })
}

// 获得搜索关键词
function getKeyword (data) {
  const inputs = JSON.parse(data.inputConfigs)

  if (!inputs.flows) return ''
  
  const result = inputs.flows.reduce((curr, next) => {
    let strs = next.split(',')
    if (strs[1] === 'input' && strs[2]) curr.push(strs[2])
    return curr
  }, [])

  return result.join(',')
}

// bee实例
bee.schema = {}

// bee实例-查询
bee.schema.list = async (ctx, args) => {
  let query = ctx.request.query
  let {
    id,
    dbTableName,
    pageIndex,
    pageSize
  } = query
  let page = {
    pageIndex,
    pageSize
  }

  // 查询数据
  let data = await db.knex.select()
    .from(dbTableName)
    .limit(pageSize).offset((pageIndex - 1) * pageSize)
    .orderBy('id', 'desc')

  // 查询总记录数
  let total = await db.knex.select()
    .from(dbTableName)
  page.pageTotal = total.length || data.length

  ctx.response.body = {
    status: '200',
    data,
    page,
    message: 'success!'
  }
}

// bee实例-保存数据
bee.schema.save = async (table) => {
  let {
    name,
    columns,
    data
  } = table
  let hasCreatedDate = columns.filter(c => c.name === 'createdDate').length ? true : false
  !hasCreatedDate && columns.push({
    name: 'createdDate',
    type: 'string',
    length: 35
  })

  // console.log(data)
  
  await bee.schema.createTableIfNotExists(name, columns)
  await bee.schema.createColumnsIfNotExists(name, columns)
  await bee.schema.filterData(data, columns)
  await db.knex(name).insert(data)
}

// bee实例-检测表，不存在则创建
bee.schema.createTableIfNotExists = async (name, columns) => {
  await db.knex.schema.createTableIfNotExists(name, t => {
    t.increments('id').primary() // 主键id

    columns.forEach(item => {
      bee.schema.createColumn(item, t)
    })
  })
}

// bee实例-创建表
bee.schema.createTable = async (name, columns) => {
  await db.knex.schema.createTable(name, t => {
    t.increments('id').primary() // 主键id

    columns.forEach(item => {
      bee.schema.createColumn(item, t)
    })
  })
}

// bee实例-检测列，不存在则创建
bee.schema.createColumnsIfNotExists = async (tableName, columns) => {
  for (let i = 0; i < columns.length; i++) {
    let column = columns[i]
    let hasColumn = await db.knex.schema.hasColumn(tableName, column.name)

    if (!hasColumn) {
      await db.knex.schema.table(tableName, table => {
        bee.schema.createColumn(column, table)
      })
    }
  }
}

// bee实例-创建列
bee.schema.createColumn = (column, t) => {
  if (column.type === 'number') t.integer(column.name, column.length)
  if (column.type === 'string') t.string(column.name, column.length)
  if (column.type === 'text') t.text(column.name)
}

// bee实例-保存数据-截取长度
bee.schema.filterData = async (data, columns) => {
  await data.forEach(item => {
    /*
    columns.forEach(column => {
      if (column.type === 'string' && data[column.name].length > column.length) {
        data[item.name] = data[item.name].slice(0, column.length - 1)
      }
    })
    */
  })
}

// bee实例-更新数据
bee.schema.update = async (data) => {
  data.collectTimes += 1
  let {id, collectTimes, dbTableName, pageTotal, LastModifiedDate} = data

  LastModifiedDate = +new Date()
  // 查询总记录数
  let total = await db.knex.select().from(dbTableName)
  pageTotal = total.length

  const fields = getFields({collectTimes, pageTotal, LastModifiedDate})
  await db.knex(table)
    .where('id', '=', id)
    .update(fields)
  
  return fields
}

module.exports = bee
