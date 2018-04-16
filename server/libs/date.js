//数字格式化，不足2位前面加0
function fix2number(n) {  
    return [0,n].join('').slice(-2);  
}
//当前时间格式话 例如getTime('Y-m-d H:i:s')返回2018-04-01
function getTime(format) {  
    var curDate = new Date();  
    if (format == undefined) return curDate;  
    format = format.replace(/Y/i, curDate.getFullYear());  
    format = format.replace(/m/i, fix2number(curDate.getMonth() + 1));  
    format = format.replace(/d/i, fix2number(curDate.getDate()));  
    format = format.replace(/H/i, fix2number(curDate.getHours()));  
    format = format.replace(/i/i, fix2number(curDate.getMinutes()));  
    format = format.replace(/s/i, fix2number(curDate.getSeconds()));  
    format = format.replace(/ms/i, curDate.getMilliseconds());  
    return format;  
}  
//导出getTime函数
module.exports = getTime