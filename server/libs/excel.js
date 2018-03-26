const fs = require('fs')
const iconv = require('iconv-lite'); 
const path = require('path')  

async function handleExcel(url) {
    const dataObj = {
        lesson_code: '',
        teach_time: '',
        area: '',
        students: []
    }
    await new Promise((resolve,reject) => {
        fs.readFile(url,(err,data) => {
            if(err) {
                console.log(err)
                reject()
            } else {
                var str = iconv.decode(data, 'gbk');  
                const rows = str.match(/<table[\s\S]*<\/table>/)[0]
                                .match(/<tr[\s\S]*?<\/tr>/g)
                                .map(item=> item.match(/<td[^>]*?>[\s\S]*?<\/td>/g))
                                .map(arr => arr.map(item => item.match(/<td[^>]*?>([\s\S]*?)<\/td>/)[1]))
        
                let index1 = rows[1].length > 9 ? 12 : 7
                dataObj.lesson_code = rows[1][index1]
        
                let index2 = rows[2].length > 9 ? 11 : 5
                dataObj.teach_time = rows[2][index2]
        
                let index3 = rows[2].length > 9 ? 18 : 7
                dataObj.area = rows[2][index3]
                
                dataObj.students = rows.slice(4).map(arr => arr.slice(0,3)).filter(arr => arr[0] != '')
                resolve()
            }
        })
    })
    await new Promise((resolve,reject) => {
        fs.unlink(url ,err => {
            if(err) {
                console.log(err)
                reject()
            }
            resolve()
        })
    })

    return dataObj
}

module.exports = handleExcel