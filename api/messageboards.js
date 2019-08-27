'use-strict';

// 引入 mysql
const model = require('../server/model');
const APIError = require('../rest').APIError;
const func = require('./func')
let
    MessageBoards = model.MessageBoards,
    ReplyMessage = model.ReplyMessage;

// 普通用户  发布留言
var fn_addMessage = async(ctx, next) => {
    let
        userid = ctx.request.body.userid,
        username = ctx.request.body.username,
        avatar = ctx.request.body.avatar,
        content = ctx.request.body.content;
    var message = await MessageBoards.create({
        userid: userid,
        username: username,
        avatar: avatar,
        content: content
    })
    ctx.rest({
        isSuc: true,
        message: '发布成功',
        result: message
    })
}
// 管理用户  管理留言

// 查询所有留言
var fn_getMessages = async(ctx, next) => {
    let
        page = ctx.request.body.page,
        pagesize = ctx.request.body.pagesize;
    var messages = await MessageBoards.findAndCountAll({
        limit: Number(pagesize), // 限制返回结果条数
        offset: Number((pagesize * (page-1))),
        order: [
            ['createAt', 'DESC']
        ], // 查询排序
    })
    // 查询留言
    for (var val of messages.rows) {
        var reply_list = await ReplyMessage.findAll({
            where: {
                toid: val.id
            },
            order: [
                ['createAt', 'ASC']
            ]
        })
        val.dataValues.replyList = reply_list
    }
    ctx.rest({
        isSuc: true,
        message: '',
        result: messages.rows,
        totalcount: messages.count
    })
}

// 留言回复
var fn_replyMessage = async(ctx, next) => {
    let
        touserid = ctx.request.body.touserid,
        tousername = ctx.request.body.tousername,
        fromuserid = ctx.request.body.fromuserid,
        fromusername = ctx.request.body.fromusername,
        fromavatar = ctx.request.body.fromavatar,
        toid = ctx.request.body.toid,
        tovalue = ctx.request.body.tovalue;
    var reply_msg = await ReplyMessage.create({
        touserid: touserid,
        tousername: tousername,
        fromuserid: fromuserid,
        fromusername: fromusername,
        fromavatar: fromavatar,
        toid: toid,
        tovalue: tovalue
    })
    ctx.rest({
        isSuc: true,
        message: '回复成功',
        result: reply_msg
    })
}

module.exports = {
    // 发布留言
    'POST /api/addMessage': fn_addMessage,
    'POST /api/getMessages': fn_getMessages,
    'POST /api/replyMessage': fn_replyMessage
}