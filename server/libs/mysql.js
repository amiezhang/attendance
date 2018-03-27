const mysql = require('mysql')
const assert = require('assert')
const config = require('../config')

const db = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    port: config.DB_PORT
})

function filter(val) {
    try {
        return val.toString().replace(/"/g,'\\"').replace(/'/g,'\\\'')
    } catch(e){
        throw new Error(val+'被replace失败')
    }
}

db._query = db.query

db.query = function(sql) {
    return new Promise((resolve, reject) => {
        db._query(sql, (err, data) => {
            if(err){
                console.log(sql)
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

db.select = function(table, query = '*', where = '1=1', limit = '') {
    if (typeof where === 'object') {
        let arr = []
        for(let key in where) {
            arr.push(`${key}="${filter(where[key])}"`)
        }
        where = arr.join(' AND ')
    }
    limit = limit ? `LIMIT ${limit}` : ''
    return db.query(`
        SELECT ${query} FROM ${table} WHERE ${where} ${limit}
    `)
}

db.insert = function(table, dataObj){
    let keys = [], values =[]
    for(let key in dataObj){
        keys.push(key)
        values.push(filter(dataObj[key]))
    }
    return db.query(`
        INSERT INTO ${table} (${keys.join(',')}) VALUES('${values.join("', '")}')
    `)
}

db.update = function(table, dataObj, where) {
    assert(where)
    assert(typeof where === 'object')

    let arr = []
    for(let key in dataObj) {
        arr.push(`${key}='${filter(dataObj[key])}'`)
    }
    
    let whereArr = [],i=0
    for(let key in where) {
        whereArr.push(`${key}='${filter(where[key])}'`)
    }
    return db.query(`
        UPDATE ${table} SET ${arr.join(',')} WHERE ${whereArr.join(' AND ')}
    `)
}

db.delete = function(table, where) {
    assert(where)
    assert(typeof where === 'object')

    let whereArr = []
    for(let key in where) {
        whereArr.push(`${key}='${filter(where[key])}'`)
    }

    return db.query(`
        DELETE FROM ${table} WHERE ${whereArr.join(' AND ')}
    `)
}

module.exports = db