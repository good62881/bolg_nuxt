

module.exports=function(app){

//用户表控制文件
var user=require('../controllers/user');

//登录
app.post('/adminApi/login',user.login);
//app.post('/adminApi/reg',user.reg);

//api的拦截写在login后面，排除掉login
app.all('/adminApi/*',function(req,res,next){   
	if(req.session.user){
		next();
	}else{
		res.send({code:-1,msg:'登录异常，请重新登录！'});
	}
});

//获取个人信息
app.post('/adminApi/getInfo',function(req,res){
	res.send({code:0,data:JSON.parse(JSON.stringify(req.session.user,['name','age','job','email','avatar'])),msg:''});
});

//退出登录
app.post('/adminApi/out',function(req, res){
	req.session.destroy(function(){
		res.send({code:-1,msg:''});
	});
});


// --------------账户设置
app.post('/adminApi/editInfo',user.editInfo);
app.post('/adminApi/editPass',user.editPass);
app.post('/adminApi/avatarUpload',user.avatarUpload);



// --------------文章表控制文件
var article=require('../controllers/article');

//文章操作
app.post('/adminApi/updateArticle',article.updateArticle);
app.post('/adminApi/getArticle',article.getArticle);
app.post('/adminApi/toggleArticle',article.toggleArticle);
app.post('/adminApi/delArticle',article.delArticle);
app.post('/adminApi/getArticleList',article.getArticleList);

//文章图片上传
app.post('/adminApi/articleImgUpload',article.articleImgUpload);

//文章统计
app.post('/adminApi/getArticleNum',article.getArticleNum);



// --------------图片表控制文件
var picture=require('../controllers/picture');

app.post('/adminApi/editPictureList',picture.editPictureList);
app.post('/adminApi/getPictureList',picture.getPictureList);
app.post('/adminApi/togglePictureList',picture.togglePictureList);
app.post('/adminApi/delPictureList',picture.delPictureList);

//图片管理
app.post('/adminApi/setPictureListCover',picture.setPictureListCover);
app.post('/adminApi/moveToPicturelist',picture.moveToPicturelist);
app.post('/adminApi/getPicture',picture.getPicture);
app.post('/adminApi/pictureUpload',picture.pictureUpload);
app.post('/adminApi/editPictureInfo',picture.editPictureInfo);
app.post('/adminApi/delPicture',picture.delPicture);



}