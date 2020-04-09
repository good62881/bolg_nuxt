<template>
<div class="con">
	<div v-for="item in codeList.list" class="list">
		<h1 class="title"><nuxt-link :to="{ name: 'articleDetail-id', params: { id: item._id }}">{{item.name}}</nuxt-link></h1>
		<div class="info">
			发布于：{{new Date(item.date).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;
			<template v-if="item.update">更新于：{{new Date(item.update).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;</template>
			<template v-if="item.tags[0]">标签：{{item.tags.join(',')}}</template>
		</div>
		<div class="code" v-highlight="item.content">
			
		</div>
	</div>
	<div class="tc">
		<el-pagination background layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="codeList.total" @current-change="goPage"></el-pagination>
	</div>
</div>
</template>

<script>
// api
import * as Api from '@/api/index'

//代码高亮
import hljs from '@/utils/highlight';


export default {
	async asyncData () {
		const _data = {
			class: 2,
			pageNo: 1,
			pageSize: 10,
		};
		const { data } = await Api.getArticleList(_data)
		return { codeList: data.data }
	},
	layout: 'index',
	data() {
		return {
			pageNo: 1,
			pageSize: 10,
			codeList: {}
		}
	},
	directives: {
		highlight(el, binding) {
			el.innerHTML = '';

			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;
			
			var _pre=_dom.querySelectorAll('pre')[0];
			hljs.highlightBlock(_pre)
			el.appendChild(_pre);
		}
	},
	created() {
		this.search()
	},
	methods: {
		//获取文章列表
		async search() {
			const _data = {
				class: 2,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
			};
			const { data } = await Api.getArticleList(_data)
			if (!data.code) {
				this.codeList = data.data
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
.list{
	border-bottom: 1px solid #eaecec; margin-bottom: 10px; padding-bottom: 10px;
	.title{
		font-size: 24px; font-weight: normal;
		a{color: #666;}
	}
	.info{color: #ccc; margin-bottom: 10px;}
}
.code /deep/ pre{max-height: 12em; border-radius: 5px; font-family:"Arial";}
</style>