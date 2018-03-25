const koaRouter = require('koa-router')

const router = new koaRouter()
router.use('/user', require('./user'))

module.exports = router.routes()