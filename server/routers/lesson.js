const koaRouter = require('koa-router')
const excel = require('../libs/excel')
const getTime = require('../libs/date')

const router = new koaRouter()

//更新课程信息
router.post('/update',async ctx => {
    let {id,name,teach_time,area} = ctx.request.fields
    await ctx.db.update('lesson_table',{name,teach_time,area},{id})
    ctx.body = {code: 1,msg: 'OK'}
})
//删除课程
router.post('/delete',async ctx => {
    let {id} = ctx.request.fields
    await ctx.db.delete('lesson_table',{id})
    let sql = `SELECT id,lesson_ids FROM students_table WHERE lesson_ids LIKE '%,${id},%' OR lesson_ids like '${id},%' OR lesson_ids like '%,${id}' OR lesson_ids = '${id}'`
    let students = await ctx.db.query(sql)
    for(let i=0;i<students.length;i++){
        let stu = students[i]
        await ctx.db.update('students_table',{
            lesson_ids: stu.lesson_ids.replace(eval(`/^${id},|,${id}$|,${id},|^${id}$/`),'')
        },{
            id: stu.id
        })
    }
    ctx.body = {code: 1,msg: 'OK'}
})

//课程列表
router.get('/list',async ctx => {
    let {pageSize,page} = ctx.query
    pageSize = pageSize || 15;
    page = page - 1 || 0
    let total =  (await ctx.db.select('lesson_table','count(1)'))[0]['count(1)']
    let list = await ctx.db.select('lesson_table','*','1=1',`${page*pageSize},${pageSize}`)
    ctx.body = {code: 1, msg: {
        total,
        list
    }}
})

//获取全部课程
router.post('/list',async ctx => {
    let list = await ctx.db.select('lesson_table','id,name','1=1')
    ctx.body = {code: 1, msg: list}
})

//导入excel接口
router.post('/import',async ctx => {
    let {lessonName} = ctx.request.fields
    let data = await excel(ctx.request.fields.file[0].path)
    let row = await ctx.db.select('lesson_table','id',{
        lesson_code: data.lesson_code
    })
    let createTime = getTime('Y-m-d h:i:s')
    if(row.length > 0){
        ctx.body = {code: 0,msg: '该课程已存在'}
        return
    }
    let lessonId = (await ctx.db.insert('lesson_table',{
        name:lessonName,
        lesson_code:data.lesson_code,
        teach_time:data.teach_time,
        area:data.area,
        createTime
    })).insertId
    //处理每个学生
    for(let i=0;i<data.students.length;i++) {
        let stu = data.students[i]
        row = await ctx.db.select('class_table','id',{
            name: stu[2]
        })
        if(row.length == 0){
            ctx.db.insert('class_table',{
                name: stu[2],
                createTime
            })
        }
        row = await ctx.db.select('students_table','id,lesson_ids',{
            student_code: stu[0]
        })
        if(row.length == 0){
            let class_id = (await ctx.db.select('class_table','id',{
                name: stu[2]
            }))[0].id
            let lesson_ids = ''
            if(row.lesson_ids) {
                lesson_ids = row.lesson_ids + ',' + lessonId
            } else {
                lesson_ids = lessonId
            }
            await ctx.db.insert('students_table',{
                student_code: stu[0],
                name: stu[1],
                class_id,
                lesson_ids,
                createTime
            })
        } else {
            await ctx.db.update('students_table',{
                lesson_ids: row[0].lesson_ids ? row[0].lesson_ids+','+lessonId:lessonId ,
            },{id:row[0].id})
        }
    }
    ctx.body = {code: 1}
})

module.exports = router.routes()