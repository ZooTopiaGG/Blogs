'use-strict';


const db = require('../db');

// 第二步，定义模型Pet，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('dynamic', {
    id: {
        type: db.STRING(50),
        // primaryKey: true
    }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
    content: db.STRING(100000) // 内容
});