const koaRouter = require('koa-router')
const getTime = require('../libs/date')

const router = new koaRouter()

//添加学生
router.post('/add',async ctx => {
    let {student_code,name,class_id,lesson_ids} = ctx.request.fields
    let row = await ctx.db.select('students_table','id',{
        student_code
    })
    if(row.length > 0) {
        ctx.body = {code:0,msg: '该学号已存在'}
        return
    }
    await ctx.db.insert('students_table',{
        student_code,name,class_id,lesson_ids,
        createTime: getTime('Y-m-d h:i:s')
    })
    ctx.body = {code:1,msg: 'OK'}
})

//添加学生
router.post('/update',async ctx => {
    let {id,student_code,name,lesson_ids} = ctx.request.fields
    await ctx.db.update('students_table',{
        student_code,name,lesson_ids
    },{id})
    ctx.body = {code:1,msg: 'OK'}
})

//删除学生
router.post('/delete',async ctx => {
    let {id} = ctx.request.fields
    await ctx.db.delete('students_table',{id})
    ctx.body = {code:1,msg: 'OK'}
})

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
    for(let i = 0;i < list.length;i++){
        let student = list[i]
        let lids = list[i].lesson_ids.split(',')
        let lnames = []
        for(let j = 0;j < lids.length;j++) {
            let name = (await ctx.db.select('lesson_table','name',{id:lids[j]}))[0]
            name = name ? name.name : ''
            lnames.push(name)
        }
        student.lnames = lnames.join('，')
    }
    ctx.body = {code: 1, msg: {
        list
    }}
})

//课程学生总数
router.get('/listSum',async ctx => {
    let {id} = ctx.query
    let sql = `SELECT count(1) FROM students_table WHERE lesson_ids LIKE '%,${id},%' OR lesson_ids like '${id},%' OR lesson_ids like '%,${id}' OR lesson_ids = '${id}'`
    let total = (await ctx.db.query(sql))[0]['count(1)']
    ctx.body = {code: 1, msg: {
        total
    }}
})

//课程学生列表
router.post('/list',async ctx => {
    let {id,num} = ctx.request.fields
    let sql = `SELECT id,student_code,name FROM students_table WHERE lesson_ids LIKE '%,${id},%' OR lesson_ids like '${id},%' OR lesson_ids like '%,${id}' OR lesson_ids = '${id}'`
    let list = await ctx.db.query(sql)
    ctx.body = {code: 1, msg: {
        list
    }}
})

module.exports = router.routes()