<template>
<div class="picture">
	<h2>
		{{pictureListInfo.name}}
		<small>建立于：{{ new Date(pictureListInfo.date).toLocaleDateString() }}</small>
		<small>共{{list.length||0}}张图片</small>
		<el-tag v-if="pictureListInfo.visible" size="mini" type="success">显示</el-tag>
		<el-tag v-else size="mini" type="info">隐藏</el-tag>
	</h2>
	<div class="picture_ctr">
		<template v-if="!isEdit">
			<el-button @click="$router.push('/admin/picture')">返回相册</el-button>&nbsp;
			<el-button type="primary" @click="clearEditList();isEdit=true">批量编辑</el-button>&nbsp;
			<el-button type="primary" @click="uploadVisible=true">上传图片</el-button>
		</template>
		<template v-else>
			<el-checkbox label="全选" :indeterminate="isIndeterminate" v-model="checkAll" @change="addAllEditList" border></el-checkbox>&nbsp;
			<el-dropdown trigger="click" split-button @click="clearEditList"  @command="editListOpt" type="primary">
				取消编辑
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item :disabled="!editList.length" :command="1">移动到</el-dropdown-item>
					<el-dropdown-item :disabled="!editList.length" :command="2">删除</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</template>
	</div>
	<el-row :gutter="20">
		<el-col :span="4" v-for="(item,i) in list" :key="i">
			<el-card :body-style="{ padding: '10px' }">
				<div class="picture_img" @click="showPicture(i)" :style="'background-image:url('+item.src+')'"></div>
				<p class="fix"><span class="fr">{{ new Date(item.date).toLocaleDateString() }}</span>{{item.name}}</p>
				<p class="fix">
					<el-dropdown trigger="click" size="small" class="fr" @command="selectionOpt">
						<el-button size="mini">操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="{type:1,id:item.listId,src:item.src}">设为封面</el-dropdown-item>
							<el-dropdown-item :command="{type:2,id:item._id}" :disabled="!!item.formId">移动到</el-dropdown-item>
							<el-dropdown-item :command="{type:3,id:item._id}" :disabled="!!item.formId">删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					{{item.des}}
				</p>
				<div v-if="isEdit && !item.formId" class="picture_check" @click="addEditList(item)"><i v-if="item.isCheck" class="el-icon-check"></i></div>
			</el-card>
		</el-col>
	</el-row>

	<el-dialog :visible.sync="uploadVisible" width="400px" @close="finishUpload">
		<el-upload class="picture_upload" ref="upload" :disabled="isUpload" accept="image/*" drag multiple :data="{listId:listId}" :limit="5" :on-exceed="maxPicture" :on-success="pictureUpload" :on-error="pictureUploadError" :before-upload="pictureUploadProgress" action="/adminApi/pictureUpload">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">最多同时上传5张图片，单个文件大小不超过1MB</div>
		</el-upload>
	</el-dialog>


	<el-dialog class="picture_move" :visible.sync="moveVisible" title="移动到" width="800px">
		<el-scrollbar>
			<el-row :gutter="10">
				<el-col :span="4" v-for="item in pictureList" v-if="item.listId!=listId" :key="item.listId">
					<el-card :body-style="{ padding: '10px' }">
						<div class="picture_img" @click="moveTolist(item.listId)" :style="item.cover&&'background-image:url('+item.cover+')'"></div>
						<p>{{item.name}}</p>
					</el-card>
				</el-col>
			</el-row>
		</el-scrollbar>
	</el-dialog>
	
	<el-dialog class="picture_show" :visible.sync="showVisible" @open="reSize" @close="editSwiperTab=false" width="80%">
		<el-row>
			<el-col class="picture_show_box" :span="18">
				<div class="picture_swiper">
					<div v-swiper:swiper="swiperOpt">
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="slide in list">
								<img :src="slide.src" alt="">
							</div>
						</div>
						<div class="swiper-button-prev"></div>
						<div class="swiper-button-next"></div>
					</div>
					<!-- <swiper :options="swiperOpt" ref="swiper">
						<swiper-slide v-for="slide in list" :key="slide.src">
							<img :src="slide.src" alt="">
						</swiper-slide>
						<div class="swiper-button-prev" slot="button-prev"></div>
						<div class="swiper-button-next" slot="button-next"></div>
					</swiper> -->
				</div>
				<div class="picture_previewSwiper">
					<div v-swiper:previewSwiper="previewSwiperOpt">
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="(slide,i) in list" @click="slideChange(i)">
								<img :src="slide.src" alt="">
							</div>
						</div>
					</div>
					<!-- <swiper :options="previewSwiperOpt" ref="previewSwiper">
						<swiper-slide v-for="slide in list" :key="slide.src">
							<img :src="slide.src" alt="">
						</swiper-slide>
					</swiper> -->
				</div>
			</el-col>
			<el-col class="picture_show_info" :span="6">
				<div v-if="!editSwiperTab">
					<ul>
						<li>
							<p>{{pictureInfo.name}}</p>
							<small>{{ new Date(pictureInfo.date).toLocaleString() }}</small>
						</li>
						<li>
							<template v-if="pictureInfo.formId">源自文章：<nuxt-link :to="{ name: 'articleDetail-id', params: { id: pictureInfo.formId }}">{{pictureInfo.name}}</nuxt-link></template>
							<template v-else>{{pictureInfo.des}}</template>
						</li>
						<li>
							<el-button type="primary" v-if="!pictureInfo.formId"  @click="editPictureInfo">修改</el-button>
						</li>
					</ul>
				</div>
				<el-form v-if="editSwiperTab" ref="pictureInfoCopy" :model="pictureInfoCopy" size="small" label-width="60px">
					<el-form-item label="标题" prop="name" :rules="[{ required: true, message: '请输入标题' }]">
						<el-input v-model="pictureInfoCopy.name"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="des">
						<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="pictureInfoCopy.des"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitPictureInfo">确认</el-button>
						<el-button @click="editSwiperTab=false">返回</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</el-dialog>
