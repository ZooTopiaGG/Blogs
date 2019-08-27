'use-strict';
// models 存放所有model

const db = require('../db');

module.exports = db.defineModel('latest', {
    id: {
        type: db.STRING(50),
        primaryKey: true
    }, // 第二个参数指定列名和数据类型，如果是主键，需要更详细地指定
    latestid: db.STRING(50), // 详情id
    author: db.STRING(45),
    operation: db.STRING(45),
    icontype: db.STRING(45),
    types: db.STRING(45),
    time: db.BIGINT(20)
});