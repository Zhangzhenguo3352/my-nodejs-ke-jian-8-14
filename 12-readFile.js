
var fs = require(fs);

fs.readFile('aaa.txt',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data)
    }
})