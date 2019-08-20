<template>
<el-col :span="4" class="nav">
	<el-menu :default-active="$route.name">
		<el-menu-item index="admin">
			<nuxt-link to="/admin"><i class="el-iconadd el-iconadd-shouye"></i>首页</nuxt-link>
		</el-menu-item>
		<el-submenu index="admin-edit">
			<template slot="title"><i class="el-icon-setting"></i>账户设置</template>
			<el-menu-item index="admin-edit-editInfo"><nuxt-link to="/admin/edit/editInfo">基本资料</nuxt-link></el-menu-item>
			<el-menu-item index="admin-edit-editPass"><nuxt-link to="/admin/edit/editPass">修改密码</nuxt-link></el-menu-item>
		</el-submenu>
		<el-menu-item index="admin-article">
			<nuxt-link to="/admin/article"><i class="el-icon-edit"></i>文章管理</nuxt-link>
		</el-menu-item>
		<el-menu-item index="admin-picture">
			<nuxt-link to="/admin/picture"><i class="el-icon-picture-outline"></i>图片管理</nuxt-link>
		</el-menu-item>
	</el-menu>
</el-col>
</template>

<script>

export default {
	data() {
		return {}
	},
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.nav{
	margin-bottom:-9999px; padding-bottom:9999px; background:#eef1f6;
	a{ display:block; color:#48576a; text-decoration:none;}
	.el-menu-item{
		.el-iconadd{ display: inline-block; margin-right:5px; width: 24px; text-align: center; font-size: 18px;}
		a{ margin: 0 -20px; padding: 0 20px;}
		&.is-active a{ color:#20a0ff;}
	}
	.el-submenu .el-menu-item a{ margin: 0 -45px 0 -40px; padding: 0 45px 0 40px;}
}

</style>