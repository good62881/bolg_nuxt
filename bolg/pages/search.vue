<template>
<div class="con">
	<el-form inline size="mini" :model="searchForm">
		<el-form-item>
			<el-date-picker v-model="searchForm.date" type="daterange" :editable="false" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-select v-model="searchForm.class">
				<el-option label="全部" value=""></el-option>
				<el-option label="文章" :value="1"></el-option>
				<el-option label="代码" :value="2"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-input placeholder="请输入搜索内容" v-model="searchForm.val" @keyup.enter.native="search">
				<el-select v-model="searchForm.type" slot="prepend">
					<el-option label="标题" value="name"></el-option>
					<el-option label="标签" value="tags"></el-option>
				</el-select>
				<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
			</el-input>
		</el-form-item>
	</el-form>
	<div v-for="item in articleList.list" class="list">
		<h1 class="title"><nuxt-link :to="{ name: 'articleDetail-id', params: { id: item._id }}">{{item.name}}</nuxt-link></h1>
		<div class="info">
			发布于：{{new Date(item.date).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;
			<template v-if="item.update">更新于：{{new Date(item.update).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;</template>
			<template v-if="item.tags[0]">标签：{{item.tags.join(',')}}</template>
		</div>
		<div class="article" v-cut-html="item.content">
			
		</div>
	</div>
	<div class="tc">
		<el-pagination background layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="articleList.total" @current-change="goPage"></el-pagination>
	</div>
</div>
</template>

<script>
// api
import * as Api from '@/api/index'


//代码高亮
import hljs from '@/utils/highlight';


export default {
	layout: 'index',
	data() {
		return {
			pageNo: 1,
			pageSize: 10,
			searchForm:{
				date:'',
				class:'',
				type:'name',
				val:'',
			},
			articleList: ''
		}
	},
	directives: {
		cutHtml(el, binding) {
			el.innerHTML = '';   
			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;

			var _imgList = _dom.querySelectorAll('img');
			for (let i = 0; i < _imgList.length; i++) {
				if (i == 0) {
					var _img=document.createElement('div');
					_img.setAttribute('class','article_img'); 
					_img.appendChild(_imgList[i])
					el.appendChild(_img)
				}else{
					_imgList[i].parentNode.removeChild(_imgList[i]);
				}
			};

			var _pList=[]
			for (let i = 0; i < _dom.childNodes.length; i++) {
				_dom.childNodes[i].textContent && _pList.push(_dom.childNodes[i])
			};
			for (let i = 0; i < 3; i++) {
				let _in=_pList[i];
				_in && el.appendChild(_in.cloneNode(true))
			};

			var _blocks = el.querySelectorAll('pre');
			for (let i = 0; i < _blocks.length; i++) {
				hljs.highlightBlock(_blocks[i])
			}
		}
	},
	created() {
		this.getQuery();
		this.search()
	},
	watch: {
		'$route'() {
			this.getQuery();
			this.search()
		}
	},
	methods: {
		//获取查询字段
		getQuery:function() {
			this.searchForm.date=this.$route.query.date?[new Date(this.$route.query.date),new Date(this.$route.query.date.split('/')[0],this.$route.query.date.split('/')[1]-1,this.$route.query.date.split('/')[2],23,59,59)]:'';
			this.searchForm.class='';
			this.searchForm.type=this.$route.query.type?this.$route.query.type:'name';
			this.searchForm.val=this.$route.query.val?decodeURIComponent(this.$route.query.val):'';
		},
		//获取文章列表
		async search() {
			const _data = {
				...this.searchForm,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
			};
			const { data } = await Api.getArticleList(_data)
			if (!data.code) {
				this.articleList = data.data
			} else {
				this.$message.error(data.msg);
			}
		},
		goPage(i) {
			this.pageNo = i;
			this.search();
		},
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.el-form{
	border-bottom: 1px solid #eaecec; margin-bottom: 10px;
	.el-select{width: 80px;}
	.el-input-group,.el-date-editor {width:250px;}
	.el-date-editor .el-range-input{width:80px;}
}
.list{
	border-bottom: 1px solid #eaecec; margin-bottom: 10px; padding-bottom: 10px;
	.title{
		font-size: 24px; font-weight: normal;
		a{color: #666;}
	}
	.info{color: #ccc; margin-bottom: 10px;}
}
.list /deep/ .article{
	color: #aaa; max-height: 12em; word-break:break-all; overflow:hidden;
	h1{font-size: 20px;}
	h2{ font-size: 16px;}
	p{ text-indent: 2em;}
	li{
		padding-left:1.5em;
		&:before{ margin-left:-1.5em;margin-right:0.3em;text-align:right;display: inline-block; width: 1.2em; content:'\2022';}
	}
	ol li {
		counter-increment: list-0;
		&:before{
			content: counter(list-0, decimal) '. ';
		}
	}
	blockquote{border-left:4px solid #ccc;margin:5px 0; padding-left:16px;}
	pre{ border-radius: 5px; font-family:"Arial";}
	&_img{
		float: right; width: 150px; line-height: 150px; text-align: center; padding: 5px; margin-left: 10px; border: 1px solid #eaecec;
		img{ max-width: 150px; max-height: 150px;}
	}
}

</style>