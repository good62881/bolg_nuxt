<template>
<div class="article">
	<h2>{{id?'编辑文章':'发布新文章'}}</h2>
	<el-form class="article_edit" size="small" ref="form" :model="form" label-width="80px">
		<el-form-item label="标题" prop="name" :rules="[{ required: true, message: '请输入标题' }]">
			<el-input class="s_input" v-model="form.name" :maxlength="50"></el-input>
		</el-form-item>
		<el-form-item label="类别">
			<el-select v-model="form.class">
				<el-option label="文章" :value="1"></el-option>
				<el-option label="代码" :value="2"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="标签">
			<el-tag :key="tag" v-for="tag in form.tags" closable @close="delTag(tag)">{{tag}}</el-tag>
			<el-input class="tag_input" v-if="tagVisible" v-model="tagValue" ref="saveTagInput" :maxlength="10" @keyup.enter.native="addTag" @blur="addTag"></el-input>
			<el-button v-else @click="showTagInput">+ 新增</el-button>
		</el-form-item>
		<el-form-item label="显示">
			<el-switch v-model="form.visible"></el-switch>
		</el-form-item>
		<el-form-item label="内容" prop="content" :rules="[{ required: true, message: '请输入内容' }]">
			<div v-model="form.content" v-quill:myTextEditor="editorOption"></div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :disabled="isSubmit"  @click="submitForm">{{this.id?'修改':'提交'}}</el-button>
			<el-button type="primary" plain @click="$router.push('/admin/article')">取消</el-button>
		</el-form-item>
	</el-form>

	
	<el-dialog :visible.sync="uploadVisible" width="400px">
		<el-upload ref="upload" accept="image/*" drag :limit="1" :on-success="articleImgUpload" action="/adminApi/articleImgUpload">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">文件大小不超过1MB</div>
		</el-upload>
	</el-dialog>
</div>
</template>

<script>
// 代码高亮
import hljs from '@/utils/highlight';

// 富文本编辑器
import Vue from 'vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
if (process.client) {
	const VueQuillEditor = require('vue-quill-editor/dist/ssr')
	Vue.use(VueQuillEditor)
}

// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		const that=this;
		return {
			id: this.$route.params.id,
			tagVisible: false,
			tagValue: '',
			uploadVisible: false,
			isSubmit: false,
			editorOption: {
				placeholder: '请输入内容……',
				modules: {
					syntax: {
						highlight(text) {
							const result = hljs.highlightAuto(text)
							return result.value
						}
					},
					toolbar: {
						container: [
							['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
							[{
								'header': 1
							}, {
								'header': 2
							}],
							[{
								'list': 'ordered'
							}, {
								'list': 'bullet'
							}],
							[{
								'script': 'sub'
							}, {
								'script': 'super'
							}],
							[{ 'align': [] }],
							[{
								'color': []
							}, {
								'background': []
							}],
							['link', 'image', 'clean']
						], // 工具栏
						handlers: {
							'image': function(value) {
								if (value) {
									that.uploadVisible = true;
								} else {
									this.quill.format('image', false);
								}
							}
						}
					}
				}
			},
			form: {
				name: '',
				class: 1,
				tags: [],
				visible: true,
				content: ''
			},
		}
	},
	created() {
		this.id&&this.getArticle();
	},
	methods: {
		//获取文章
		async getArticle(){
			const { data } = await Api.getArticle({id: this.id})
			if (!data.code) {
				this.form=data.data
			} else {
				this.$message.error(data.msg);
			}
		},

		//标签操作
		delTag(tag) {
			this.form.tags.splice(this.form.tags.indexOf(tag), 1);
		},
		addTag() {
			if (this.tagValue) {
				this.form.tags.push(this.tagValue);
			}
			this.tagVisible = false;
			this.tagValue = '';
		},
		showTagInput() {
			this.tagVisible = true;
			this.$nextTick(function() {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		// 图片上传
		articleImgUpload(res) {
			if (!res.code) {
				//插入图片
				var _quill = this.myTextEditor;
				_quill.focus();  //非常重要！一定先让编辑框获得焦点，否则获取不到getSelection()光标位置
				var _length = _quill.getSelection().index;
				_quill.insertEmbed(_length, 'image', res.url);
				_quill.setSelection(_length + 1);

				this.$refs.upload.clearFiles();
				this.uploadVisible = false;
			} else {
				this.$message.error(res.msg);
				this.$refs.upload.abort();
			}
		},

		submitForm() {
			this.$refs['form'].validate((valid)=>{
				if (valid) {
					this.isSubmit = true;
					(async () => {
						const { data } = await Api.updateArticle(this.form)
						if (!data.code) {
							this.$message.success('发布成功！');
							this.$router.push("/admin/article");
						} else {
							this.isSubmit = false;
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
.article{
	h2{ font-size:26px; color:#6dc3ea; font-weight:normal; margin-bottom:20px;}
	&_edit{
		.el-tag{margin-right: 10px;}
		.el-select{ width:100px;}
		.s_input{width: 500px;}
		.tag_input{ width:100px;}
		.ql-container{ height: 300px;}
		.el-button[disabled]{cursor: not-allowed; background: #7C7C7C; color: #fff;}
	}
}
</style>