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