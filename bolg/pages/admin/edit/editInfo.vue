<template>
<el-col :span="10">
	<el-form v-show="!editTab" label-width="60px">
		<el-form-item label="姓名">
			<div>{{userInfo.name}}</div>
		</el-form-item>
		<el-form-item label="年龄">
			<div>{{userInfo.age||'保密'}}</div>
		</el-form-item>
		<el-form-item label="职业">
			<div>{{userInfo.job}}</div>
		</el-form-item>
		<el-form-item label="邮箱">
			<div>{{userInfo.email}}</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="isEdit">修改</el-button>
		</el-form-item>
	</el-form>
	<el-form v-show="editTab" ref="editForm" :model="editForm" label-width="80px">
		<el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名' },{ pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '请输入2~5个中文字符'}]">
			<el-tooltip content="必填,2~5个中文字符" placement="right">
				<el-input v-model="editForm.name"></el-input>
			</el-tooltip>
		</el-form-item>
		<el-form-item label="年龄" prop="age">
			<el-tooltip content="为0显示保密" placement="right">
				<el-input-number v-model="editForm.age" :min="0" size="small"></el-input-number>
			</el-tooltip>
		</el-form-item>
		<el-form-item label="职业" prop="job">
			<el-input v-model="editForm.job"></el-input>
		</el-form-item>
		<el-form-item label="email" prop="email" :rules="[{ required: true, message: '请输入邮箱' },{ type: 'email', message: '请正确输入邮箱'}]">
			<el-input v-model="editForm.email"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :disabled="onEdit" @click="submitForm">确认</el-button>
			<el-button @click="tabEdit">返回</el-button>
		</el-form-item>
	</el-form>
</el-col>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	data () {
		return {
			onEdit: false,
			editTab: false,
			editForm:{
				name:'',
				age:0,
				job:'',
				email:''
			}
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
		isEdit() {
			this.editForm = JSON.parse(JSON.stringify(this.userInfo,['name','age','job','email']));
			this.editTab = true;
		},
		tabEdit() {
			this.editTab = false;
			this.$refs['editForm'].resetFields();
		},
		submitForm() {
			this.$refs['editForm'].validate((valid)=>{
				if (valid) {
					this.onEdit=true;
					(async () => {
						const { data } = await Api.editInfo(this.editForm)
						if (!data.code) {
							this.onEdit=false;
							this.tabEdit();
							this.$store.dispatch('getUserInfo');
							this.$message.success('修改成功！');
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
