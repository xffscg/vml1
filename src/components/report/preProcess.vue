<template>
	<div>		
		<h3>分析方法： {{title}}</h3>
		<el-table :data="tableData" style="width: 100%" height="600">
	        <el-table-column v-for="col in column" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
	        </el-table-column>
    </el-table>	
	</div>
</template>

<script>
// 全表统计   +++   预处理  ++ 频率统计 ++ 特征工程
export default {
  name: 'preProcess',
  props : {
  	title : {
  		type : String,
  	},
  	tableData : {
  		type : Array,
  	},
  	column : {
  		type : Array,
  	}
  },
};
</script>

<style>
</style>