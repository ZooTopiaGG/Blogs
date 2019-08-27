'use-strict';


const db = require('../db');

// 第二步，定义模型DynamicComments，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('dynamiccomments', {
    dynamicid: db.STRING(50),
    userid: db.STRING(50),
    username: db.STRING(100),
    touserid: db.STRING(50),
    tousername: db.STRING(100),
    comment: db.STRING(100000),
    isreply: db.STRING(10)
});
