module.exports = {
  srcDir: 'src/',
  css: ['@/assets/css/common.less','@/assets/font/iconfont.css'],
  plugins: ['@/plugins/element-ui', '@/plugins/axios'],
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  axios: { proxy: true },
  proxy: ['http://goldenlee.cn/Api','http://goldenlee.cn/adminApi','http://goldenlee.cn/upload'],
  head: {
    title: '工作的点点滴滴',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'renderer', content: 'webkit|ie-comp|ie-stand' }
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  // server: {port: 80,host:'0.0.0.0'},
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/admin/article/edit/:id?', alias: '/admin/article/add'
      })
    }
  },
  build: {
    // vendor: ['@/plugins/element-ui', '@/plugins/axios'], // webpack4已优化掉此选项
    extractCSS: true,
    babel: { //配置按需引入规则
      plugins: [
        ["component", {
          libraryName: "element-ui",
          styleLibraryName: "theme-chalk"
        }]
      ]
    },
  },
}