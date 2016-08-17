// 读写流 错时 ，不会影响程序
var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
    var rs=fs.createReadStream(req.url.substring(1));

    rs.pipe(res);
    rs.on('error',function(){  //看这里 不会影响程序
        res.writeHead(404);
        res.end('404');
    });
}).listen(8081)