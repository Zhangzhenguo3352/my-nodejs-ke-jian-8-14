// 读取流 没有读到文件 报错，不想 让它报错 怎么办
// error 事件, 就让它报个 404 把，程序继续运行
var fs = require('fs');

var rs = fs.createReadStream('aaaxxxxx.txt');

var arr = [];
rs.on('data',function(d){
    arr.push(d);
})
rs.on('end',function(){
    var buffer = Buffer.concat(arr)
    console.log(buffer.toString())
})

rs.on('error',function(){ //这个页面 看这里 ，找不到这个页面 就走这里
    console.log('404')
})