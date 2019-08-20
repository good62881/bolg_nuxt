<template>
<el-col :span="10">
	<el-form ref="editPass" :model="editPass" :rules="rules" label-width="80px">
		<el-form-item label="原密码" prop="pass" :rules="[{ required: true, message: '请输入原密码' }]">
			<el-input type="password" v-model="editPass.pass"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="newPass">
			<el-tooltip content="必填,6-32位数字或字母" placement="right">
				<el-input type="password" v-model="editPass.newPass"></el-input>
			</el-tooltip>
		</el-form-item>
		<el-form-item label="确认密码" prop="checkPass">
			<el-input type="password" v-model="editPass.checkPass"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :disabled="onEdit" @click="submitForm">确认</el-button>
		</el-form-item>
	</el-form>
</el-col>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	data () {
		const that=this;
		return {
			onEdit: false,
			editPass: {
				pass: "",
				newPass: "",
				checkPass: ""
			},
			rules: {
				newPass: [{
					validator: function(rule, value, callback) {
						if (value === '') {
							callback(new Error('请输入密码'));
						} else if (!(/^[A-Za-z0-9]{6,32}$/.test(value))) {
							callback(new Error('请输入6-32位数字或字母'));
						} else {
							if (that.editPass.checkPass !== '') {
								that.$refs.editPass.validateField('checkPass');
							}
							callback();
						}
					},
					required: true
				}],
				checkPass: [{
					validator: function(rule, value, callback) {
						if (value === '') {
							callback(new Error('请再次输入密码'));
						} else if (value !== that.editPass.newPass) {
							callback(new Error('两次输入密码不一致!'));
						} else {
							callback();
						}
					},
					required: true
				}]
			}
		}
	},
	created() {
		
	},
	methods: {
		submitForm() {
			this.$refs['editPass'].validate((valid)=>{
				if (valid) {
					this.onEdit=true;
					(async () => {
						const { data } = await Api.editPass(this.editPass)
						if (!data.code) {
							this.$message.success('修改成功,请用新密码重新登录！');
							this.$router.push("/admin/login")
						} else {
							this.onEdit=false;
							this.$message.error(data.msg);
						}
					})()
				}
			});
		}
	}
}
</script>
