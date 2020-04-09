<template>
<div class="edit">
	<h2>{{navNow.tit}}</h2>
	<el-menu :default-active="navNow.tab" mode="horizontal" router>
		<el-menu-item index="admin-edit-editInfo" :route="{name: 'admin-edit-editInfo'}">基本资料</el-menu-item>
		<el-menu-item index="admin-edit-editPass" :route="{name: 'admin-edit-editPass'}">修改密码</el-menu-item>
	</el-menu>
	<el-row>
		<nuxt-child/>
		<el-col :span="12" :offset="2">
			<p><img class="edit_img" :src="userInfo.avatar" alt=""></p>
			<el-upload :show-file-list="false" action="/adminApi/avatarUpload" :on-success="avatarUpload" accept="image/*">
				<el-tooltip content="建议尺寸200*200，限制大小100kb。">
					<el-button type="primary">上传头像</el-button>
				</el-tooltip>
			</el-upload>
		</el-col>
	</el-row>
</div>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		return {}
	},
	computed: {
		userInfo () {
			return this.$store.state.userInfo
		},
		navNow() {
			return {tab:this.$route.name,tit:this.$route.name=='admin-edit-editInfo'?'基本资料':'修改密码'};
		}
	},
	created() {
		
	},
	methods: {
		avatarUpload(res) {
			if (!res.code) {
				this.$store.dispatch('getUserInfo');
				this.$message.success('上传成功！');
			} else {
				this.$message.error(res.msg);
			}
		}
	}
}
</script>

<style scoped lang="less">
.edit{
	h2{ font-size:26px; color:#6dc3ea; font-weight:normal; margin-bottom:20px;}
	&_img{ width:100px; height:100px; border-radius: 50%; margin-bottom: 10px;}
	.el-menu{ margin-bottom: 20px;}
	.el-menu-item{ line-height:46px; height:46px;}
}
</style>