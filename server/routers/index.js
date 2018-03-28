const koaRouter = require('koa-router')

const router = new koaRouter()
router.use('/user', require('./user'))
router.use('/lesson', require('./lesson'))
router.use('/student', require('./student'))
router.use('/record', require('./record'))

module.exports = router.routes()