'use-strict';


const db = require('../db');

// 第二步，定义模型DynamicComments，告诉Sequelize如何映射数据库表：

module.exports = db.defineModel('replymessage', {
    toid: db.STRING(50),
    fromuserid: db.STRING(50),
    fromusername: db.STRING(50),
    fromavatar:db.STRING(200),
    touserid: db.STRING(50),
    tousername: db.STRING(50),
    tovalue: db.STRING(100000)
});
