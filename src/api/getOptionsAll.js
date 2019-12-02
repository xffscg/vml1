/**
 * echarts Option
 * @authors Your Name (you@example.org)
 * @date    2019-11-28 15:44:36
 * @version $Id$
 */
export function getOptionsAll (res, n) {
  console.log(res);
  console.log(n);
  switch(n){
    case 1:
      return getBarOption(res);
      break;
    case 2:
      return getRelationOption(res);
      break;
    default:
      break;
  }
}
function getBarOption(res){
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
  return option;
}
function getRelationOption(res){
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
  let correlationDatas = deepCopy(xyAxis);
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
        bottom: '15%',
        inRange: {
            color: ['#238BCA','#49A2D9','#8FC7E8', '#C6DEED', '#E1E9EE', '#EDE5DA', '#F1DAB7', '#EDC890', '#E3A951', '#CA8824']
        }
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
    console.log(option);
    return option;
}
function deepCopy(oldVal){
    let target = oldVal.constructor === Array?[]:{};
    for(let key in oldVal){
      if(oldVal.hasOwnProperty(key)){
        if(oldVal[key] && typeof oldVal[key] === "object"){
          target[key] = oldVal[key].constructor === Array?[]:{};
          target[key] = deepCopy(oldVal[key]);
        }else{
          target[key] = oldVal[key];
        }
      }
    }
    return target;
}
