const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  const url = ctx.url
  // 使用 ctx.request
  const request = ctx.request
  const req_query = request.query
  const req_querystring = request.querystring
  // 直接使用ctx来获取
  const req_ctx = ctx.query
  const req_ctx1 = ctx.querystring
  ctx.body = {
    url,
    req_query,
    req_querystring,
    req_ctx,
    req_ctx1,
  }

})
app.listen(3000, () => {
  console.log("demo1 is run")
})

/*
作者：srtian
链接：https://www.jianshu.com/p/b988ce30bac3
來源：简书
简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。
*/

/*example2
 let resultsData
 db.connect(mysql, 'news').then(async (sql) => {
   var data = await sql.query('SELECT * FROM top10', function (error, results, fields) {
     if (error) throw error
     resultsData = results
   })

   console.log(resultsData);
   
   ctx.response.body = {
     status: '200',
     data: resultsData,
     message: 'OK!'
   }

   sql.end()
 })
 */

/*example
 // 测试连接数据库
router.get('/conetDB', function async (ctx) {
  connectMySQL()

  ctx.body = {
    status: '200',
    data: '123',
    message: 'OK!'
  }

  try {

  } catch (ex) {
    console.log(ex)
  }
})

// 测试MySQL
function connectMySQL() {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'draw'
    });

    connection.connect();

    connection.query('SELECT * FROM user', function (error, results, fields) {
      if (error) throw error;

      resolve(results)
      console.log('name: ', results);
    });

    connection.end();
  })
}
*/

// socket
router.get('/chat', async ctx => {
  ctx.body = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <script src="http://cdn.staticfile.org/socket.io/2.1.1/socket.io.js"></script>
      <title>Document</title>
    </head>

    <body>
      <ul id="messages"></ul>
      <form action="">
        <input id="m" autocomplete="off" />
        <button id="b">Send</button>
      </form>
    </body>

    </html>

    <script>
      const socket = io('http://localhost:8080')
      const text = document.querySelector('#m')
      const button = document.querySelector('#b')
      const messages = document.querySelector('#messages')
      button.addEventListener('click', (ev) => {
        const msg = text.value.trim()
        if (msg === '') return
        socket.emit('join', msg) // 关键代码
        text.value = ''
        ev.preventDefault()
      })
      socket.on("getMsg", function (data) {
        console.log("服务端发送的消息是：", data);
        messages.innerHTML += data + '<br/>';
      })
    </script>
  `
})