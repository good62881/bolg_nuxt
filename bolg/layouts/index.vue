<template>

<div v-cloak>
	<c-top></c-top>
	<div class="main fix">
		<c-right></c-right>
		<nuxt/>
	</div>
	<footer><a href="http://www.miitbeian.gov.cn/">湘ICP备18010293号</a></footer>
</div>

</template>

<script>
//公共
import CTop from '@/components/index/top.vue';
import CRight from '@/components/index/right.vue';

export default {
	components: {
		CTop,
		CRight
	},
}

</script>
<style lang="less" scoped>
.main{ width: 1000px; margin: 0 auto;}
.con{ padding: 20px 252px 20px 20px;}
footer{
	text-align: center; padding: 20px 0;
	a{ color: #ccc;}
}
</style>

