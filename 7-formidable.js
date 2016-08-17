
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