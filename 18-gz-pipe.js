
var http = require('http');
var fs = require('fs');
var zlib = require('zlib');

http.createServer(function(req,res){
    var gz = zlib.createGzip();                // 选择Gzip 压缩模式
    var rs = fs.createReadStream('ddd.txt');  // 流读取文件

    res.setHeader('content-encoding','gzip'); // 浏览器 头部声明 gzip压缩
    rs.pipe(gz).pipe(res);      // 文件 -》 压缩模式 -》 压缩完放到头部声明的压缩模式开始压缩
}).listen(8081)