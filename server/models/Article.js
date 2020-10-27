"use-strict";

const db = require("../db");

// 第二步，定义模型Article，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel("article", {
  id: {
    type: db.STRING(50),
    primaryKey: true,
  }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
  content: db.TEXT("medium"), // 内容
  columntype: db.STRING(100), // 栏目类型 0：文章 1：技术
  title: db.STRING(100), // 标题
  type: db.STRING(10), // 原创 或者 转载
  desc: db.STRING(600), // 描述
  smallimg: db.STRING(200), // 缩略图
  viewcount: db.STRING(1000000), // 阅读量
});
