"use-strict";

// 引入 mysql
const model = require("../server/model");
const APIError = require("../rest").APIError;
const func = require("./func");
let Dynamic = model.Dynamic,
  DynamicComments = model.DynamicComments,
  Latest = model.Latest;

// 发动态
var fn_writeDynamic = async (ctx, next) => {
  let content = ctx.request.body.content;
  var dy = await Dynamic.create({
    content: content,
  });
  ctx.rest({
    isSuc: true,
    message: "发布成功",
    result: content,
  });
  await Latest.create({
    latestid: dy.id,
    author: "邓鹏",
    operation: "发布",
    icontype: "1",
    types: "动态",
    time: Date.now(),
  });
};

// 删动态
var fn_delDynamic = async (ctx, next) => {
  let dyid = ctx.request.body.id;
  var dy = await Dynamic.destroy({
    where: {
      id: dyid,
    },
  });
  if (dy) {
    ctx.rest({
      isSuc: true,
      message: "删除成功",
      result: "",
    });
  } else {
    ctx.rest({
      isSuc: false,
      message: "该信息已经被删除",
      result: "",
    });
  }
};

// 获取动态列表
var fn_getDyList = async (ctx, next) => {
  var dyList = await Dynamic.findAll();
  var page = ctx.query.page ? Number(ctx.query.page) : null;
  var size = ctx.query.size ? Number(ctx.query.size) : null;
  var newdyList = [];
  if (page && size) {
    if (dyList.length > 0) {
      var _dyList = await dyList.sort(func.by("createAt"));
      // 将数组 重新分组 按照你的size 分组
      const result = Array.apply(null, {
        length: Math.ceil(_dyList.length / size),
      }).map((x, i) => {
        return _dyList.slice(i * size, (i + 1) * size);
      });
      newdyList = result[page - 1];
    } else {
      ctx.rest({
        isSuc: false,
        message: "没有数据",
        result: [],
        total: 0,
      });
    }
  } else {
    newdyList = await dyList.sort(func.by("createAt"));
  }
  // 获取评论
  console.log("...newdyList:", newdyList);
  for (var val of newdyList) {
    var dcList = await DynamicComments.findAll({
      where: {
        dynamicid: val.id,
      },
    });
    var newdcList = await dcList.sort(func.by("createAt"));
    // 获取评论列表 并添加到当前评论
    val.dataValues.commentsList = newdcList;
  }
  ctx.rest({
    isSuc: true,
    message: "查询成功",
    result: newdyList,
    page: page,
    size: size,
    total: dyList.length,
  });
};

// 添加评论
var fn_addComments = async (ctx, next) => {
  var dynamicid = ctx.request.body.dynamicid,
    userid = ctx.request.body.userid,
    username = ctx.request.body.username,
    touserid = ctx.request.body.touserid,
    tousername = ctx.request.body.tousername,
    comment = ctx.request.body.comment,
    isreply = ctx.request.body.isreply;
  if (!dynamicid) {
    throw new APIError(400, "dynamicid参数错误！");
    return;
  }
  if (!userid) {
    throw new APIError(400, "userid参数错误！");
    return;
  }
  if (!username) {
    throw new APIError(400, "username参数错误！");
    return;
  }
  if (!touserid) {
    throw new APIError(400, "touserid参数错误！");
    return;
  }
  if (!tousername) {
    throw new APIError(400, "tousername参数错误！");
    return;
  }
  if (!comment) {
    throw new APIError(400, "comment内容不能为空！");
    return;
  }
  await DynamicComments.create({
    dynamicid: dynamicid,
    userid: userid,
    username: username,
    touserid: touserid,
    tousername: tousername,
    comment: comment,
    isreply: isreply,
  });
  ctx.rest({
    isSuc: true,
    message: "发布成功",
    result: {
      dynamicid: dynamicid,
      userid: userid,
      username: username,
      touserid: touserid,
      tousername: tousername,
      comment: comment,
      isreply: isreply,
    },
  });
};

// 获取评论
var fn_getCommentsList = async (ctx, next) => {};

module.exports = {
  // 写动态
  "POST /api/writeDynamic": fn_writeDynamic,
  // 删除动态
  "POST /api/delDynamic": fn_delDynamic,
  // 获取动态列表
  "GET /api/getDynamicList": fn_getDyList,
  // 添加评论
  "POST /api/addComments": fn_addComments,
};
