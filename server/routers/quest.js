const koaRouter = require('koa-router')
const getTime = require('../libs/date')

const router = new koaRouter()

router.use(async (ctx,next) => {
    if(!ctx.session.username) {
        ctx.body = {code: -1, msg: '登陆过期'}
        return
    }
    await next()
})

//获取问题
router.get('/list',async ctx => {
    let {id,pageSize,page} = ctx.query
    pageSize = pageSize || 15;
    page = page - 1 || 0
    let total =  (await ctx.db.select('quest_table','count(1)',{lesson_id:id}))[0]['count(1)']
    let list = await ctx.db.select('quest_table','id,title,createTime',{lesson_id:id},`${page*pageSize},${pageSize}`)
    ctx.body = {code: 1,msg: {
        total,
        list
    }}
})

//添加问题
router.post('/add',async ctx => {
    let {question,answer,lesson_id,title} = ctx.request.fields
    await ctx.db.insert('quest_table',{
        question,answer,lesson_id,title,
        createTime: getTime('Y-m-d h:i:s'),
        userId: ctx.session.userId
    })
    ctx.body = {code: 1,msg: 'OK'}
})

//更新问题
router.post('/update',async ctx => {
    let {question,answer,title,id} = ctx.request.fields
    await ctx.db.update('quest_table',{question,answer,title},{id})
    ctx.body = {code: 1,msg: 'OK'}
})

//获取详细问题
router.get('/detail',async ctx => {
    let {id} = ctx.query
    let list = await ctx.db.select('quest_table','question,answer',{id})
    ctx.body = {code: 1,msg: list[0]}
})

//删除
router.post('/delete',async ctx => {
    let {id} = ctx.request.fields
    await ctx.db.delete('quest_table',{id})
    ctx.body = {code: 1,msg: 'OK'}
})

module.exports = router.routes()