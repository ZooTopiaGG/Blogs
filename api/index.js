// 入口文件
// 页面配置？？？？？？
// 基于后台页面跳转配置

module.exports = {
    'GET /': async (ctx, next) => {
        // ctx.render('mdtest.html'); // 配置首页
        ctx.render('articleList.html'); // 配置 配置首页 
        // ctx.render('writeArticle.html'); // 配置 添加 修改文章
        // ctx.render('writeDynamic.html'); // 配置 发布动态
    },
    // 服务跳转到更新页面
    'POST /api/toupdate' : async (ctx, next) => {
        let id = ctx.request.body.articleid;
        // console.log(id)
        ctx.render('writeArticle.html', {
            articleid: id
        }); 
    },
    // 服务跳转到更新页面
    'POST /api/toaddarticle' : async (ctx, next) => {
        ctx.render('writeArticle.html'); 
    },
    // 服务跳转到添加动态页面
    'POST /api/todynamic' : async (ctx, next) => {
        ctx.render('writeDynamic.html'); 
    },
    // 跳转到上传audio界
    'POST /api/toaddaudio': async (ctx, next) => {
        ctx.render('uploadAudio.html'); 
    }
};