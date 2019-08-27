'use-strict'

// 引入 mysql
const model = require('../server/model')
const APIError = require('../rest').APIError
let Demo = model.Demo

// 查询demoList
var fn_getDemoList = async (ctx, next) => {
  let size = ctx.request.body.size || 1
  let page = ctx.request.body.page || 10
  let DemoList = await Demo.findAll({
    order: [['createAt', 'DESC']]
  })
  const result = Array.apply(null, {
    length: Math.ceil(DemoList.length / size)
  }).map((x, i) => {
    return DemoList.slice(i * size, (i + 1) * size)
  })
  ctx.rest({
    isSuc: true,
    message: '获取成功',
    result: result[page - 1],
    total_count: DemoList.length
  })
}

// 查询demo by id
var fn_getDemoById = async (ctx, next) => {
  let id = ctx.params.demoid
  if (id == '' || id == null || id == 'undefined') {
    APIError(400, '参数错误')
  }
  let html = await Demo.findAll({
    where: {
      id
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

module.exports = {
  // 查询audio
  'POST /api/getDemoList': fn_getDemoList,
  'GET /api/getDemoById/:demoid': fn_getDemoById
}
