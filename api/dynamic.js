'use-strict';

// 引入 mysql
const model = require('../server/model');
const APIError = require('../rest').APIError;
const func = require('./func')
let
    Dynamic = model.Dynamic,
    DynamicComments = model.DynamicComments,
    Latest = model.Latest;

// 发动态
var fn_writeDynamic = async (ctx, next) => {
    let content = ctx.request.body.content;
    var dy = await Dynamic.create({
        content: content
    })
    ctx.rest({
        isSuc: true,
        message: '发布成功',
        result: content
    })
    await Latest.create({
        latestid: dy.id,
        author: '邓鹏',
        operation: '发布',
        icontype: '1',
        types: '动态',
        time: Date.now()
    })
}

// 删动态
var fn_delDynamic = async (ctx, next) => {
    let dyid = ctx.request.body.id
    var dy = await Dynamic.findAll({
        where: {
            id: dyid
        }
    })
    if (dy.length == 1) {
        for (var d of dy) {
            await d.destory()
        }
        ctx.rest({
            isSuc: true,
            message: '删除成功',
            result: ''
        })
    } else {
        ctx.rest({
            isSuc: false,
            message: '该信息已经被删除',
            result: ''
        })
    }
}

// 获取动态列表
var fn_getDyList = async (ctx, next) => {
    var dyList = await Dynamic.findAll()
    var newdyList = await dyList.sort(func.by('createAt'))
    // 获取评论
    // console.log(newdyList)
    for (var val of newdyList) {
        var dcList = await DynamicComments.findAll({
            where: {
                dynamicid: val.id
            }
        })
        console.log(val.id)
        var newdcList = await dcList.sort(func.by('createAt'))
        // 获取评论列表 并添加到当前评论
        val.dataValues.commentsList = newdcList
    }
    ctx.rest({
        isSuc: true,
        message: '获取成功',
        result: newdyList
    })
}

// 添加评论
var fn_addComments = async (ctx, next) => {
    var 
    dynamicid = ctx.request.body.dynamicid,
    userid = ctx.request.body.userid,
    username = ctx.request.body.username,
    touserid = ctx.request.body.touserid,
    tousername = ctx.request.body.tousername,
    comment = ctx.request.body.comment,
    isreply = ctx.request.body.isreply;
    if (!dynamicid) {
        throw new APIError(400, 'dynamicid参数错误！')
        return
    }
    if (!userid) {
        throw new APIError(400, 'userid参数错误！')
        return
    }
    if (!username) {
        throw new APIError(400, 'username参数错误！')
        return
    }
    if (!touserid) {
        throw new APIError(400, 'touserid参数错误！')
        return
    }
    if (!tousername) {
        throw new APIError(400, 'tousername参数错误！')
        return
    }
    if (!comment) {
        throw new APIError(400, 'comment内容不能为空！')
        return
    }
    await DynamicComments.create({
        dynamicid: dynamicid,
        userid: userid,
        username: username,
        touserid: touserid,
        tousername: tousername,
        comment: comment,
        isreply: isreply
    })
    ctx.rest({
        isSuc: true,
        message: '发布成功',
        result: {
            dynamicid: dynamicid,
            userid: userid,
            username: username,
            touserid: touserid,
            tousername: tousername,
            comment: comment,
            isreply: isreply
        }
    })
}

// 获取评论
var fn_getCommentsList = async (ctx, next) => {

}

module.exports = {
    // 写动态
    'POST /api/writeDynamic': fn_writeDynamic,
    // 删除动态
    'POST /api/delDynamic': fn_delDynamic,
    // 获取动态列表
    'GET /api/getDynamicList': fn_getDyList,
    // 添加评论
    'POST /api/addComments': fn_addComments
}