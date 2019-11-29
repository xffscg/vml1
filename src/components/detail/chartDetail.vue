<template>
	<div class="coeDetail">
		<div id="coeChart" class="chart"></div>
    <div id="treeChart" class="chart"></div>
		<div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<!-- <script type="text/javascript" src="./static/getOptionAll.js"></script> -->
<script>

import echarts from 'echarts'
// import { getOptionsAll } from './../../static/getOptionsAll'

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
    getCoeOption(res){
        let xyAxis = []
        let indexX = 0
        let indexY = 0
        let temPlot = []
        let allPlots = []
        for(let i in res){
          xyAxis.push(res[i]["Unnamed: 0"]);
        }
        for(let i in res){
          Object.keys(res[i]).forEach(function (key2) {
            if(key2 != "Unnamed: 0"){              
              temPlot = [indexY, indexX, res[i][xyAxis[indexX]]]
              allPlots.push(temPlot)
              indexX++
            }
          })
          indexX = 0
          indexY++
        }
        let correlationDatas = this.deepCopy(xyAxis);
        allPlots = allPlots.map(function (item) {
            return [item[1], item[0], item[2] || '-']
          });
          let option = {
            title: {
              text: '相关系数视图'
            },
            tooltip: {
              position: 'top'
            },
            animation: false,
            grid: {
              height: '50%',
              y: '10%'
            },
            xAxis: {
              type: 'category',
              data: xyAxis,
              splitArea: {
                show: true
              }
            },
            yAxis: {
              type: 'category',
              data: xyAxis,
              splitArea: {
                show: true
              }
            },
            visualMap: {
              min: -1,
              max: 1,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              bottom: '15%'
            },
            series: [{
              name: '相关系数',
              type: 'heatmap',
              data: allPlots,
              label: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'red' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
        option = getOptionsAll(res, 2);
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