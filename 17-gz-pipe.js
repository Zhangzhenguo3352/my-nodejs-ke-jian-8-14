// 这个页面讲了 一个文件 压缩成 一个文件的过程, 生成了ddd.txt.gz 压缩文件
var http = require('http');
var fs = require('fs');     // 为 流 准备食物
var zlib = require('zlib'); //    1，选择压缩模式准备的

http.createServer(function(req,res){
    var gz = zlib.createGzip();  //,2  选择 Gzip 压缩模式
    var rs = fs.createReadStream('ddd.txt'); // 3
    var ws = fs.createWriteStream('ddd.txt.gz'); // 4
    // 读取 .pipe(流入Gzip压缩).pipe(写入ddd.txt.zg 压缩文件)
    rs.pipe(gz).pipe(ws);   // 5
    res.end()
}).listen(8081)