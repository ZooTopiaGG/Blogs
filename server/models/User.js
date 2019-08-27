'use-strict';
// models 存放所有model

const db = require('../db');

module.exports = db.defineModel('users', {
    email: {
        type: db.STRING(100),
        unique: true
    }, // 邮箱
    passwd: db.STRING(100), // 密码
    name: db.STRING(100), // 姓名
    gender: db.BOOLEAN, // 性别
    avatar: db.STRING(100), // 头像
    company: db.STRING(50), // 公司名称
    borndate: db.STRING(45), // 出生日期
    site: db.STRING(100), // 个人网站
    desc: db.STRING(100), // 个人介绍
});