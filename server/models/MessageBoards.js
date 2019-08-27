'use-strict';


const db = require('../db');

// 第二步，定义模型DynamicComments，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('messageboards', {
    messageid:{ //自增长id,主键,整形
        type:db.BIGINT(20),
        primaryKey: true,
        autoIncrement:true
    },
    userid: db.STRING(50),
    username: db.STRING(50),
    avatar: db.STRING(200),
    content: db.STRING(100000)
});