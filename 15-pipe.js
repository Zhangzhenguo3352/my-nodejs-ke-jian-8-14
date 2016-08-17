// 这个页面 (读取aaa.txt文件  通过管道  写入bbb.txt)

var fs = require('fs');

var rs = fs.createReadStream('aaa.txt');
var ws = fs.createWriteStream('bbb.txt');

// 源头.pipe(目标)
// 读取.pipe(写入)
rs.pipe(ws);

ws.on('finish',function(){  // 读写流，完毕
    console.log('管道流入完毕')
})
