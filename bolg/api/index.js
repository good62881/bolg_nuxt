import http from '@/plugins/axios';

//获取个人信息
export function getInfo(params) {
  return http.post('/Api/getInfo');
}

//获取文章列表
export function getArticleList(params) {
  return http.post('/Api/getArticleList',params);
}

//获取文章详情
export function getArticleDetail(params) {
  return http.post('/Api/getArticleDetail',params);
}

//获取相册列表
export function getPictureList(params) {
  return http.post('/Api/getPictureList',params);
}

//展示图片
export function getPicture(params) {
  return http.post('/Api/getPicture',params);
}
