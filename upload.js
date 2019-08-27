// 上传文件 js

const route = require('koa-route')
const serve = require('koa-static')
const inspect = require('util').inspect
const path = require('path')
const os = require('os')
const fs = require('fs')
const Busboy = require('busboy')
const qiniu = require('qiniu')

// 写入目录
const mkdirsSync = dirname => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
  return false
}

function getSuffix(fileName) {
  return fileName.split('.').pop()
}

// 重命名
function Rename(fileName) {
  return (
    Math.random()
      .toString(16)
      .substr(2) +
    '.' +
    getSuffix(fileName)
  )
}
// 删除文件
function removeTemImage(path) {
  fs.unlink(path, err => {
    if (err) {
      throw err
    }
  })
}

var qiniuConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'config.json'))
)
// 上传到七牛
function upToQiniu(filePath, key) {
  const accessKey = qiniuConfig.accessKey // 你的七牛的accessKey
  const secretKey = qiniuConfig.secretKey // 你的七牛的secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const bucket =
    key.indexOf('images/') > -1 ? qiniuConfig.bucket : qiniuConfig.bucket2
  const options = {
    scope: bucket // 你的七牛存储对象
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)

  const config = new qiniu.conf.Config()
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z0
  const localFile = filePath
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  // 文件上传
  return new Promise((resolved, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr)
      }
      // if (respInfo.statusCode == 200) {
      //   resolved(respBody)
      // } else {
      //   resolved(respBody)
      // }
      resolved(respBody)
    })
  })
}

// 上传到本地服务器
function uploadFile(ctx, options) {
  const _emmiter = new Busboy({ headers: ctx.req.headers })
  const fileType = options.fileType
  const filePath = path.join(options.path, fileType)
  const confirm = mkdirsSync(filePath)
  if (!confirm) {
    return
  }
  console.log('start uploading...')
  return new Promise((resolve, reject) => {
    _emmiter.on('file', function(
      fieldname,
      file,
      filename,
      encoding,
      mimetype
    ) {
      const fileName = Rename(filename)
      const saveTo = path.join(path.join(filePath, fileName))
      file.pipe(fs.createWriteStream(saveTo))
      file.on('end', function() {
        resolve({
          imgPath: `/${fileType}/${fileName}`,
          imgKey: fileName
        })
      })
    })

    _emmiter.on('finish', function() {
      console.log('finished...')
    })

    _emmiter.on('error', function(err) {
      console.log('err...')
      reject(err)
    })
    ctx.req.pipe(_emmiter)
  })
}

var uploadImg = function() {
  return route.post('/api/upload', async function(ctx, next) {
    // 本地
    const serverPath = path.join(__dirname, './static/web/')
    // 服务器
    // 获取上存图片
    const result = await uploadFile(ctx, {
      fileType: 'uploads',
      path: serverPath
    })

    const imgPath = path.join('./static/web/', result.imgPath)
    // 上传到七牛
    const qiniu = await upToQiniu(imgPath, `images/${result.imgKey}`)
    // 上存到七牛之后 删除原来的缓存图片
    removeTemImage(imgPath)
    ctx.body = {
      imgUrl: `${qiniuConfig.domain}${qiniu.key}`
    }
  })
}

var uploadAudio = function() {
  return route.post('/api/uploadAudio', async function(ctx, next) {
    // return 一个Function 出去
    // console.log(ctx.request)
    const serverPath = path.join(__dirname, './static/web/')
    // 获取上存audios
    const result = await uploadFile(ctx, {
      fileType: 'audios',
      path: serverPath
    })

    const imgPath = path.join('./static/web/', result.imgPath)
    // 上传到七牛
    const qiniu = await upToQiniu(imgPath, `videos/${result.imgKey}`)
    // 上存到七牛之后 删除原来的缓存图片
    removeTemImage(imgPath)
    ctx.body = {
      imgUrl: `${qiniuConfig.domain2}${qiniu.key}`
    }
  })
}

module.exports.uploadImg = uploadImg
module.exports.uploadAudio = uploadAudio
