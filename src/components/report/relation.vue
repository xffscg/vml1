<template>
	<div>
		<h3>mmmm</h3>
		<h3>分析方法： {{title}}</h3>
		<div id="Chart" style="width:80%; height:200px; margin-top:15px"></div>
	</div>
	
</template>

<script>
// 相关系数和散点图
import echarts from 'echarts'
export default {
  name: 'relation',
  props : {
  	title : {
  		type : String,
  	},
  	option : {
  		type : Object
  	}
  },
  mounted(){
  	var temChart = echarts.init(document.getElementById('Chart'));
  	// temChart.setOption(this.option);
  },
};
</script>

<style>
</style>