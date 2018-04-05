const koaRouter = require('koa-router')
const output = require('../libs/output')
const fs = require('fs')

const r1 = new koaRouter()

r1.get('/attendance',async ctx => {
    // let {id} = ctx.request.fields
    let {id} = ctx.query
    //获取课程全部学生id student_code sName cName
    let sql = `SELECT a.id as id,student_code,a.name AS sName,b.name AS cName FROM students_table as a LEFT JOIN class_table as b ON a.class_id = b.id WHERE lesson_ids LIKE '%,${id},%' OR lesson_ids like '${id},%' OR lesson_ids like '%,${id}' OR lesson_ids = '${id}' ORDER BY a.id`
    let allStudent = await ctx.db.query(sql)

    //获取课程信息
    let lesson = (await ctx.db.select('lesson_table','attend_score,attend_count',{id}))[0]
    //获取课程分数配置
    let rp = lesson.attend_score.split(',')
    //获取考勤总次数
    let times = parseInt(lesson.attend_count)

    //学生数组做成映射表
    let allStudentTable = {}
    allStudent.forEach(stu => {
        allStudentTable[stu.id] = {
            student_code: stu.student_code,
            sName: stu.sName,
            cName: stu.cName,
            scores: rp[0].repeat(times).split(''),
            questTime: 0
        }
    })
    allStudent = []

    //获取课程所有登记情况 student_id series is_quest attend_condition
    let allRecord = await ctx.db.select('record_table','student_id,series,is_quest,attend_condition',{lesson_id:id})
    let F = new Buffer(1).toString()    
    allRecord = allRecord.map(item => {
        item.is_quest = item.is_quest.toString() != F
        return item
    })

    allRecord.forEach(rec => {
        let stu = allStudentTable[rec.student_id]
        stu.scores[rec.series-1] = rp[rec.attend_condition]
        if(rec.is_quest) stu.questTime++
    })

    //转回数组
    for(let key in allStudentTable) {
        allStudent.push(allStudentTable[key])
    }
    allStudentTable = {}
    allStudent = allStudent.map(stu => {
        stu.sum = stu.scores.reduce((pre,item)=>pre = Number(pre) + Number(item))
        return stu
    })

    output(times,allStudent)

    let lname = (await ctx.db.select('lesson_table','name',{id}))[0].name
    ctx.response.attachment(`${lname}考勤表.xlsx`)
    ctx.body = fs.readFileSync('upload/output.xlsx')
})

module.exports = r1.routes()