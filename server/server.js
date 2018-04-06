const koa = require('koa')
const koaRouter = require('koa-router')
const static = require('koa-static')
const body = require('koa-better-body');
const convert = require('koa-convert');
const url = require('url')
const config = require('./config')
const db = require('./libs/mysql')
const session = require('koa-session')

const server = new koa();
server.listen(config.PORT)
console.log('服务器启动，端口'+config.PORT)

server.keys = config.cookiesKeys
server.use(session(
    config.SESSION,
    server
))

server.use(async (ctx,next) => {
    ctx.db = db
    await next()
})

//配置接受文件存储位置，扩展名是否加上
server.use(convert(body({
    uploadDir: './upload',
    keepExtensions: true,
    fields: true
})))

//api
let rootRouter = new koaRouter()
rootRouter.use('/api', require('./routers'))
server.use(rootRouter.routes())

//静态文件
server.use(static('./wwwRoot'))

