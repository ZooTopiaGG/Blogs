'use-strict'
const db = require('../db')

// 第二步，定义模型audio，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('demo', {
  id: {
    type: db.STRING(50),
    primaryKey: true
  }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
  url: db.STRING(500), // audio url
  title: db.STRING(500), // audio song,
  desc: db.STRING(500), // audio singer,
  viewcount: db.STRING(1000000) // 阅读量
})
