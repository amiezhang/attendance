const koaRouter = require('koa-router')

const router = new koaRouter()

//班级列表
router.get('/class',async ctx => {
    let {pageSize,page} = ctx.query
    pageSize = pageSize || 15;
    page = page - 1 || 0
    let total =  (await ctx.db.select('class_table','count(1)'))[0]['count(1)']
    let list = await ctx.db.select('class_table','*','1=1',`${page*pageSize},${pageSize}`)
    ctx.body = {code: 1, msg: {
        total,
        list
    }}
})

//学生列表
router.get('/list',async ctx => {
    let {id} = ctx.query
    let list = await ctx.db.select('students_table','*',{class_id:id})
    ctx.body = {code: 1, msg: {
        list
    }}
})

module.exports = router.routes()