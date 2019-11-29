<template>
	<div class="coeDetail">
		<div id="coeChart" class="chart"></div>
    <!-- <div id="treeChart" class="chart"></div> -->
		<div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<!-- <script type="text/javascript" src="./static/getOptionAll.js"></script> -->
<script>

import echarts from 'echarts'
import { getOptionsAll } from '@/api/getOptionsAll'
// import { getOptionsAll } from '@/api/dataSource'

export default {
  name: 'coeDetail',
  // props : {
  // 	option : {
  // 		type : Object
  // 	}
  // },
  methods : {
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
    deepCopy(oldVal){
        let target = oldVal.constructor === Array?[]:{};
        for(let key in oldVal){
          if(oldVal.hasOwnProperty(key)){
            if(oldVal[key] && typeof oldVal[key] === "object"){
              target[key] = oldVal[key].constructor === Array?[]:{};
              target[key] = this.deepCopy(oldVal[key]);
            }else{
              target[key] = oldVal[key];
            }
          }
        }
        return target;
    },
    scatterPlotData (val) {
      let option = {
        title: {
          text: '散点图'
        },
        xAxis: {
          name: val.keys[0]
        },
        yAxis: {
          name: val.keys[1]
        },
        series: [{
          symbolSize: 10,
          data: val.values,
          type: 'scatter'
        }]
      }
      return option;
    },
  	setChart(res, n){ 
    console.log(n);     
  		let chart = echarts.init(document.getElementById("coeChart"));
      chart.clear();
      let option = {};
      if( n == "3"){        
        option = getOptionsAll(res.data, 2);
        // option = this.getCoeOption(res.data);
      }else{
        option = this.scatterPlotData(res);
      }
      console.log(option);
  		chart.setOption(option);

  	}
  }
};
</script>

<style scoped>
.coeDetail {
	width:100%;
	height: 100%;
	position: absolute;
	background-color: white;

}
.chart {
	display: flex;
	justify-content: center;
	height: 450px;
	width: 800px;
}
.close {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>