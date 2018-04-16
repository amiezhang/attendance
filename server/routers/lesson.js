const koaRouter = require('koa-router')
const excel = require('../libs/excel')
const getTime = require('../libs/date')

const router = new koaRouter()

router.use(async (ctx,next) => {
    if(!ctx.session.username) {
        ctx.body = {code: -1, msg: '登陆过期'}
        return
    }
    await next()
})

//获取分数配置
router.get('/scoreConf',async ctx => {
    let {id} = ctx.query
    let data = await ctx.db.select('lesson_table','attend_score',{id})
    ctx.body = {code: 1,msg: data[0].attend_score}
})

//设置分数配置
router.post('/scoreConf',async ctx => {
    let {id,attend_score} = ctx.request.fields
    await ctx.db.update('lesson_table',{attend_score},{id})
    ctx.body = {code: 1,msg: 'OK'}
})

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
    await ctx.db.delete('record_table',{lesson_id:id})
    await ctx.db.delete('quest_table',{lesson_id:id})
    ctx.body = {code: 1,msg: 'OK'}
})

//课程列表
router.get('/list',async ctx => {
    let {pageSize,page} = ctx.query
    pageSize = pageSize || 15;
    page = page - 1 || 0
    let total =  (await ctx.db.select('lesson_table','count(1)',{userId: ctx.session.userId}))[0]['count(1)']
    let list = await ctx.db.select('lesson_table','*',{userId: ctx.session.userId},`${page*pageSize},${pageSize}`)
    ctx.body = {code: 1, msg: {
        total,
        list
    }}
})

//获取全部课程
router.post('/list',async ctx => {
    let list = await ctx.db.select('lesson_table','id,name',{userId: ctx.session.userId})
    ctx.body = {code: 1, msg: list}
})

//导入excel接口
router.post('/import',async ctx => {
    //post过来的参数
    let {lessonName} = ctx.request.fields
    //用excel模块来解析post过来的文件
    let data = await excel(ctx.request.fields.file[0].path)
    //检查当前用户是否存在该课程
    let row = await ctx.db.select('lesson_table','id',{
        lesson_code: data.lesson_code,
        userId: ctx.session.userId
    })
    //如果课程已存在则返回失败信息，并结束当前接口
    if(row.length > 0){
        ctx.body = {code: 0,msg: '该课程已存在'}
        return
    }
    //用getTime函数来获取格式化过的当前时间
    let createTime = getTime('Y-m-d h:i:s')
    //创建新的课程到数据表中
    let lessonId = (await ctx.db.insert('lesson_table',{
        name:lessonName,
        lesson_code:data.lesson_code,
        teach_time:data.teach_time,
        area:data.area,
        createTime,
        userId: ctx.session.userId,
        attend_score: '1,0,0,0,1'
    })).insertId
    //遍历处理每个学生
    for(let i=0;i<data.students.length;i++) {
        let stu = data.students[i]
        //查询是否已经存在该学生的班级
        row = await ctx.db.select('class_table','id',{
            name: stu[2],
            userId: ctx.session.userId
        })
        //如果没有往数据表中创建该班级
        if(row.length == 0){
            ctx.db.insert('class_table',{
                name: stu[2],
                createTime,
                userId: ctx.session.userId
            })
        }
        //查询是否有此学生
        row = await ctx.db.select('students_table','id,lesson_ids',{
            student_code: stu[0],
            userId: ctx.session.userId
        })
        //如果没有则创新该学生到数据表中        
        if(row.length == 0){
            //查询改学生对应班级的id备用
            let class_id = (await ctx.db.select('class_table','id',{
                name: stu[2],
                userId: ctx.session.userId
            }))[0].id
            let lesson_ids = ''
            //如果该学生本来有关联lesson_ids则往后面添加当前新增的课程id
            if(row.lesson_ids) {
                lesson_ids = row.lesson_ids + ',' + lessonId
            } else {
                //如果没有则直接添加当前课程id               
                lesson_ids = lessonId
            }
            //往数据表添加该学生
            await ctx.db.insert('students_table',{
                student_code: stu[0],
                name: stu[1],
                class_id,
                lesson_ids,
                createTime,
                userId: ctx.session.userId
            })
        } else {
            //如果已经存在此学生，则修改此学生关联的lesson_ids
            await ctx.db.update('students_table',{
                lesson_ids: row[0].lesson_ids ? row[0].lesson_ids+','+lessonId:lessonId ,
            },{id:row[0].id,userId: ctx.session.userId})
        }
    }
    ctx.body = {code: 1}
})


//导出lesson接口模块
module.exports = router.routes()