<template>
<div class="info">
	<img :src="userInfo.avatar" alt="">
	<h1>{{userInfo.name}}</h1>
	<p>共有{{num.articleNum||0}}篇[<nuxt-link to="/admin/article">文章</nuxt-link>]、{{num.codeNum||0}}篇[<nuxt-link to="/admin/article">代码</nuxt-link>]、{{num.imgNum||0}}张[<nuxt-link to="/admin/picture">图片</nuxt-link>]</p>
</div>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		return {
			num:{}
		}
	},
	computed: {
		userInfo () {
			return this.$store.state.userInfo
		}
	},
	created() {
		this.getArticleNum()
	},
	methods: {
		async getArticleNum(){
			const { data } = await Api.getArticleNum()
			if (!data.code) {
				this.num=data.data
			} else {
				this.$message.error(data.msg);
			}
		}
	}
}
</script>

<style scoped lang="less">
.info {
	padding-bottom: 15px; margin-bottom: 15px; border-bottom: 1px dashed #999;
	img{ float: left; width:80px; height:80px; border-radius: 50%;}
	h1,p{ padding-left:100px;}
	h1{
		font-size: 32px;
		small{ font-size: 14px; color: #b1b1b1; font-weight: normal; margin-left: 20px;}
	}
}
</style>