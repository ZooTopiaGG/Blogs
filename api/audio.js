"use-strict";

// 引入 mysql
const model = require("../server/model");
const APIError = require("../rest").APIError;
const func = require("./func");
let Audio = model.Audio,
  Latest = model.Latest;

// 添加歌曲
var fn_addAudio = async (ctx, next) => {
  let url = ctx.request.body.url,
    singername = ctx.request.body.singername,
    songname = ctx.request.body.songname;
  var dy = await Audio.create({
    url: url,
    songname: songname,
    singername: singername,
  });
  ctx.rest({
    isSuc: true,
    message: "添加成功",
    result: "",
  });
  await Latest.create({
    latestid: dy.id,
    author: "邓鹏",
    operation: "增加",
    icontype: "2",
    types: "音乐",
    time: Date.now(),
  });
};
// 查询歌曲
var fn_getAudioList = async (ctx, next) => {
  let size = ctx.request.body.size;
  let page = ctx.request.body.page;
  let AudioList = await Audio.findAll({
    order: [["createAt", "DESC"]],
  });
  const result = Array.apply(null, {
    length: Math.ceil(AudioList.length / size),
  }).map((x, i) => {
    return AudioList.slice(i * size, (i + 1) * size);
  });
  ctx.rest({
    isSuc: true,
    message: "获取成功",
    result: result[page - 1],
    total: AudioList.length,
  });
};

var fn_delAudioList = async (ctx, next) => {
  const audioSelf = await Audio.destroy({
    where: {
      id: ctx.params.id,
    },
  });
  if (audioSelf) {
    ctx.rest({
      isSuc: true,
      message: "删除成功",
      result: ctx.params.id,
    });
  } else {
    ctx.rest({
      isSuc: false,
      message: "该数据已经被删除",
      result: null,
    });
  }
};

module.exports = {
  // 添加audio
  "POST /api/addAudio": fn_addAudio,
  // 查询audio
  "POST /api/getAudioList": fn_getAudioList,

  "GET /api/deleteAudio/:id": fn_delAudioList,
};
