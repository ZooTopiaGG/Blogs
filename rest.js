"use-strict";

// 暴露rest api

module.exports = {
  // 处理调用接口 报错 返回
  APIError: function (code, message) {
    this.code = code || "internal:unknown_error";
    this.message = message || "";
  },
  restify: (pathPrefix) => {
    // 可以添加版本控制 比如 /api/v1/    /api/v2/ 避免长期更换接口导致用户不满意
    pathPrefix = pathPrefix || "/api/";
    return async (ctx, next) => {
      // console.log(`ctx.process api:, ${ctx.request.path.endsWith('login')}`)
      if (ctx.request.path.startsWith(pathPrefix)) {
        console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
        ctx.rest = (data) => {
          console.log("data:", data);
          ctx.response.type = "application/json";
          ctx.response.body = data;
        };
        try {
          await next();
        } catch (e) {
          console.log("Process API error...", e);
          ctx.response.status = 400;
          ctx.response.type = "application/json";
          ctx.response.body = {
            code: e.code || "internal:unknown_error",
            message: e.message || "",
          };
        }
      } else {
        await next();
      }
    };
  },
};
