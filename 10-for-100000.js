// 这个是 普通的 文件写的速度 ，需要十几秒，只能到 2044
// 看 ccc.txt
var fs = require('fs');

for(var i=0;i<100000;i++){
    // fs.appendFile('追加的文字'，'追加的内容'，fcDb(err))
    fs.appendFile('ccc.txt',i+'\n',function(err){})
    // 这个数 也只能 到 2044 了，因为在内存空间，它能站这么大
    // 而且速度 慢 ，需要十几秒
}
