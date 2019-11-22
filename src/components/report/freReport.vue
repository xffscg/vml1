<template>
	<div class="freReport">
    <div class="ttable">
      <h5>频率表格统计</h5>
        <el-table :data="configData" style="width: 100%" min-height="200px">
            <el-table-column v-for="col in columnC" :prop="col.prop" :label="col.prop" :key="col.prop">
            </el-table-column>
      </el-table>
        <el-table border :data="tableData">
          <el-table-column prop="columnName" v-bind:label="freName+'取值'">
          </el-table-column>
          <el-table-column prop="rate" label="频率">
          </el-table-column>
        </el-table> 
    </div>
		<div id="tcChart" class="cchart"></div>
	</div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'freReport',
  mounted(){
  	  let chart = echarts.init(document.getElementById("tcChart"));
	  chart.clear();
	  chart.setOption(option);
  },
  methods : {  	
    // setChart(res){      
    //   console.log(res);
    //   let chart = echarts.init(document.getElementById("tcChart"));
    //   chart.clear();
    //   let option = {};
    //   option = this.getOption(res);
    //   chart.setOption(option);
    // },

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