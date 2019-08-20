import http from '@/plugins/axios';

//登陆
export function login(params) {
  return http.post('/adminApi/login',params);
}

//注销
export function out() {
  return http.post('/adminApi/out');
}

//获取用户信息
export function getInfo() {
  return http.post('/adminApi/getInfo');
}


//文章、图片统计
export function getArticleNum() {
  return http.post('/adminApi/getArticleNum');
}


//修改资料
export function editInfo(params) {
  return http.post('/adminApi/editInfo',params);
}


//修改密码
export function editPass(params) {
  return http.post('/adminApi/editPass',params);
}


//获取文章列表
export function getArticleList(params) {
  return http.post('/adminApi/getArticleList',params);
}

//切换文章显示状态
export function toggleArticle(params) {
  return http.post('/adminApi/toggleArticle',params);
}

//获取文章详情
export function getArticle(params) {
  return http.post('/adminApi/getArticle',params);
}

//删除文章
export function delArticle(params) {
  return http.post('/adminApi/delArticle',params);
}

//新增、更新文章
export function updateArticle(params) {
  return http.post('/adminApi/updateArticle',params);
}


//新增、修改相册
export function editPictureList(params) {
  return http.post('/adminApi/editPictureList',params);
}


//获取相册列表
export function getPictureList() {
  return http.post('/adminApi/getPictureList');
}

//切换相册显示状态
export function togglePictureList(params) {
  return http.post('/adminApi/togglePictureList',params);
}


//删除相册
export function delPictureList(params) {
  return http.post('/adminApi/delPictureList',params);
}

//设置封面
export function setPictureListCover(params) {
  return http.post('/adminApi/setPictureListCover',params);
}


//获取图片
export function getPicture(params) {
  return http.post('/adminApi/getPicture',params);
}

//删除图片
export function delPicture(params) {
  return http.post('/adminApi/delPicture',params);
}

//移动图片
export function moveToPicturelist(params) {
  return http.post('/adminApi/moveToPicturelist',params);
}

//编辑图片信息
export function editPictureInfo(params) {
  return http.post('/adminApi/editPictureInfo',params);
}