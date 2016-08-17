# my-nodejs-ke-jian-8-14
```

var http = require('http');                        //  http 服务器
var fs = require('fs');                            // 文件相关操作
var urlLit = require('url');                       // 解析 get  用
var querystring = require('querystring');         // 解析 post 用
var EventEmitter = require('events').EventEmitter; // 深层次异步回调嵌套

var E = new EventEmitter;

http.createServer(function(req,res){
    //get数据
    req.get=urlLit.parse(req.url,true).query;
    req.url=urlLit.parse(req.url,true).pathname;

    E.emit('parse-post',req,res);
}).listen(8081);
E.on('parse-post',function(req,res){
    var str = '';
    req.on('data',function(s){
        str+=s;
    })
    req.on('end',function(){
        // 组装完的 利用 querystring 包装成为 json
        req.post = querystring.parse(str);

        //cookie 操作
        E.emit('parse-cookie',req,res);
    })
})
E.on('parse-cookie',function(req,res){
    //   写入 cookie
    req.cookie = querystring.parse(req.headers['cookie'],'; ')
    // 写完cookie 在对 session解析 和 判断
    E.emit('parse-session',req,res);
})
E.on('parse-session',function(req,res){
    if(!req.cookie.sessid){
        // session 里面脚本文件的名字
        req.cookie.sessid=''+Date.now()+Math.random();
    }

    fs.readFile('session/'+req.cookie.sessid,function(err,data){
        if(err){ // session 里面没有脚本
            req.session={};
        }else{  // session  里面有脚本文件  ， 就把json 对象转换字符串，在转成json 对象
            req.session=JSON.parse(data.toString());
        }

        //处理业务
        E.emit('buss-on',req,res);
    });
})
E.on('buss-on',function(req,res){
    // 客户点向 服务器 发送 cookie 设置
    res.setHeader('set-cookie','sessid'+req.cookie.sessid);
    var bool = E.emit(req.url,req,res); //有返回值 是否有人监听
    //console.log(bool) // false
    if(bool == false){
        // 读取 www 静态文件
        E.emit('read-www-fild',req,res);
    }
})
// 接口 - 访问的地方
E.on('/nav',function(req,res){
    res.write(JSON.stringify([
        {text:'首页',href:'/index.html'},
        {text:'公司简介',href:'/index.html'},
        {text:'产品展示',href:'/index.html'},
        {text:'联系我们',href:'/index.html'},
        {text:'关于我们',href:'/about.html'}
    ]));
    E.emit('write-session',req,res);
});

// nav-about
E.on('/nav-about',function(req,res){
    res.write(JSON.stringify([
        {text:'首页',href:'/index.html'},
        {text:'公司简介',href:'/index.html'},
        {text:'产品展示',href:'/index.html'},
        {text:'联系我们',href:'/index.html'},
        {text:'关于我们',href:'/about.html'}
    ]));
    E.emit('write-session',req,res);
});
E.on('read-www-fild',function(req,res){
    fs.readFile('www/'+req.url,function(err,data){
        if(err){
            // 文件没有读到
            res.writeHeader(404);
            res.write('404');
        }else{
            // 文件有 在页面显现
            res.write(data);
        }
        // 在 session文件中写脚本
        E.emit('write-session',req,res);
    })
})
E.on('write-session',function(req,res){
    // 写在 指定session下的脚本 文件 的内容
    fs.writeFile('session/'+req.cookie.sessid,JSON.stringify(req.session),function(err){
        // 客户端返回 停止 请求
        E.emit('end',req,res);
    })
})
E.on('end',function(req,res){
    res.end();
})
```
```

var buffer = new Buffer(3);
console.log(typeof buffer[3])
```
```
// 一个不错的组件，bufferSplit(buffer里面的东西，要在buffer里面查询的东西)

var buffer = new Buffer('width height background apple banana');

var arr = bufferSplit(buffer,' '); // 想实现 去除空格后 完整的数组

function bufferSplit(buffer,spliter) {
    var b=new Buffer(spliter);

    var arr=[];
    var start=0;
    var index=0;
    while((index=buffer.indexOf(b,start))!=-1){ //找到它所在位置都是几  5 12 23 29
        arr.push(buffer.slice(start,index));   //  一个一个 把单词放进去
        start=index+b.length;               // 开始位置确定在 找到空格前的所在位置,加上一个空格的长度，来跳过空格
    }
    arr.push(buffer.slice(start)); // 然后把 处理完的buffer 放在arr 数组中
    return arr;
}
console.log(arr.toString()) // 这里可以看到 我们可想要的
```
```
var arr = ['1','2','3','4'];
var arr2 = [];

for(var i=0;i<arr.length;i++){
    arr2[i] = arr[i];
}
arr2.pop(); // 去除数组最后一项
console.log(arr)
console.log(arr2)
```
```
// Array.from() 从那里拿一份数组，这种方法修改 互补影响
var arr = [1,2,3,4];
var arr2 = Array.from(arr);

arr2.pop();
console.log(arr)  // [ 1, 2, 3, 4 ]
console.log(arr2) // [ 1, 2, 3 ]
```
```

var http = require('http');
var formidable = require('formidable'); // 第一步，下载完了上传插件，引用
var path = require('path');
var fs = require('fs');

http.createServer(function(req,res){
    var form=new formidable.IncomingForm(); // 第二步 ，new 一个插件对象
    form.uploadDir = 'upload';              // 文件 上传目录为，但到这里文件上传的没有后缀
    form.multiples=true;                    // 上传两个文件时 和 变成数组形式存储，一个时和以前一样
    form.parse(req,function(err,fileds,files){ // 第三步
            //console.log(fileds,files) // 如果你上传多个文件，会发现上传文件的信息放在，数组中
	        //console.log(fileds); // fileds 表单的 name值。
	        //console.log(files.file1); // files.file1 是上传数据信息
            var arrFiles = files.file1;
            for(var i=0;i<arrFiles.length;i++){  // 当传了 两个文件才触发循环，因为不是两个文件，它不是数组
                var extname = path.extname(arrFiles[i].name) // 上传文件的后缀分别是什么
                //arrFiles[i].path  生成的文件 名字，  可以看  console.log(fileds,files) 中找
                fs.rename(arrFiles[i].path,arrFiles[i].path+extname,function(err){
                // 文件重命名fs.rename('命名前'，‘命名的名字’，fnDb(err))
                    console.log(err) // 一切已经完成
                })
            }
	});
}).listen(8081)
```
```
// 试试 以前的写入文件的方法，是OK 的
var fs = require('fs');

fs.writeFile('aaa.txt','writeFile写的东西',function(err){

})
```
```
// 创建一个写入流，写入文件 bbb.txt 里面
// 要知道的是  写入流  res,
var fs = require('fs');

var ws = fs.createWriteStream('bbb.txt'); // 创建写入流

ws.write("这里内容是 fs.createWriteStream('要写到那个文件')"); // 写入的内容

ws.end()  // 写入流  -》  res    这个是程序结束

ws.on('finish',function(){  // finish 流写入完毕 事件   这个是让我们看见结束
    console.log('真的写入完毕了')
})

```
```
// 这个是 普通的 文件写的速度 ，需要十几秒，只能到 2044
// 看 ccc.txt
var fs = require('fs');

for(var i=0;i<100000;i++){
    // fs.appendFile('追加的文字'，'追加的内容'，fcDb(err))
    fs.appendFile('ccc.txt',i+'\n',function(err){})
    // 这个数 也只能 到 2044 了，因为在内存空间，它能站这么大
    // 而且速度 慢 ，需要十几秒
}

```
```
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
```
```

var fs = require(fs);

fs.readFile('aaa.txt',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data)
    }
})
```
```
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
```
```
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
```
```
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

```
```
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
```
```
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
```
```

var http = require('http');
var fs = require('fs');
var zlib = require('zlib');

http.createServer(function(req,res){
    var gz = zlib.createGzip();                // 选择Gzip 压缩模式
    var rs = fs.createReadStream('ddd.txt');  // 流读取文件

    res.setHeader('content-encoding','gzip'); // 浏览器 头部声明 gzip压缩
    rs.pipe(gz).pipe(res);      // 文件 -》 压缩模式 -》 压缩完放到头部声明的压缩模式开始压缩
}).listen(8081)
```

