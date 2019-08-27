'use-strict';
// 解析静态文件

const path = require('path')
// mime@2.x 最新版本已经抛弃mime.lookup()方法 查询type ，请使用 mime@1.3.4
const mime = require('mime') 
const fs = require('mz/fs')

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'

function staticFile (url, dir) {
    // console.log(url)
    // console.log(dir)
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        // 判断是否以指定的url开头:
        if (rpath.startsWith(url)) {
            // 获取文件完整路径:
            let fp = path.join(dir, rpath.substring(url.length))
            // console.log(fp)
            // 判断文件是否存在:
            // console.log(fs.exists(fp))
            if (await fs.exists(fp)) {
                // console.log(mime)
                // 查找文件的mime:
                ctx.response.type = mime.lookup(rpath)
                // 读取文件内容并赋值给response.body:
                ctx.response.body = await fs.readFile(fp)
            } else {
                // console.log(222222)
                // 文件不存在:
                ctx.response.status = 404
            }
        } else {
            // 不是指定前缀的URL，继续处理下一个middleware:
            await next()
        }
    }
}

module.exports = staticFile