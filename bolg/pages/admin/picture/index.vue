<template>
<div class="pictureList">
	<h2>相册列表</h2>
	<el-form class="pictureList_ctr" ref="addForm" :model="addForm" size="small" inline>
		<el-form-item v-show="!isAdd">
			<el-button type="primary" @click="isAdd=true">新建相册</el-button>
		</el-form-item>
		<el-form-item v-show="isAdd" label="相册名称" prop="name" :rules="[{ required: true, message: '请输入相册名称' }]">
			<el-input v-model="addForm.name" :maxlength="10"></el-input>
		</el-form-item>
		<el-form-item v-show="isAdd" label="显示">
			<el-switch v-model="addForm.visible" :disabled="isSubmit"></el-switch>
		</el-form-item>
		<el-form-item v-show="isAdd">
			<el-button type="primary" @click="addPictureList">新建相册</el-button>
			<el-button type="info" @click="isAdd=false">取消</el-button>
		</el-form-item>
		
	</el-form>
	<el-row :gutter="20">
		<el-col :span="4" v-for="item in list" :key="item.listId">
			<el-card :body-style="{ padding: '10px' }">
				<div v-if="!item.isEdit">
					<div class="pictureList_img" @click="$router.push(`/admin/picture/detail/${item.listId}`)" :style="item.cover&&'background-image:url('+item.cover+')'"></div>
					<p class="fix">
						<el-tag class="fr" size="small" type="success" disable-transitions v-if="item.visible==true">显示</el-tag>
						<el-tag class="fr" size="small" type="info" disable-transitions v-else>隐藏</el-tag>
						{{item.name}}
					</p>
					<p class="fix">
						<el-dropdown trigger="click" size="small" class="fr" @command="selectionOpt">
							<el-button size="mini">操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{type:1,id:item.listId,visible:!item.visible}">切换显示</el-dropdown-item>
								<el-dropdown-item :command="{type:2,item:item}" :disabled="item.listId==0">编辑信息</el-dropdown-item>
								<el-dropdown-item :command="{type:3,id:item.listId}" :disabled="item.listId==0">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						{{ new Date(item.date).toLocaleDateString() }}
					</p>
				</div>
				<div v-else>
					<div class="pictureList_img" @click="getCoverList(item.listId)" :style="item.cover&&'background-image:url('+item.cover+')'"></div>
					<el-form size="mini" :show-message="false" ref="editCopy" :model="editCopy">
						<el-form-item prop="name" :rules="[{ required: true }]">
							<el-input v-model="editCopy.name" placeholder="请输入相册名称" :maxlength="10"></el-input>
						</el-form-item>
						<el-form-item label="显示">
							<el-button class="fr" type="primary" @click="editPictureList">修改</el-button>
							<el-switch v-model="editCopy.visible"></el-switch>
						</el-form-item>
					</el-form>
				</div>
			</el-card>
		</el-col>
	</el-row>


	<el-dialog class="pictureList_cover" :visible.sync="coverDialogVisible" title="请选择封面" width="800px">
		<el-scrollbar>
			<el-row :gutter="10">
				<el-col :span="4" v-for="item in coverList" :key="item.listId">
					<el-card :body-style="{ padding: '10px' }">
						<div class="pictureList_img" @click="setPictureListCover(item.listId,item.src)" :style="'background-image:url('+item.src+')'"></div>
						<p>{{item.name}}</p>
					</el-card>
				</el-col>
			</el-row>
		</el-scrollbar>
	</el-dialog>
</div>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		return {
			isAdd:false,
			addForm:{
				name:'',
				visible:true
			},
			isSubmit:false,
			list: [],
			editCopy:'',
			coverList:[],
			coverDialogVisible:false
		}
	},
	created() {
		this.search();
	},
	methods: {
		//新建相册
		addPictureList() {
			this.$refs['addForm'].validate((valid)=>{
				if (valid) {
					this.isSubmit = true;
					(async () => {
						const { data } = await Api.editPictureList(this.addForm)
						if (!data.code) {
							this.search();
							this.isAdd=false;
							this.$message.success('新建成功！');
							this.isSubmit = false;
						} else {
							this.$message.error(data.msg);
						}
					})()
				}
			});
		},
		//获取相册列表
		async search() {
			const { data } = await Api.getPictureList()
			if (!data.code) {
				data.data.forEach((v,i,a)=>{
					a[i].isEdit=false
				})
				this.list=data.data;
			} else {
				this.$message.error(data.msg);
			}
		},
		//相册操作
		selectionOpt(o) {
			const that = this;
			if (o.type == 1) {
				this.togglePictureList(o.id,o.visible)
			} else if (o.type == 2) {
				this.list.forEach((v,i,a)=>{
					a[i].isEdit=false
				});
				o.item.isEdit=true;
				this.editCopy=JSON.parse(JSON.stringify(o.item));
			} else if (o.type == 3) {
				this.$confirm('确认删除相册?关联图片将全部删除,请谨慎操作!', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback(action) {
						if (action == 'confirm') {
							that.delPictureList(o.id)
						}
					}
				});
			}
		},
		async togglePictureList(id, visible) {
			const { data } = await Api.togglePictureList({id: id,visible: visible})
			if (!data.code) {
				this.search();
				this.$message.success('操作成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
		editPictureList() {
			this.$refs['editCopy'][0].validate((valid)=>{
				if (valid) {
					(async () => {
						const { data } = await Api.editPictureList(this.editCopy)
						if (!data.code) {
							this.search();
							this.$message.success('操作成功！');
						} else {
							this.$message.error(data.msg);
						}
					})()
				}
			});
		},
		async delPictureList(id) {
			const { data } = await Api.delPictureList({id: id})
			if (!data.code) {
				this.search();
				this.$message.success('删除成功！');
			} else {
				this.$message.error(data.msg);
			}
		},

		//封面操作
		async getCoverList(id) {
			const { data } = await Api.getPicture({id: id})
			if (!data.code) {
				if (data.data[0]) {
					this.coverList = data.data;
					this.coverDialogVisible=true
				}else{
					this.$message.error('相册内暂无图片！');
				}
			} else {
				this.$message.error(data.msg);
			}
		},
		async setPictureListCover(id, src) {
			const { data } = await Api.setPictureListCover({id: id,src: src})
			if (!data.code) {
				this.search();
				this.coverDialogVisible=false;
				this.$message.success('设置成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
	}
}
</script>

<style scoped lang="less">
.pictureList{
	h2{ font-size:26px; color:#6dc3ea; font-weight:normal; margin-bottom:20px;}
	&_ctr{margin-bottom: 10px; border-bottom:solid 1px #e6e6e6;}
	&_img{padding: 50%;background-image:url("~assets/images/noCover.png");background-repeat:no-repeat;background-size:contain;background-position:center; background-color: #ccc;margin-bottom: 10px; cursor: pointer;}
	&_cover{
		.el-scrollbar{ height:365px;}
		.el-scrollbar__wrap{ overflow-x:hidden; overflow-y:auto;}
		.el-row{width: 760px;}
	}
	.el-card{
		margin-bottom: 20px;
		p{margin-bottom: 5px; height: 30px; line-height:30px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
		.el-form-item{ margin-bottom: 5px; height: 30px;}
	}
}
</style>