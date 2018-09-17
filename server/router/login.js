const Router = require('koa-router')
let router = Router()

// 用户
const userDB = [
  {
    username: 'admin',
    password: 'admin',
    uuid: 'admin-uuid',
    name: '管理员'
  },
  {
    username: 'editor',
    password: 'editor',
    uuid: 'editor-uuid',
    name: '编辑'
  },
  {
    username: 'user1',
    password: 'user1',
    uuid: 'user1-uuid',
    name: '用户1'
  }
]

// 登录
router.post('/login', async (ctx, args) => {
  const params = await ctx.request.body
  const user = userDB.find(e => e.username === params.username && e.password === params.password)
  if (user) {
    ctx.body = {
      code: 0,
      msg: '登陆成功',
      data: {
        ...user,
        token: 'd787syv8dys8cas80d9s0a0d8f79ads56f7s4d56f879a8as89fd980s7dg'
      }
    }
  } else {
    ctx.body = {
      code: 401,
      msg: '用户名或密码错误'
    }
  }
})

module.exports = router
