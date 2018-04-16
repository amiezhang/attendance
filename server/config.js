// 配置文件
//（由于安全关系以下配置信息都是和实际有出入）
module.exports = {
    //监听本地端口
    PORT: 80,
    //数据库服务器名称、端口、登陆名字、密码、数据库名字
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_DATABASE: 'attendance',
    //koa-session插件相关配置
    SESSION: {
        key: 'rick666', /* (string) cookie key (default is koa:sess) */
        maxAge: 1200000, /* (number || 'session') maxAge in ms (default is 1 days) */
        overwrite: true, /* (boolean) can overwrite or not (default true) */
        httpOnly: true, /* (boolean) httpOnly or not (default true) */
        signed: true, /* (boolean) signed or not (default true) */
        rolling: false, /* (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false,/* (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    },
    cookiesKeys: ['amie','zhang','hahaha','233666']
}