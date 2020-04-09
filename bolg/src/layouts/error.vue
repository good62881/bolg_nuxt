<template>

<div class="error" v-cloak>
	<h1 v-if="error.statusCode === 404"><i class="el-icon-question"></i>页面不存在</h1>
	<h1 v-else><i class="el-icon-error"></i>应用发生错误异常</h1>
	<el-button type="primary" round @click="$router.push('/')">返回首页</el-button>
</div>

</template>

<script>

export default {
	props: ['error'],
}

</script>
<style lang="less" scoped>
.error{
	text-align: center; padding: 100px;
	h1{
		margin-bottom: 50px; font-size: 40px; line-height: 40px; font-weight: normal; color: #aaa;
		i{ color: #F56C6C; margin-right: 20px;}
	}
}
</style>

