// //by函数接受一个成员名字符串做为参数
// //并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
var func = {
    by: function(name){
        return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? 1 : -1; // 倒序
                }
                return typeof a < typeof b ? 1 : -1; // 倒序
            }
            else {
                throw ("error");
            }
        }
    },
    subQQstring: function (str) {
        let r1 = str.indexOf('[')
        let r2 = str.indexOf(']')
        let r = str.substring(r1, r2+1)
        let res =  eval('(' + r + ')')
        return res
    }
}

module.exports = func