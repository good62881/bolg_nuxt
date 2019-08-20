
<template>
<div class="top fix">
	<h1>工作的点点滴滴</h1>
	<div class="nav">
		<ul class="fix">
			<li><nuxt-link to="/">文章</nuxt-link></li>
			<li><nuxt-link to="/code">代码</nuxt-link></li>
			<li><nuxt-link to="/picture">图片</nuxt-link></li>
			<li><nuxt-link :to="{ name: 'articleDetail-id', params: { id: '5abde7b8da4d1b05ccf1c881' }}">关于</nuxt-link></li>
		</ul>
	</div>
</div>
</template>


<style scoped lang="less"> 
.top{
	background: url("~assets/images/bg.jpg") no-repeat center top;
	h1{ width: 1000px; height: 30px; margin: 0 auto; padding: 20px 0 270px 20px; box-sizing: border-box; color: #fff; font-size: 26px; font-weight: normal;}
}

.nav{
	background: #1f7fbb;
	ul{ width: 1000px; margin: 0 auto;}
	li{
		float: left; line-height: 40px;
		a{ color: #fff; padding:0 20px;}
	}
}
</style>