 // 用流 好处 太多了，，快 而且 创建出来的多 ，结果 999999
var fs = require('fs');

var ws = fs.createWriteStream('ddd.txt');
for(var i=0;i<1000000;i++){
    ws.write(i+'\n');
}
ws.end();

ws.on('finish',function(){
    console.log('真的写完了')
})