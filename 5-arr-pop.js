var arr = ['1','2','3','4'];
var arr2 = [];

for(var i=0;i<arr.length;i++){
    arr2[i] = arr[i];
}
arr2.pop(); // 去除数组最后一项
console.log(arr)
console.log(arr2)