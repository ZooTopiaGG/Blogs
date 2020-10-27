"use-strict";

// 引入模块

const fs = require("fs");

// 封装   解析methods.js 里面的请求
const methodsMap = new Map([
  [{ startsWith: "GET ", charAt: 4 }],
  [{ startsWith: "DELETE ", charAt: 7 }],
  [{ startsWith: "PUT ", charAt: 4 }],
  [{ startsWith: "POST ", charAt: 5 }],
  [{ startsWith: "PATCH ", charAt: 6 }],
]);
// 解析 url路径 以及 获取 对象方法mapping
function addMapping(router, mapping) {
  // 遍历对象 object 用for...in mapping
  for (var url in mapping) {
    if (url.startsWith("GET ")) {
      let path = url.substring(4); // 剪掉 前4个字符
      router.get(path, mapping[url]);
      // console.log(`this path : ${path}, this mapping : ${mapping[url]}`)
    } else if (url.startsWith("POST ")) {
      let path = url.substring(5); // 剪掉 前5个字符
      router.post(path, mapping[url]);
    } else {
      console.log(`not found ${url}`);
    }
  }
}

function controllers(router, dir) {
  // 遍历 目录下所有的文件
  let files = fs.readdirSync(__dirname + "/" + dir);
  // console.log(files) // array [method.js] 入口文件
  // 找到所有js文件
  var jsFiles = files.filter((f) => {
    return f.endsWith(".js");
  }); // array
  // 处理每个js文件 完整路径
  for (var jf of jsFiles) {
    // 导入每个js 文件
    let mapping = require(__dirname + "/" + dir + "/" + jf);
    // console.log(`this mapping:${mapping}`)
    // 调用 addMapping()
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  let api_dir = dir || "api",
    router = require("koa-router")();
  controllers(router, api_dir);
  return router.routes(); // 返回前往app.js入口文件注册路由
};
