<template>
<div class="article">
	<h2>文章列表</h2>
	<div class="article_ctr fix">
		<el-form inline size="small" :model="searchForm" class="fr">
			<el-form-item>
				<el-date-picker v-model="searchForm.date" type="daterange" :editable="false" :default-time="['00:00:00', '23:59:59']" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="类别">
				<el-select v-model="searchForm.class">
					<el-option label="全部" value=""></el-option>
					<el-option label="文章" :value="1"></el-option>
					<el-option label="代码" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="显示">
				<el-select v-model="searchForm.visible">
					<el-option label="全部" :value="undefined"></el-option>
					<el-option label="显示" :value="true"></el-option>
					<el-option label="隐藏" :value="false"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input placeholder="请输入搜索内容" v-model="searchForm.val">
					<el-select v-model="searchForm.type" slot="prepend">
						<el-option label="标题" value="name"></el-option>
						<el-option label="标签" value="tags"></el-option>
					</el-select>
					<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
			</el-form-item>
		</el-form>
		<el-dropdown trigger="click" @command="selectionOpt">
			<el-button size="small" type="primary" :disabled="!tableSelect.length">批量操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item :command="1">切换显示</el-dropdown-item>
				<el-dropdown-item :command="2">删除</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-button size="small" type="primary" plain @click="$router.push('/admin/article/add')">发布新文章</el-button>
	</div>
	<div class="article_list">
		<el-table :data="tableData.list" v-loading="loading" border size="small" @selection-change="selection">
			<el-table-column type="selection"></el-table-column>
			<el-table-column width="100px" label="发布时间">
				<template slot-scope="scope">{{ new Date(scope.row.date).toLocaleDateString() }}</template>
			</el-table-column>
			<el-table-column prop="name" label="标题"></el-table-column>
			<el-table-column label="标签">
				<template slot-scope="scope"><el-tag disable-transitions :key="item" v-for="item in scope.row.tags">{{item}}</el-tag></template>
			</el-table-column>
			<el-table-column width="100px" align="center" label="类别">
				<template slot-scope="scope">
					<template v-if="scope.row.class==1">文章</template>
					<template v-else-if="scope.row.class==2">代码</template>
				</template>
			</el-table-column>
			<el-table-column width="120px" align="center" label="显示">
				<template slot-scope="scope">
					<el-switch slot="reference" v-model="scope.row.visible" @change="toggleArticle(scope.row._id,scope.row.visible)"></el-switch>
					&nbsp;&nbsp;&nbsp;{{scope.row.visible?'显示':'隐藏'}}
				</template>
			</el-table-column>
			<el-table-column width="100px" label="最后修改时间">
				<template slot-scope="scope">{{ scope.row.update?new Date(scope.row.update).toLocaleDateString():'' }}</template>
			</el-table-column>
			<el-table-column width="180px" align="center" label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="$router.push(`/admin/article/edit/${scope.row._id}`)">编辑</el-button>
					<el-popover width="160">
						<p>确定删除该文章吗？</p>
						<div class="tr">
							<el-button size="mini" type="text" onclick="document.body.click()">取消</el-button>
							<el-button size="mini" type="primary" @click="delArticle(scope.row._id)">确定</el-button>
						</div>
						<el-button size="small" type="danger" slot="reference">删除</el-button>
					</el-popover>
				</template>
			</el-table-column>
		</el-table>
		<div class="tc">
			<el-pagination layout="total,sizes,prev,pager,next,jumper" background :page-size="pageSize" :total="tableData.total" :current-page="pageNo" :page-sizes="[10,20,50]" @current-change="goPage" @size-change="changeSize"></el-pagination>
		</div>
	</div>
</div>
</template>

<script>
// api
import * as Api from '@/api/admin'

export default {
	layout: 'admin',
	data () {
		return {
			pageNo: 1,
			pageSize: 10,
			loading: false,
			searchForm: {
				date: '',
				class: '',
				type: 'name',
				val: ''
			},
			formCopy: '',
			tableData: {},
			tableSelect: []
		}
	},
	created() {
		this.search();
	},
	methods: {
		//获取列表
		async getData(params) {
			this.loading = true;
			const _data = {
				...params,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
			};
			const { data } = await Api.getArticleList(_data)
			if (!data.code) {
				this.tableData = data.data;
				this.loading = false;
			} else {
				this.$message.error(data.msg);
			}
		},
		search() {
			if (!this.loading) {
				//保存搜索条件
				this.formCopy = JSON.parse(JSON.stringify(this.searchForm));
				if (this.pageNo == 1) {
					this.getData(this.searchForm);
				} else {
					this.goPage(1);
				}
			}
		},
		goPage(i) {
			this.pageNo = i;
			this.getData(this.formCopy);
		},
		changeSize(i) {
			this.pageSize = i;
			if (this.pageNo == 1) {
				this.getData(this.formCopy);
			} else {
				this.goPage(1);
			}
		},
		//多选
		selection(val) {
			this.tableSelect = val;
		},
		//批量操作
		selectionOpt(val) {
			const that=this;
			if (val == 1) {
				this.toggleArticle(this.tableSelect, !this.tableSelect[0].visible)
			} else if (val == 2) {
				this.$confirm('批量删除已选文章?请谨慎操作!', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback(action) {
						if (action == 'confirm') {
							that.delArticle(that.tableSelect)
						}
					}
				});
			}
		},
		//操作
		async toggleArticle(id, visible) {
			const _id = (typeof id == 'string') ? [id] : id.map((x)=>{
				return x._id
			});
			const { data } = await Api.toggleArticle({id:_id,visible:visible})
			if (!data.code) {
				this.search();
				this.$message.success('操作成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
		async delArticle(id) {
			document.body.click()
			var _id = (typeof id == 'string') ? [id] : id.map(function(x) {
				return x._id
			});
			const { data } = await Api.delArticle({id:_id})
			if (!data.code) {
				this.search();
				this.$message.success('删除成功！');
			} else {
				this.$message.error(data.msg);
			}
		},
	}
}
</script>

<style scoped lang="less">
.article{
	h2{ font-size:26px; color:#6dc3ea; font-weight:normal; margin-bottom:20px;}
	&_ctr{
		margin-bottom: 10px; padding-bottom:20px; border-bottom:solid 1px #e6e6e6;
		.el-form-item{margin-bottom: 0;}
		.el-select{ width:80px;}
		.el-input-group,.el-date-editor{ width: 250px;}
		.el-date-editor input{width: 80px;}
	}
	&_list{
		.el-table{ margin-bottom: 10px;}
		.el-tag~.el-tag{margin:0 0 10px 10px;}
		.el-button{margin: 0 5px 0 0;}
	}
}
</style>