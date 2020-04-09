
<template>
<div class="calendar">
	<div class="calendar_top">
		<template v-if="!showYear"><span @click="showYear=!showYear;showMonth=false">{{year}}</span>&nbsp;-&nbsp;<span @click="showMonth=!showMonth;showYear=false">{{month+1}}</span></template>
		<template v-if="showYear"><input type="text" @keyup.enter="enterYear" :value="year"></template>
	</div>
	<div class="calendar_table">
		<table v-if="!showMonth && !showYear">
			<tbody>
				<tr>
					<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>
				</tr>
				<tr v-for="item in dayList">
					<td v-for="v in item" :class="{otherMonth:!v.date,now:v.date==nowDay}" @click="v.date&&cbDate(v.date)">{{v.val}}<i v-if="v.num"></i></td>
				</tr>
			</tbody>
		</table>
		<table v-if="showMonth && !showYear">
			<tbody>
				<tr v-for="item in monthList">
					<td v-for="v in item" :class="{now:v.index==month}" @click="setMonth(v.index)">{{v.val}}<span v-if="v.num">{{v.num}}</span></td>
				</tr>
			</tbody>
		</table>
		<table v-if="showYear && !showMonth">
			<tbody>
				<tr v-for="item in yearList">
					<td v-for="v in item" :class="{now:v.val==year}" @click="setYear(v.val)">{{v.val}}<span v-if="v.num">{{v.num}}</span></td>
				</tr>
			</tbody>
		</table>
	</div>
	
</div>
</template>

<script>
export default {
	props: ['dayData','monthData','yearData'],
	data() {
		return {
			// nowDay : new Date().toLocaleDateString(),   //不要用toLocaleDateString做计算，每个浏览器返回的不同
			nowDay : new Date().getFullYear() +'/'+ (new Date().getMonth()+1) +'/'+ new Date().getDate(),
			year :  new Date().getFullYear(),
			month :  new Date().getMonth(),
			showMonth:false,
			showYear:false,
		}
	},
	created() {
		
	},
	computed: {
		dayList() {
			//获取日期数组
			var fullDay = new Date(this.year,this.month+1,0).getDate(), //当月总天数
				startWeek = new Date(this.year,this.month,1).getDay(), //当月第一天是周几
				total = (fullDay+startWeek)%7 == 0 ? (fullDay+startWeek) : fullDay+startWeek+(7-(fullDay+startWeek)%7),//元素总个数
				lastMonthDay = new Date(this.year,this.month,0).getDate(), //上月最后一天
				arr = [];
			for(var i = 0; i < total; i++){
				if(i<startWeek){
					arr.push({val:lastMonthDay-startWeek+1+i})
				}else if(i<(startWeek+fullDay)){
					arr.push({val:i+1-startWeek,date:this.year+'/'+(this.month+1)+'/'+(i+1-startWeek)})
				}else{
					arr.push({val:i+1-(startWeek+fullDay)})
				}
			};
			//填充数据
			if (this.dayData) {
				arr.forEach((v,i,a)=> {
					this.dayData[v.date] && (a[i].num=this.dayData[v.date])
				})
			}
			//绘制日历
			var arrFilter = [];
			for(var i=0;i<arr.length;i+=7){
				arrFilter.push(arr.slice(i,i+7));
			}
			return arrFilter;
		},
		
		monthList() {
			//获取月份数组
			var arr=[{val:'一月',index:0},{val:'二月',index:1},{val:'三月',index:2},{val:'四月',index:3},{val:'五月',index:4},{val:'六月',index:5},{val:'七月',index:6},{val:'八月',index:7},{val:'九月',index:8},{val:'十月',index:9},{val:'十一月',index:10},{val:'十二月',index:11}];
			arr.forEach((v,i,a)=> {
				a[i].date=this.year+'/'+(v.index+1)
			});
			//填充数据
			if (this.monthData) {
				arr.forEach((v,i,a)=> {
					this.monthData[this.year+'/'+(v.index+1)] && (a[i].num=this.monthData[this.year+'/'+(v.index+1)])
				})
			};
			//绘制月份
			var arrFilter = [];
			for(var i=0;i<arr.length;i+=3){
				arrFilter.push(arr.slice(i,i+3));
			}
			return arrFilter;
		},
		
		yearList() {
			//获取年份数组
			var arr = [];
			for(var i=0;i<9;i++){
				arr.push({val:this.year-4+i});
			};
			//填充数据
			if (this.yearData) {
				arr.forEach((v,i,a)=> {
					this.yearData[v.val] && (a[i].num=this.yearData[v.val])
				})
			}
			//绘制年份
			var arrFilter = [];
			for(var i=0;i<arr.length;i+=3){
				arrFilter.push(arr.slice(i,i+3));
			}
			return arrFilter;
		},
	},
	methods: {
		setMonth(i) {
			this.month=i;
			this.cbDate(this.year+'/'+(i+1));
			this.showMonth=false;
		},
		setYear(i) {
			this.year=i;
			this.cbDate(i+'/'+(this.month+1));
			this.showYear=false
		},
		enterYear(e) {
			this.year=e.target.value;
			this.showYear=false
		},
		cbDate(d) {
			this.$emit('cbDate',d)
		}
	},
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.calendar{
	border: 1px solid #d8d6d6; position: relative; padding-bottom: 120%;
	&_top{
		width: 100%; background-color: #1f7fbb; color: #fff; text-align: center; line-height: 28px; position: absolute; z-index: 1;
		span{cursor: pointer;}
		input{background-color:#fff;border:1px solid #d8dce5;border-radius:4px; font-size: 12px; color:#5a5e66;text-align: center;}
	}
	&_table{
		position: absolute; width: 100%; height: 100%; padding-top: 28px; box-sizing: border-box;
		table{
			width: 100%; height: 100%;
			td{
				text-align: center; cursor: pointer;
				i{position: absolute; width:10px; height:10px; overflow: hidden; background-color: #fa5555; border-radius: 50%;}
				span{position: absolute; padding: 0 5px; margin: -5px 0 0 -5px; overflow: hidden; line-height:16px; font-size: 10px; white-space:nowrap; color: #fff; background-color: #fa5555; border-radius:10px;}
				&.otherMonth{ color:#ccc; cursor: default;}
				&.now{background-color: #2cadff; color: #fff;}
			}
		}
	}
	
}

</style>