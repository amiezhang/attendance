const crypto = require('crypto')
const koaRouter = require('koa-router')

const router = new koaRouter()

router.get('/reg',async ctx =>{
    let {username, password} = ctx.query
    let hash = crypto.createHash('md5')
    hash.update(password)
    let data =(await ctx.db.select('user_table','roles',{
        login_name: username
    }))
    if(data.length > 0) {
        ctx.body = {code: 0, msg: '用户名已存在'}
    } else {
        await ctx.db.insert('user_table',{
            login_name: username,
            password: hash.digest('hex'),
            roles: '2'
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
    let data = await ctx.db.select('user_table','roles',{
        login_name: username,
        password: hash.digest('hex')
    })
    if(data.length == 0) {
        ctx.body = {code: 0, msg: '用户名或密码错误'}
    } else {
        if(!ctx.session.username){
            ctx.session.username = username
            ctx.session.roles = data[0].roles
        }
        ctx.body = {
            code: 1, 
            msg: {
                roles: data[0].roles.split(',').map(item=>parseInt(item))
            }
        }
    }
})

router.get('/logout',async ctx =>{
    ctx.session = null
    ctx.body = {code: 1, msg: 'ok'}
})

module.exports = router.routes()