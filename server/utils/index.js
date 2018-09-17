const connection = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'news'
}
const mysql = require('mysql')
const knex = require('knex')({
  client: 'mysql',
  connection
})
const db = {}
const pool = mysql.createPool(connection)

// 连接数据库
const connect = function (mysql) {
  return new Promise((resolve, reject) => {
    try {
      const db = mysql.createConnection(connection)
      db.connect()
      resolve(db)
    } catch (error) {
      reject(db)
    }
  })
}

// 查询数据库
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

db.connect = connect
db.query = query
db.knex = knex

module.exports = db
