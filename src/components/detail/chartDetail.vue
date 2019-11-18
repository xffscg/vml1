<template>
	<div class="coeDetail">
		<div id="coeChart" class="chart"></div>
		<div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<script>
import echarts from 'echarts'
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
        Object.keys(res).forEach(function (key1) {
            xyAxis.push(key1)
            Object.keys(res[key1]).forEach(function (key2) {
              temPlot = [indexY, indexX, res[key1][key2]]
              allPlots.push(temPlot)
              indexX++
            })
            indexX = 0
            indexY++
        })
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
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          return option;
      },
  	setChart(res, n){      
  		let chart = echarts.init(document.getElementById("coeChart"));
      chart.clear();
      let option = {};
      if( n == "3"){        
        option = this.getCoeOption(res);
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