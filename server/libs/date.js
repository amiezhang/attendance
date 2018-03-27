function fix2number(n) {  
    return [0,n].join('').slice(-2);  
}  
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

module.exports = getTime