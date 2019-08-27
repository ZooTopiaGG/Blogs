'use-strict';
// models 存放所有model

const db = require('../db');

module.exports = db.defineModel('stat', {
    pv: db.BIGINT(200), // 总浏览量
    uv: db.BIGINT(200), // 总访客
    today_pv: db.BIGINT(200), // 今日浏览量
    today_uv: db.BIGINT(200), // 今日房客
});