const koaRouter = require('koa-router')
const excel = require('../libs/excel')

const router = new koaRouter()

//导入excel接口
router.post('/import',async ctx => {
    let {lessonName} = ctx.request.fields
    let data = await excel(ctx.request.fields.file[0].path)
    console.log(lessonName)
    console.log(data)
    ctx.body = {code: 1}
})

module.exports = router.routes()