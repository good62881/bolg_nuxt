<template>
<div class="login">
	<el-form :model="login" ref="login" label-width="60px">
		<el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号'}]">
			<el-input v-model="login.account" placeholder="输入账号" @keyup.enter.native="submit"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="pass" :rules="[{ required: true, message: '请输入密码'}]">
			<el-input type="password" v-model="login.pass" placeholder="输入密码" @keyup.enter.native="submit"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submit">登录</el-button>
		</el-form-item>
	</el-form>
</div>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {

	data () {
		return {
			login:{
				account:'',
				pass:''
			}
		}
	},
	methods: {
		submit() {
			this.$refs['login'].validate((valid)=>{
				if (valid) {
					(async () => {
						const { data } = await Api.login(this.login)
						if (!data.code) {
							this.$router.push("/admin");
						} else {
							this.$message.error(data.msg);
						}
					})()
				}
			});
		}
	}
}
</script>

<style scoped lang="less">
.login{
	padding-top: 150px;
	.el-form{width:350px; padding:30px 30px 10px; margin:auto; border:1px solid #EFF2F7; border-radius:5px; box-shadow:0 0 10px 5px #eee;}
}
</style>