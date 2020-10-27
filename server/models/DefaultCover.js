"use-strict";

const db = require("../db");

// 第二步，定义模型DynamicComments，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel("defaultcover", {
  id: {
    type: db.BIGINT(50),
    primaryKey: true,
  }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
  url: db.STRING(200),
  name: db.STRING(45),
});
