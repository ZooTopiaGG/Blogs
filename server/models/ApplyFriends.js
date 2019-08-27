'use-strict';


const db = require('../db');

// 第二步，定义模型DynamicComments，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('applyfriends', {
    webname: db.STRING(100),
    website: db.STRING(100),
    email: db.STRING(100)
});