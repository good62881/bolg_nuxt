<template>

<div v-cloak>
	<c-top></c-top>

	<el-row class="oh">
		<c-nav></c-nav>
		<el-col :span="20" class="main">
			<nuxt/>
		</el-col>
	</el-row>
</div>


</template>

<script>
// api
import * as Api from '@/api/admin'

//公共
import CTop from '@/components/admin/top.vue';
import CNav from '@/components/admin/nav.vue';

export default {
	created() {
		this.$store.dispatch('getUserInfo')
	},
	components: {
		CTop,
		CNav
	},
}

</script>
<style lang="less" scoped>
.main{ padding:40px;  min-height: ~'calc(100vh - 80px)'; box-sizing: border-box;}
</style>

