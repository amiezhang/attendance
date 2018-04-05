const XLSX = require('xlsx');

function WriteXlsx(times,data) {
    times = parseInt(times)
    // 构建 workbook 对象
    var wb = {
        SheetNames: ['sheet1'],
        Sheets: {
            'sheet1': {
                'A1': {v: '学号'},
                'B1': {v: '姓名'},
                'C1': {v: '班级'},
                'D1': {v: '课堂考勤'},
                "!merges":[
                    {s: {c: 0,r: 0},e: {c: 0,r: 1}},
                    {s: {c: 1,r: 0},e: {c: 1,r: 1}},
                    {s: {c: 2,r: 0},e: {c: 2,r: 1}},
                    {s: {c: 3,r: 0},e: {c: 3+(times-1),r: 0}},
                ],
                '!ref': `A1:${String.fromCharCode(69+times)+(data.length+2)}`,
                // "!rows": [{hpx: 50}],
                '!cols': [{wpx: 80},{wpx: 50},{wpx: 80}] 
            }
        }
    };
    let temp = {}
    for(let i=0;i<times;i++){
        temp[String.fromCharCode(68+i)+'2'] = {v: `第${i+1}次考勤`}
        wb.Sheets['sheet1']['!cols'].push({wpx: 60})
    }
    wb.Sheets['sheet1'] = Object.assign(wb.Sheets['sheet1'],temp)
    
    //考勤总分
    wb.Sheets['sheet1'][String.fromCharCode(68+times)+'1'] = {v: '考勤总分'}
    wb.Sheets['sheet1']['!cols'].push({wpx: 60})
    wb.Sheets['sheet1']["!merges"].push({s: {c: 3+times,r: 0},e: {c: 3+times,r: 1}})
    //提问次数标题
    wb.Sheets['sheet1'][String.fromCharCode(69+times)+'1'] = {v: '提问次数'}
    wb.Sheets['sheet1']['!cols'].push({wpx: 60})
    wb.Sheets['sheet1']["!merges"].push({s: {c: 4+times,r: 0},e: {c: 4+times,r: 1}})

    //写data
    data.forEach((stu,index)=>{
        wb.Sheets['sheet1']['A'+(3+index)] = {v: stu.student_code}
        wb.Sheets['sheet1']['B'+(3+index)] = {v: stu.sName}
        wb.Sheets['sheet1']['C'+(3+index)] = {v: stu.cName}
        stu.scores.forEach((val,i)=>{
            wb.Sheets['sheet1'][String.fromCharCode(68+i)+(3+index)] = {v: val}
        })
        wb.Sheets['sheet1'][String.fromCharCode(68+times)+(3+index)] = {v: stu.sum}
        wb.Sheets['sheet1'][String.fromCharCode(68+times+1)+(3+index)] = {v: stu.questTime}
    })

    // 导出 Excel
    XLSX.writeFile(wb, './upload/output.xlsx');
}

module.exports = WriteXlsx