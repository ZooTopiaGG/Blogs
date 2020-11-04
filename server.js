"use-strict";
// 引入模块
const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

// 引入跨域模块
const cors = require("koa2-cors");
// 引入 controller.js
const controller = require("./controller.js");
const templating = require("./template.js");
const rest = require("./rest.js");
const upload = require("./upload.js");
// console.log(upload.uploadAudio())

const app = new Koa();
const isProduction = process.env.NODE_ENV === "production";
console.log("isProduction:", isProduction);
// 一切顺利的话，这个view-koa工程应该可以顺利运行。运行前，我们再检查一下app.js里的middleware的顺序：

// 1 第一个middleware是记录URL以及页面执行时间：
// app.use(async (ctx, next) => {
//   console.log(ctx)
//   await next()
// })

// 处理跨域
app.use(
  cors({
    origin: function (ctx) {
      // console.log(ctx.request.origin)
      if (ctx.url.indexOf("/api") > -1) {
        return "*"; // 允许来自所有域名请求
      }
      // 本地
      return isProduction ? "https://www.55lover.com" : "http://localhost:3333"; // 这样就能只允许 http://localhost:8080 这个域名的
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

//2 类似 绑定 静态资源文件  css  js 等
// if (!isProduction) {
let staticFiles = require("./static.js");
app.use(staticFiles("/static/web/", __dirname + "/static/web"));
app.use(staticFiles("/static/", __dirname + "/static"));
// }

// 上传图片
app.use(upload.uploadImg()); // app.use(Function) 接收function
app.use(upload.uploadAudio()); // app.use(Function) 接收function

//4 post 请求 必须引用
app.use(bodyparser());

//5 类似 绑定 nunjucks
app.use(
  templating("views", {
    noCache: !isProduction,
    watch: !isProduction,
  })
);
//3 bind .rest() for ctx:
app.use(rest.restify());

//6 注册路由
app.use(controller());

//7 监听端口
app.listen(8088);
console.log("server is running at http://localhost:8088");
