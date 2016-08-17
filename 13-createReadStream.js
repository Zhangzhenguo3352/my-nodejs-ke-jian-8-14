// 读取流 读取文件
//这里用到了 Buffer.concat('执行完在数组里的内容')，起到了合并作用
var fs = require('fs');

var rs = fs.createReadStream('aaa.txt');

var arr=[];
rs.on('data',function(b){
    arr.push(b)  // 把文件读到的数据 放到 arr 数组中
});
rs.on('end',function(){ // 文件读 结束以后
    var buffer = Buffer.concat(arr); // buffer的格式 合并
    console.log(buffer.toString())   // utf-8 形式 呈现出来
})