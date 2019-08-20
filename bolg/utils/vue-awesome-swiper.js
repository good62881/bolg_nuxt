import Vue from 'vue'

import 'swiper/dist/css/swiper.css'

if (process.client) {
	const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
	Vue.use(VueAwesomeSwiper)
}