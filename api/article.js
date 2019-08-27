'use-strict'

// 引入 mysql
const model = require('../server/model')
const APIError = require('../rest').APIError
const func = require('./func')
let Article = model.Article,
  Latest = model.Latest

// 编辑 文档  提交 插入
var fn_postHtml = async (ctx, next) => {
  // console.log(ctx.request.body.content)
  let con = ctx.request.body.content
  // let con = decodeURIComponent(ctx.request.body.content)
  let title = ctx.request.body.title
  let type = ctx.request.body.type
  let desc = ctx.request.body.desc
  let smallimg = ctx.request.body.smallimg
  let columntype = ctx.request.body.columntype
  // console.log(con)
  if (con === '') {
    throw new APIError('400', '文档编辑不能为空！')
    return
  }
  var html = await Article.create({
    title: title,
    content: con,
    type: type,
    desc: desc,
    smallimg: smallimg,
    columntype: columntype,
    viewcount: 0
  })
  // console.log('created: ' + JSON.stringify(html))
  // console.log('插入成功')
  await ctx.rest({
    isSuc: true,
    message: '提交成功',
    result: html
  })
  // console.log(html.columntype)
  let columntypes = ctx.request.body.columntype == 1 ? '技术' : '文章',
    icontype = ctx.request.body.columntype == 1 ? '4' : '0'
  await Latest.create({
    latestid: html.id,
    author: '邓鹏',
    operation: '增加',
    icontype: icontype,
    types: columntypes,
    time: Date.now()
  })
}

// 获取文章列表
var fn_getHtml = async (ctx, next) => {
  let page = ctx.request.body.page
  let size = ctx.request.body.size
  let columntype = ctx.request.body.columntype
  if (columntype == '-1') {
    var html = await Article.findAll() // 查询全部
  } else {
    var html = await Article.findAll({
      where: {
        columntype: columntype
      }
    }) // 按类型查询
  }
  // console.log(html)
  if (html.length > 0) {
    var newhtml = await html.sort(func.by('updateAt'))
    // 将数组 重新分组 按照你的size 分组
    const result = Array.apply(null, {
      length: Math.ceil(newhtml.length / size)
    }).map((x, i) => {
      return newhtml.slice(i * size, (i + 1) * size)
    })
    ctx.rest({
      isSuc: true,
      message: '查询成功',
      result: result[page - 1],
      page: page,
      size: size,
      total: newhtml.length
    })
  } else {
    ctx.rest({
      isSuc: false,
      message: '没有数据',
      result: {},
      total: 0
    })
  }
}

// 通过id 获取文章内容
var fn_getHtmlByid = async (ctx, next) => {
  // console.log(ctx.params.articleid) // GET 用params  POST 用body
  let html = await Article.findAll({
    // 返回查询数组
    where: {
      id: ctx.params.articleid
    }
  })
  if (html.length == 1) {
    // 结果必须唯一
    for (var a of html) {
      a.viewcount++ // 浏览次数+1
      await a.save()
      ctx.rest({
        isSuc: true,
        message: '查询成功',
        result: a
      })
    }
  } else {
    APIError(500, '系统错误')
  }
}

// 更新文档内容
var fn_updateHtmlByid = async (ctx, next) => {
  // console.log(ctx.request.body.articleid)
  let html = await Article.findAll({
    where: {
      id: ctx.request.body.articleid
    }
  })
  for (var a of html) {
    a.title = ctx.request.body.title
    a.desc = ctx.request.body.desc
    a.content = ctx.request.body.content
    a.type = ctx.request.body.type
    a.smallimg = ctx.request.body.smallimg
    a.columntype = ctx.request.body.columntype
    a.updateAt = Date.now()
    await a.save()
    ctx.rest({
      // {} 类似 返回的json字符串
      isSuc: true,
      message: '修改成功',
      result: html[0]
    })
  }
  let columntypes = ctx.request.body.columntype == 1 ? '技术' : '文章',
    icontype = ctx.request.body.columntype == 1 ? '4' : '0'
  await Latest.create({
    latestid: ctx.request.body.articleid,
    author: '邓鹏',
    operation: '更新',
    icontype: icontype,
    types: columntypes,
    time: Date.now()
  })
}

module.exports = {
  // 写文章
  'POST /api/writeArticle': fn_postHtml,
  // 获取文章信息
  'POST /api/getArticle': fn_getHtml,
  // 通过id获取文章信息
  'GET /api/getArticle/:articleid': fn_getHtmlByid,
  // 更新文章信息
  'POST /api/updateArticle': fn_updateHtmlByid
}
