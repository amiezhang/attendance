const koaRouter = require('koa-router')
const getTime = require('../libs/date')

const router = new koaRouter()

//抽取学生
router.post('/getRandom',async ctx => {
    //课程id和本次抽取人数
    let {id,num} = ctx.request.fields
    num = parseInt(num)

    //获取课程全部学生的id
    let sql = `SELECT id FROM students_table WHERE lesson_ids LIKE '%,${id},%' OR lesson_ids like '${id},%' OR lesson_ids like '%,${id}' OR lesson_ids = '${id}'`
    let all = await ctx.db.query(sql)
    //制作成表单等下用于记录被抽查的次数
    let recordTable = {}
    all.forEach(item => {
        recordTable[item.id] = 0
    })

    //获取之前已经抽取过多少 人/次
    let total = parseInt((await ctx.db.select('lesson_table','attend_sum',{id}))[0].attend_sum)
    //计算出是第几轮抽查了(从第0轮开始算)
    let round = parseInt(total/all.length)

    //获取已经登记过的同学id的数组（点过一次出现一次）
    let recordArray = (await ctx.db.select('record_table','student_id',{lesson_id:id})).map(item=>item.student_id)
    //登记已被抽查的次数
    recordArray.forEach(item => {
        if(typeof recordTable[item] == 'number') recordTable[item]++
    });

    //获取点名候选名单（第n轮就是获取抽查了n次的同学）
    let randomList;
    //最终抽取的学号
    let stuIdList = []

    updateRandomList()
    function updateRandomList() {
        randomList = []
        for(let id in recordTable) {
            if(recordTable[id] == round) randomList.push(id)
        }
        stuIdList.forEach(x => {
            randomList = randomList.filter(y => y!=x)
        })
    }

    getStu()
    function getStu(){
        //如果备选名单已经被抽空,就更新备选名单
        if(randomList.length==0){
            round++
            updateRandomList()
        }
        let rnd = parseInt(randomList.length * Math.random())
        stuIdList.push(randomList[rnd])
        randomList.splice(rnd,1)
        recordTable[randomList[rnd]]++
        num--
        if(num>0) getStu()
    }
    
    //获取最终输出的list
    let list = []
    for(let i=0;i<stuIdList.length;i++) {
        let temp = await ctx.db.select('students_table','id,student_code,name',{id:stuIdList[i]})
        list.push(temp[0])       
    }

    ctx.body = {code: 1, msg: {
        list
    }}
})

router.post('/submit',async ctx => {
    let {lid,list,series} = ctx.request.fields
    for(let i=0;i<list.length;i++){
        let stu = list[i]
        let sql = `INSERT INTO record_table (student_id,lesson_id,series,Date,attend_condition,is_quest) VALUES('${stu.id}', '${lid}', '${series}', '${getTime('Y-m-d h:i:s')}', '${stu.condition}', ${stu.is_quest ? true : false})`
        await ctx.db.query(sql)
    }
    let sum = (await ctx.db.select('lesson_table','attend_sum',{id: lid}))[0].attend_sum
    await ctx.db.update('lesson_table',{
        attend_count: series,
        attend_sum: parseInt(sum)+list.length
    },{id: lid})
    ctx.body = {code:1,msg:'OK'}
})

module.exports = router.routes()