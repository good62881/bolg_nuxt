

module.exports=function(app){

//用户表控制文件
var page=require('../controllers/page');


//获取文章
app.post('/Api/getArticleList',page.getArticleList);
app.post('/Api/getArticleDetail',page.getArticleDetail);

//获取个人信息
app.post('/Api/getInfo',page.getInfo);


//获取图片
app.post('/Api/getPictureList',page.getPictureList);
app.post('/Api/getPicture',page.getPicture);




}