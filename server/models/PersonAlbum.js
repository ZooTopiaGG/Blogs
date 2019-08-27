'use-strict';


const db = require('../db');

// 第二步，定义模型Article，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('personalbum', {
    id: {
        primaryKey: true
    }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
    personsrc: db.STRING(100), // 图片地址
    type: db.STRING(100), // 原创 或者 转载
});