<template>
	<div class="tcDetail">
    <div class="ttable">
      <h3>频率表格统计</h3>
        <el-table stripe border :data="tableData">
          <el-table-column prop="columnName" v-bind:label="freName+'取值'">
          </el-table-column>
          <el-table-column prop="rate" label="频率">
          </el-table-column>
        </el-table> 
    </div>
		<div id="tcChart" class="cchart"></div>
		<div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'scatterDetail',
  props : {
    tableData : {
      type : Array
    },
    freName : {
      type : String
    }
  },
  methods : {
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
    getOption(res){
      console.log(res);
      let xName = [];
      let yName = [];
      for (let i = 0; i < res.length; i++) {
        xName.push(res[i].columnName)
        yName.push(res[i].rate);
      }
      let option = {
        title: {
          text: '频率统计视图'
        },
        tooltip: {},
        legend: {
          data: ['频率']
        },
        xAxis: {
          data: xName
        },
        yAxis: {},
        series: [{
          name: '频率',
          type: 'bar',
          data: yName
        }]
      }
      console.log(option);
      return option;
    },
    setChart(res){      
      console.log(res);
      let chart = echarts.init(document.getElementById("tcChart"));
      chart.clear();
      let option = {};
      option = this.getOption(res);
      chart.setOption(option);
    },

  }
};
</script>

<style scoped>
.tcDetail {
	width:100%;
	height: 100%;
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
.close {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>