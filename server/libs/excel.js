const fs = require('fs')
const iconv = require('iconv-lite'); 
const path = require('path')  

async function handleExcel(url) {
    //最终返回数据的结构
    const dataObj = {
        lesson_code: '',
        teach_time: '',
        area: '',
        students: []
    }
    // 
    await new Promise((resolve,reject) => {
        fs.readFile(url,(err,data) => {
            if(err) {
                console.log(err)
                reject()
            } else {
                //gbK解码
                var str = iconv.decode(data, 'gbk');  
                //正则匹配获取每行数据
                const rows = str.match(/<table[\s\S]*<\/table>/)[0]
                                .match(/<tr[\s\S]*?<\/tr>/g)
                                .map(item=> item.match(/<td[^>]*?>[\s\S]*?<\/td>/g))
                                .map(arr => arr.map(item => item.match(/<td[^>]*?>([\s\S]*?)<\/td>/)[1]))
                //获取第1行的课程号
                let index1 = rows[1].length > 9 ? 12 : 7
                dataObj.lesson_code = rows[1][index1]
                //获取第2行的上课时间      
                let index2 = rows[2].length > 9 ? 11 : 5
                dataObj.teach_time = rows[2][index2]
                //获取第2行的上课地点
                let index3 = rows[2].length > 9 ? 18 : 7
                dataObj.area = rows[2][index3]
                //获取第4行以后的所有数据
                dataObj.students = rows.slice(4).map(arr => arr.slice(0,3)).filter(arr => arr[0] != '')
                resolve()
            }
        })
    })
    //删除文件
    await new Promise((resolve,reject) => {
        fs.unlink(url ,err => {
            if(err) {
                console.log(err)
                reject()
            }
            resolve()
        })
    })
    //返回
    return dataObj
}

module.exports = handleExcel