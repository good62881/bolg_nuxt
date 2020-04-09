
<template>
<el-row class="top fix">
	<el-col :span="4" class="tc"><h1>后台管理</h1></el-col>
	<el-col :span="20">
		<dl>
			<dt>
				<img :src="userInfo.avatar" alt="">
				<p class="txthide">{{userInfo.name}}</p>
				<p class="txthide"><small>管理员</small></p>
			</dt>
			<dd><a href="javascript:;" class="el-iconadd el-iconadd-tuichu" @click="out"></a></dd>
			<dd><nuxt-link class="el-icon-setting" to="/admin/edit/editInfo"></nuxt-link></dd>
		</dl>
	</el-col>
</el-row>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	data () {
		return {
		}
	},
	computed: {
		userInfo () {
			return this.$store.state.userInfo
		}
	},
	created() {
		
	},
	methods: {
		out(){
			Api.out()
		}
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.top{
	background:#6dc3ea; color:#fff; padding:20px 0;
	h1{ line-height:40px; font-weight:bold; font-size:24px;}
	dl{ float:right;}
	dt,dd{ float:right; padding-right:40px;}
	dt{
		width:200px; line-height:1.5;
		img{ width:40px; height:40px; border-radius:50%; float:left; margin-right:15px;}
		small{ color:#c3eafc;}
	}
	dd a{ font-size:24px; line-height:40px; color:#fff; text-decoration:none; }
}
</style>