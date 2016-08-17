// Array.from() 从那里拿一份数组，这种方法修改 互补影响
var arr = [1,2,3,4];
var arr2 = Array.from(arr);

arr2.pop();
console.log(arr)  // [ 1, 2, 3, 4 ]
console.log(arr2) // [ 1, 2, 3 ]