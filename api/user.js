'use-strict'

// 引入 mysql
const model = require('../server/model')
const APIError = require('../rest').APIError
let User = model.User

// 登录
var fn_login = async (ctx, next) => {
  var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  //  查询数据库 findAll
  if (reg.test(ctx.request.body.name)) {
    var user = await User.findAll({
      where: {
        email: ctx.request.body.name
      }
    })
  } else {
    var user = await User.findAll({
      where: {
        name: ctx.request.body.name
      }
    })
  }
  // console.log(`this user is: ${user.length} by find`)
  if (user.length > 0) {
    // 查询到了
    // console.log(`looklooklook:${JSON.stringify(user)}`)
    for (var u of user) {
      // user 为一个数组 必须 循环取数据
      // let ge = u.gender ? '男' : '女';
      if (u.passwd == ctx.request.body.password) {
        ctx.rest({
          // {} 类似 返回的json字符串
          isSuc: true,
          message: '登录成功',
          result: u
        })
      } else {
        console.log('用户名密码不对')
        throw new APIError('400', '用户名密码不对')
      }
    }
  } else {
    // 没有该用户
    console.log('用户不存在')
    throw new APIError('400', '用户不存在')
  }
}

var fn_signout = async (ctx, next) => {
  ctx.rest({
    isSuc: true,
    message: '操作成功',
    result: true
  })
}

// 注册接口  插入信息
var fn_signup = async (ctx, next) => {
  if (ctx.request.body.name == '') {
    console.log(`姓名不能为空`)
    throw new APIError('400', '姓名不能为空')
    return
  }
  if (ctx.request.body.email == '') {
    console.log('邮箱不能为空')
    throw new APIError('400', '邮箱不能为空')
    return
  }
  if (ctx.request.body.password == '') {
    console.log('密码不能为空')
    throw new APIError('400', '密码不能为空')
    return
  }
  if (ctx.request.body.password != ctx.request.body.password1) {
    console.log('两次密码输入不一致')
    throw new APIError('400', '两次密码输入不一致')
    return
  }
  if (ctx.request.body.gender == '') {
    console.log('性别不能为空')
    throw new APIError('400', '性别不能为空')
    return
  }
  let gender = ctx.request.body.gender == '男' ? true : false

  // 用户名验证
  var nuser = await User.findAll({
    where: {
      name: ctx.request.body.name
    }
  })
  if (nuser.length == 1) {
    console.log('注册用户名已经存在！')
    throw new APIError('400', '注册用户名已经存在！')
    return
  }

  // 先查询在插入  邮箱验证
  var nemail = await User.findAll({
    where: {
      email: ctx.request.body.email
    }
  })
  if (nemail.length == 1) {
    console.log('注册邮箱已经存在！')
    throw new APIError('400', '注册邮箱已经存在！')
    return
  }

  // 插入数据
  var user = await User.create({
    name: ctx.request.body.name,
    gender: gender,
    email: ctx.request.body.email,
    passwd: ctx.request.body.password,
    avatar: ctx.request.body.avatar,
    company: '',
    borndate: '',
    site: '',
    desc: ''
  })
  // console.log('created: ' + JSON.stringify(user))
  // console.log('插入成功')
  ctx.rest({
    isSuc: true,
    message: '注册成功',
    result: user[0]
  })
}

// 查询信息
var fn_getInfo = async (ctx, next) => {
  var userInfo = await User.findOne({
    // 一条信息  find 多条信息 findAll
    where: {
      id: ctx.params.id
    }
  })
  ctx.rest({
    // {} 类似 返回的json字符串
    isSuc: true,
    message: '查询成功',
    result: userInfo
  })
}

// 修改信息
var fn_updateInfo = async (ctx, next) => {
  let html = await User.findAll({
    where: {
      id: ctx.request.body.id
    }
  })
  for (var a of html) {
    a.avatar = ctx.request.body.avatar
    a.desc = ctx.request.body.desc
    a.company = ctx.request.body.company
    a.gender = ctx.request.body.gender
    a.site = ctx.request.body.site
    a.borndate = ctx.request.body.borndate
    a.updateAt = Date.now()
    await a.save()
    ctx.rest({
      // {} 类似 返回的json字符串
      isSuc: true,
      message: '修改成功',
      result: html[0]
    })
  }
}

module.exports = {
  // 登录
  'POST /api/login': fn_login,
  // 注册
  'POST /api/signup': fn_signup,
  // 查询信息
  'GET /api/getInfo/:id': fn_getInfo,
  // 退出登录
  'GET /api/signout': fn_signout,
  // 修改信息
  'POST /api/updateInfo': fn_updateInfo
}
