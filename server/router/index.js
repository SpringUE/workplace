var routes = require('./routes.js')
var login = require('./login.js')

module.exports = function createRouter (app) {
  app.use(routes.routes())
  app.use(login.routes())
}
