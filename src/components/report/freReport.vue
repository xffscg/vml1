<template>
	<div class="freReport">
    <div class="ttable">
        <el-table stripe border :data="tableData">
          <el-table-column prop="columnName" v-bind:label="freName+'取值'">
          </el-table-column>
          <el-table-column prop="rate" label="频率">
          </el-table-column>
        </el-table> 
    </div>
		<!-- <div id="tcChart" class="cchart"></div> -->
	</div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'freReport',
  mounted(){
  },
  methods : {  	
    
  }
};
</script>

<style scoped>
.freReport {
	width: 100%;
	position: absolute;
	background-color: white;
  overflow-y: auto;

}
.ttable {
  min-height: 300px;
  width: 100%;
}
.cchart {
	height: 300px;
	width: 100%;
}
</style>