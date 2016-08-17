
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