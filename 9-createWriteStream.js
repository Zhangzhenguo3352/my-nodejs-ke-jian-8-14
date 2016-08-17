// 创建一个写入流，写入文件 bbb.txt 里面
// 要知道的是  写入流  res,
var fs = require('fs');

var ws = fs.createWriteStream('bbb.txt'); // 创建写入流

ws.write("这里内容是 fs.createWriteStream('要写到那个文件')"); // 写入的内容

ws.end()  // 写入流  -》  res    这个是程序结束

ws.on('finish',function(){  // finish 流写入完毕 事件   这个是让我们看见结束
    console.log('真的写入完毕了')
})
