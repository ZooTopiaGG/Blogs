"use-strict";

// 引入 mysql
const model = require("../server/model");
const APIError = require("../rest").APIError;
const func = require("./func");
let User = model.User,
  Article = model.Article,
  Dynamic = model.Dynamic,
  DynamicComments = model.DynamicComments,
  PersonAlbum = model.PersonAlbum,
  Latest = model.Latest,
  ApplyFriends = model.ApplyFriends,
  Stat = model.Stat,
  MessageBoards = model.MessageBoards,
  Audio = model.Audio,
  DefaultCover = model.DefaultCover;

var fn_getQQMusic = async (ctx, next) => {
  // 获取QQ音乐 歌单
  // getqqs
  let size = ctx.request.body.size;
  let page = ctx.request.body.page;

  let res = await func.subQQstring(qq_result);
  res.forEach((val) => {
    val.url = "http://ws.stream.qqmusic.qq.com/" + val.id + ".m4a?fromtag=46";
  });
  const result = Array.apply(null, {
    length: Math.ceil(res.length / size),
  }).map((x, i) => {
    return res.slice(i * size, (i + 1) * size);
  });
  // console.log(qq_result)
  ctx.rest({
    isSuc: true,
    message: "获取成功",
    result: result[page - 1],
    total_count: res.length,
  });
};

//
var schedule = require("node-schedule");

function scheduleCronstyle() {
  schedule.scheduleJob("0 0 0 * * *", function () {
    clearPvandUv();
  });
}

// 每日清零pv uv
async function clearPvandUv() {
  let num = await Stat.findAll();
  for (var n of num) {
    n.today_pv = 0;
    n.today_uv = 0;
    await n.save();
  }
}
scheduleCronstyle();

// 防抖函数
var fn_setStatistics = async (ctx, next) => {
  let visitor_num = await Stat.findAll();
  for (var n of visitor_num) {
    n.pv += 1;
    n.uv += 1;
    n.today_pv += 1;
    n.today_uv += 1;
    console.log(n.today_pv);
    await n.save();
  }
  ctx.rest({
    isSuc: true,
    message: "",
    result: { n },
  });
};
// 站长统计 数量
var fn_getStatistics = async (ctx, next) => {
  // 获取文章，动态，技术，评论，留言，用户，歌曲，图片，浏览数量
  let article_num = await Article.findAndCountAll();
  let dynamic_num = await Dynamic.findAndCountAll();
  let comment_num = await DynamicComments.findAndCountAll();
  let user_num = await User.findAndCountAll();
  let audio_num = await Audio.findAndCountAll();
  let message_num = await MessageBoards.findAndCountAll();
  // 查询浏览量
  let visitor_num = await Stat.findAll();
  ctx.rest({
    // {} 类似 返回的json字符串
    isSuc: true,
    message: "获取成功",
    result: {
      user_num: user_num.count + 33,
      article_num: article_num.count,
      dynamic_num: dynamic_num.count,
      comment_num: comment_num.count,
      audio_num: audio_num.count,
      message_num: message_num.count,
      visitor_num: visitor_num[0].pv,
      today_pv: visitor_num[0].today_pv,
      today_uv: visitor_num[0].today_uv,
    },
  });
};
// 获取最新动态
var fn_getLatestNews = async (ctx, next) => {
  let latest_list = await Latest.findAll({
    order: [["time", "DESC"]], // 查询排序
    limit: 3, // 限制返回结果条数
  });
  ctx.rest({
    isSuc: true,
    message: "获取成功",
    result: latest_list,
  });
};

// 获取最新文章
var fn_getLatestArticles = async (ctx, next) => {
  let page = ctx.request.body.page,
    pagesize = ctx.request.body.pagesize,
    article_list = await Article.findAndCountAll({
      limit: Number(pagesize),
      offset: Number(pagesize * (page - 1)),
      order: [["updateAt", "DESC"]], // 查询排序
    });
  ctx.rest({
    isSuc: true,
    message: "",
    result: article_list.rows,
    totalcount: article_list.count,
  });
};

// 获取图片
var fn_getPersonAlbum = async (ctx, next) => {
  let page = ctx.request.body.page,
    size = ctx.request.body.size,
    albumtype = ctx.request.body.albumtype;
  if (albumtype == "-1") {
    var album_list = await PersonAlbum.findAll(); // 查询全部
  } else {
    var album_list = await PersonAlbum.findAll({
      where: {
        type: albumtype,
      },
    }); // 按类型查询
  }
  // let album_list = await PersonAlbum.findAll()
  // console.log(album_list)
  if (album_list.length > 0) {
    // var new_album_list = await album_list.sort(func.by('updateAt'))
    var new_album_list = await album_list.reverse();
    // 将数组 重新分组 按照你的size 分组
    const result = Array.apply(null, {
      length: Math.ceil(new_album_list.length / size),
    }).map((x, i) => {
      return new_album_list.slice(i * size, (i + 1) * size);
    });
    ctx.rest({
      isSuc: true,
      message: "查询成功",
      result: result[page - 1],
      page: page,
      size: size,
      total: new_album_list.length,
    });
  } else {
    ctx.rest({
      isSuc: false,
      message: "没有数据",
      result: {},
      total: 0,
    });
  }
};

// 申请友链
var fn_applyFriendsLink = async (ctx, next) => {
  var data = await ApplyFriends.create({
    webname: webname,
    website: website,
    email: email,
  });
  ctx.rest({
    isSuc: true,
    message: "申请成功，请耐心等待！",
    result: data,
  });
};

// 文章发布默认封面
var fn_defaultCover = async (ctx, next) => {
  let coverList = await DefaultCover.findAll();
  ctx.rest({
    isSuc: true,
    message: "操作成功",
    result: coverList,
  });
};

// 导出 模块函数
module.exports = {
  // 获取QQ音乐列表
  "POST /api/getQQMusic": fn_getQQMusic,
  "GET /api/getStatistics": fn_getStatistics,
  "POST /api/getPersonAlbum": fn_getPersonAlbum,
  "GET /api/getLatestNews": fn_getLatestNews,
  "POST /api/applyFriendsLink": fn_applyFriendsLink,
  "POST /api/getLatestArticles": fn_getLatestArticles,
  "POST /api/statistics": fn_setStatistics,
  "GET /api/defaultCover": fn_defaultCover,
};
