module.exports = {
  css: ['@/assets/css/common.less','@/assets/font/iconfont.css'],
  plugins: ['@/plugins/element-ui', '@/plugins/axios'],
  head: {
    title: '狗蛋的博客',
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