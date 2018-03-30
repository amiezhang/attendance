const crypto = require('crypto')
const koaRouter = require('koa-router')
const getTime = require('../libs/date')

const router = new koaRouter()

router.get('/reg',async ctx =>{
    let {username, password} = ctx.query
    if(password.length < 6 || password.length > 32) {
        ctx.body = {code: 0, msg: '密码长度要是6~32位'}
        return
    }
    let hash = crypto.createHash('md5')
    hash.update(password)
    let data =(await ctx.db.select('user_table','role',{
        login_name: username
    }))
    if(data.length > 0) {
        ctx.body = {code: 0, msg: '用户名已存在'}
    } else {
        await ctx.db.insert('user_table',{
            login_name: username,
            password: hash.digest('hex'),
            role: 0,
            createTime: getTime('Y-m-d h:i:s')
        }).then(res => {
            ctx.body = {code: 1, msg: '注册成功'}
        }).catch(err => {
            console.log(err)
            ctx.body = {code: 0, msg: err}
        })
        
    }
})

router.post('/login',async ctx =>{
    let {username, password} = ctx.request.fields
    if(!username) {
        ctx.body = {code: 0, msg: '账号不能为空'}
        return
    }
    if(!password) {
        ctx.body = {code: 0, msg: '密码不能为空'}
        return
    }
    let hash = crypto.createHash('md5')
    hash.update(password)
    let data = await ctx.db.select('user_table','role',{
        login_name: username,
        password: hash.digest('hex')
    })
    if(data.length == 0) {
        ctx.body = {code: 0, msg: '用户名或密码错误'}
    } else {
        if(!ctx.session.username){
            ctx.session.username = username
            ctx.session.role = data[0].role
        }
        ctx.body = {
            code: 1, 
            msg: data[0].role
        }
    }
})

router.get('/logout',async ctx =>{
    ctx.session = null
    ctx.body = {code: 1, msg: 'OK'}
})

router.get('/list',async ctx =>{
    let {pageSize,page} = ctx.query
    pageSize = pageSize || 15;
    page = page - 1 || 0
    let total =  (await ctx.db.select('user_table','count(1)'))[0]['count(1)']
    let list = await ctx.db.select('user_table','*','1=1',`${page*pageSize},${pageSize}`)
    ctx.body = {code: 1, msg: {
        total,
        list
    }}
})

//更新用户角色
router.post('/updateRole',async ctx =>{
    let {id,role} = ctx.request.fields
    await ctx.db.update('user_table',{
        role
    },{id})
    ctx.body = {code: 1, msg: 'OK'}    
})

//修改密码
router.post('/updatePass',async ctx =>{
    let {id,password} = ctx.request.fields
    if(password.length < 6 || password.length > 32) {
        ctx.body = {code: 0, msg: '密码长度要是6~32位'}
        return
    }
    let hash = crypto.createHash('md5')
    hash.update(password)
    await ctx.db.update('user_table',{
        password: hash.digest('hex')
    },{id})
    ctx.body = {code: 1, msg: 'OK'}    
})

//删除用户
router.post('/delete',async ctx =>{
    let {id} = ctx.request.fields
    await ctx.db.delete('user_table',{id})
    ctx.body = {code: 1, msg: 'OK'}    
})

module.exports = router.routes()