</div>
</template>

<script>
// 图片轮播
import '@/utils/vue-awesome-swiper';

// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		const that=this;
		return {
			listId: this.$route.params.id,
			pictureList: [],
			isEdit: false,
			isUpload: false,
			uploadVisible: false,
			list: [],
			editList: [],
			checkAll: false,
			moveVisible: false,
			showVisible: false,
			swiperOpt: {
				slidesPerView: 1,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				on: {
					slideChange() {   //奇怪的BUG，swiper的双向控制写在$nextTick中，会造成其他弹窗打开时页面卡死。
						that.swiperIndex=this.activeIndex;
						that.editSwiperTab=false;
						that.previewSwiper.slideTo(this.activeIndex)
					},
				},
			},
			previewSwiperOpt: {
				allowTouchMove:false,
				centeredSlides: true,
				slidesPerView: 'auto',
				spaceBetween: 10,
				on: {
					slideChange() {
						that.editSwiperTab=false;
						that.swiper.slideTo(this.activeIndex)
					},
				},
			},
			swiperIndex: 0,
			pictureInfoCopy:'',
			editSwiperTab:false,
		}
	},
	created() {
		this.getPictureList()
		this.getPicture();
	},
	computed: {
		// swiper() {
		// 	return this.$refs.swiper.swiper
		// },
		// previewSwiper() {
		// 	return this.$refs.previewSwiper.swiper
		// },
		pictureListInfo() {
			return this.pictureList.length ? this.pictureList.filter((x)=> {
				return x.listId == this.listId
			})[0] : '';
		},
		isIndeterminate() {
			return this.editList.length > 0 && this.editList.length < this.list.length
		},
		pictureInfo() {
			return this.list[this.swiperIndex]?this.list[this.swiperIndex]:''
		}
	},
	methods: {
		//获取相册列表
		async getPictureList() {
			const { data } = await Api.getPictureList()
			if (!data.code) {
				this.pictureList=data.data
			} else {
				this.$message.error(data.msg);
			}
		},
		//获取图片列表
		async getPicture() {
			const { data } = await Api.getPicture({id: this.listId})
			if (!data.code) {
				data.data.forEach((v, i, a)=>{
					a[i].isCheck = false
				})
				this.list = data.data;
			} else {
				this.$message.error(data.msg);
			}
		},
		//图片上传
		pictureUpload(res) {
			this.isUpload = false;
		},
		pictureUploadProgress() {
			this.isUpload = true
		},
		pictureUploadError(err) {
			this.isUpload = false
			this.$message.error('上传失败！');
		},
		maxPicture() {
			this.$message.error('最多同时上传5张图片');
		},
		finishUpload() {
			this.uploadVisible = false;
			this.$refs.upload.clearFiles();
			this.getPicture();
		},

		//选择or全选
		addEditList(o) {
			var _index = this.editList.indexOf(o._id)
			if (_index == -1) {
				this.editList.push(o._id);
				o.isCheck = true
			} else {
				this.editList.splice(_index, 1);
				o.isCheck = false
			};
			this.checkAll = this.editList.length === this.list.length;
		},
		addAllEditList(val) {
			this.list.forEach((v, i, a)=>{
				a[i].isCheck = val ? true : false
			});
			var _arr = this.list.filter((v)=>{
				return !v.formId
			}).map((v)=>{
				return v._id
			});
			this.editList = val ? _arr : [];
		},
		clearEditList() {
			this.list.forEach((v, i, a)=>{
				a[i].isCheck = false
			});
			this.editList = [];
			this.isEdit = false;
			this.checkAll = false;
		},

		//批量操作
		editListOpt(v) {
			const that = this;
			if (v == 1) {
				this.moveVisible = true
			} else if (v == 2) {
				this.$confirm('确认删除图片？请谨慎操作！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback(action) {
						if (action == 'confirm') {
							that.delPicture();
						}
					}
				});
			}
		},

		//图片操作
		selectionOpt(o) {
			const that = this;
			if (o.type == 1) {
				this.setPictureListCover(o.id, o.src);
			} else if (o.type == 2) {
				this.editList = [];
				this.editList.push(o.id);
				this.moveVisible = true
			} else if (o.type == 3) {
				this.$confirm('确认删除图片？请谨慎操作！', '提示', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback(action) {
						if (action == 'confirm') {
							that.editList = [];
							that.editList.push(o.id);
							that.delPicture();
						}
					}
				});
			}
		},
		//设置封面
		async setPictureListCover(id, src) {
			const { data } = await Api.setPictureListCover({id: id,src: src})
			if (!data.code) {
				this.$message.success('设置成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
		//删除图片
		async delPicture() {
			const { data } = await Api.delPicture({id: this.editList})
			if (!data.code) {
				this.getPicture();
				this.editList = [];
				this.isEdit = false;
				this.checkAll = false;
				this.$message.success('删除成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
		//移动图片
		async moveTolist(listId) {
			const { data } = await Api.moveToPicturelist({id: this.editList,listId: listId})
			if (!data.code) {
				this.getPicture();
				this.editList = [];
				this.isEdit = false;
				this.checkAll = false;
				this.moveVisible = false;
				this.$message.success('移动成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
		//显示图片滚动
		showPicture(i) {
			this.showVisible = true;
			this.swiperIndex = i
		},
		slideChange(i) {
			this.editSwiperTab=false;
			this.swiper.slideTo(i)
		},
		reSize() { //重要！swiper加载时尺寸的计算会有问题，必须用$nextTick在渲染完成后重新计算。同时重新计算需写在弹窗上，因为渲染时swiper属于弹窗的子组件。
			const that = this;
			that.$nextTick(function() {
				that.swiper.update();
				that.previewSwiper.update();
				// that.swiper.controller.control = that.previewSwiper;
				// that.previewSwiper.controller.control = that.swiper;
				that.swiper.slideTo(that.swiperIndex)
			});
		},
		//编辑图片信息
		editPictureInfo() {
			this.pictureInfoCopy=JSON.parse(JSON.stringify(this.pictureInfo));
			this.editSwiperTab=true;
		},
		submitPictureInfo() {
			this.$refs['pictureInfoCopy'].validate((valid)=>{
				if (valid) {
					(async () => {
						const { data } = await Api.editPictureInfo(this.pictureInfoCopy)
						if (!data.code) {
							this.getPicture();
							this.editSwiperTab=false;
							this.$message.success('修改成功！');
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

.picture{
	h2{
		font-size:26px; color:#6dc3ea; font-weight:normal; margin-bottom:20px;
		small{font-size: 14px; margin: 0 10px; color: #aaa;}
	}
	&_ctr{margin-bottom: 10px; padding-bottom: 10px; border-bottom:solid 1px #e6e6e6;}
	&_upload{margin-bottom: 20px;}
	&_img{padding: 50%;background-repeat:no-repeat;background-size:contain;background-position:center; background-color: #ccc;margin-bottom: 10px; cursor: pointer;}
	&_check{
		position: absolute; top:0; left:0; right: 0; bottom: 0; background-color: rgba(0,0,0,.5); cursor: pointer;
		i{ font-size:60px; color: #fff; position: absolute; top:50%; left:50%; margin: -30px 0 0 -30px; }
	}
	&_move{
		.picture_img{background-image:url("~assets/images/noCover.png");}
		.el-scrollbar{ height:365px;}
		.el-scrollbar__wrap{ overflow-x:hidden; overflow-y:auto;}
		.el-row{width: 760px;}
	}
	&_show{
		.el-row{margin: -60px -20px -30px;}
		.el-dialog__headerbtn{
			width: 30px; height: 30px; top: -15px; right: -15px; z-index: 1;  border: 3px solid #fff; border-radius: 50px; background-color: #aaa;
			.el-dialog__close{color: #fff;}
		}
		&_box{ background-color: #000; padding-bottom: 10px;}
		&_info{
			padding: 20px;
			small{ color: #ccc;}
			li{
				margin-bottom: 10px;
				&:first-child{ padding-bottom: 10px; border-bottom:1px solid #D5D5D5; box-shadow:0 1px 1px rgba(0,0,0,.1);}
			}
		}
	}
	&_swiper{
		margin-bottom: 10px;
		.swiper-slide{
			line-height: 600px; text-align: center;
			img{ max-width: 100%; max-height: 600px;}
		}
	}
	&_previewSwiper{
		padding: 0 50px;
		.swiper-slide{
			line-height: 50px; width: 50px; text-align: center; background-color: #ccc; cursor: pointer;
			img{ max-width: 50px; max-height: 50px;}
			&:after{ content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background-color: rgba(0,0,0,.5);}
		}
		.swiper-slide-active:after{ background-color:transparent; border:5px solid #73B4E0}
		
	}
	.el-card{
		margin-bottom: 20px; position: relative;
		p{margin-bottom: 5px; height: 30px; line-height:30px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
	}
}
</style>