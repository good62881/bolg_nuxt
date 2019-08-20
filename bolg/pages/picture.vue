<template>
<div class="con">
	<el-row class="picture" :gutter="20">
		<el-col :span="8" v-for="(item,i) in pictureList" :key="i">
			<el-card :body-style="{ padding: '10px' }">
				<div class="picture_list" @click="showPicture(item.listId)" :style="item.cover&&'background-image:url('+item.cover+')'"></div>
				<p>{{item.name}}</p>
				<p>{{ new Date(item.date).toLocaleDateString() }}</p>
			</el-card>
		</el-col>
	</el-row>

	
	<el-dialog class="picture_show" :visible.sync="showVisible" @open="reSize" width="70%">
		<div class="picture_show_box">
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
				<div class="picture_info">
					{{pictureInfo.name}}&nbsp;
					<small>{{ new Date(pictureInfo.date).toLocaleDateString() }}</small>&nbsp;
					<template v-if="pictureInfo.formId">源自文章：<nuxt-link :to="{ name: 'articleDetail-id', params: { id: pictureInfo.formId }}">{{pictureInfo.name}}</nuxt-link></template>
					<template v-else>{{pictureInfo.des}}</template>
				</div>
			</div>
			<div class="picture_previewSwiper">
				<div v-swiper:previewSwiper="previewSwiperOpt">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(slide,i) in list" @click="swiper.slideTo(i)">
							<img :src="slide.src" alt="">
						</div>
					</div>
				</div>
			</div>
			
		</div>
		
	</el-dialog>

</div>
</template>

<script>
// 图片轮播
import '@/utils/vue-awesome-swiper';

// api
import * as Api from '@/api/index'

export default {
	layout: 'index',
	data () {
		const that=this;
		return {
			pictureList: '',
			list: '',
			showVisible: false,
			swiperOpt: {
				slidesPerView: 1,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				on: {
					slideChange() {  
						that.swiperIndex=this.activeIndex;
						that.previewSwiper.slideTo(this.activeIndex)
					},
				},
			},
			previewSwiperOpt: {
				allowTouchMove:false,
				centeredSlides: true,
				// slideToClickedSlide: true,
				slidesPerView: 'auto',
				spaceBetween: 10,
				on: {
					slideChange() {
						that.swiper.slideTo(this.activeIndex)
					},
				},
			},
			swiperIndex: 0,
		}
	},
	computed: {
		pictureInfo:function() {
			return this.list[this.swiperIndex]?this.list[this.swiperIndex]:''
		}
	},
	created() {
		this.getPictureList()
	},
	methods: {
		//获取相册列表
		async getPictureList(){
			const { data } = await Api.getPictureList()
			if (!data.code) {
				this.pictureList = data.data;
			} else {
				this.$message.error(data.msg);
			}
		},
		//展示图片
		async showPicture(id) {
			const { data } = await Api.getPicture({id: id})
			if (!data.code) {
				if (data.data[0]) {
					this.list = data.data;
					this.showVisible=true;
				}else{
					this.$message.error('相册内暂无图片！');
				}
			} else {
				this.$message.error(data.msg);
			}
		},
		reSize() {
			const that = this;
			that.$nextTick(function() {
				that.swiper.update();
				that.previewSwiper.update();
				that.swiper.slideTo(0)
			});
		},
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less">

.picture{
	&_list{padding: 50%;background-image:url("~assets/images/noCover.png");background-repeat:no-repeat;background-size:contain;background-position:center; background-color: #ccc;margin-bottom: 10px; cursor: pointer;}
	.el-card{
		margin-bottom: 20px;
		p{margin-bottom: 5px; height: 30px; line-height:30px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
	}
	&_show{
		&_box{background-color: #000;margin: -60px -20px -30px;}
		&/deep/ .el-dialog__headerbtn{
			width: 30px; height: 30px; top: -15px; right: -15px; z-index:2;  border: 3px solid #fff; border-radius: 50px; background-color: #aaa;
			.el-dialog__close{color: #fff;}
		}
	}
	&_swiper{
		margin-bottom: 10px; position: relative;
		.swiper-slide{
			line-height: 600px; text-align: center;
			img{ max-width: 100%; max-height: 600px;}
		}
	}
	&_previewSwiper{
		padding: 0 50px 10px;
		.swiper-slide{
			line-height: 50px; width: 50px; text-align: center; background-color: #ccc; cursor: pointer;
			img{ max-width: 50px; max-height: 50px;}
			&:after{ content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background-color: rgba(0,0,0,.5);}
		}
		.swiper-slide-active:after{ background-color:transparent; border:5px solid #73B4E0}
	}
	&_info{
		position: absolute; bottom: 0; left: 0; right: 0; z-index: 1; padding: 0 50px; line-height: 32px; color: #fff; background-color: rgba(0,0,0,.7);
		small{ color: #aaa;}
	}
}


</style>