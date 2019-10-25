<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="!notHome">home page</div>
        
        <div class="funcPart"  v-show="notHome">
        	<div class="funcGuid">
	        	<projectList v-show = "funcType == 3"></projectList>
	        	<algList v-show = "funcType == 4"></algList>
	        	<dataList v-show = "funcType == 2"></dataList>
	        </div>
	        <div class="work">
	        	<div class="workTop">
	        		<div class="diagram">
	        			<div class="header" @click="goRun"><span><i class="el-icon-video-play"></i>Run</span></div>
	        			<diagram></diagram>
	        		</div>
	        		<div class="config"><Config></Config></div>
	        	</div>
	        	<div class="log"><RunLog></RunLog></div>	        	
	        </div>
        </div>
        <div class="detailPop"  v-show="showDetail !=0">	          
	    </div>
	    <div class="detail" v-show="showDetail == 1"><Detail :tableData="tableData.data" :column="tableData.column" :length="tableData.length" :title="tableData.title"></Detail></div>
	    <div class="detail" v-show=""></div>
	         
    </div>
</template>

<script>
import { rawDataPreview, currentDataPreview } from '@/api/dataSource'
import { fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
import { filter, fillNullValue, columnMap, columnSplit, columnsMerge, sort, replace } from '@/api/dataProcess'
import { Message } from 'element-ui'
import projectList from '../function/projectList'
import algList from '../function/algList'
import dataList from '../function/dataList'
import diagram from '../work/diagram'
import Config from '../work/config'
import RunLog from '../work/runLog'
import Detail from '../work/detail'
export default {
	components: {
	    projectList,
	    algList,
	    dataList,
	    diagram,
	    Config,
	    RunLog,
	    Detail
	},
	data(){
		return {
			notHome : false,
			tableData : {
				data : [],
				column : [],
				length : 0,
				title : ""
			},
		}
	},
	methods:{
		goRun(){
			let start = this.$store.state.start;
			let r = this.$store.state.relationship;
			console.log(r);
			let order = [];
			let flag = Array(r.length);
			flag.fill(0);
			order.push(start[0]);
			let time = 0;
			while(flag.some(function(v){ return (v == 0)}) && time < 10){
				for(let i = 0; i < r.length; i++){
					if(flag[i] == 0){
						if(r[i][0] == start){
							order.push(r[i][1]);
							flag[i] = 1;
							start = r[i][1];
						}
					}
				}
				time += 1;
			}
			console.log(order);
			for(let i = 1; i< order.length; i++){
				let para = this.$store.state.configData[order[i]];
				this.allAlgApi(order[i].slice(4), para);
			}
		},
		allAlgApi(type, para){
			console.log(type);
			console.log(JSON.stringify(para));
			switch(type){
				case "exp1":
					fullTableStatistics(para).then(res => res.data)
			        .then(res => {
			          console.log('生成全表统计视图并展示')
			          console.log(res)
			        })
			        .catch(e => {
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
			        })
			        break;
		        case "exp2":
					frequencyStatistics(para).then(res => res.data)
			        .then(res => {
			          console.log('生成频率统计视图并展示')
			          console.log(res)
			        })
			        .catch(e => {
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
			        })
			        break;
		        case "exp3":
					correlationCoefficient(para).then(res => res.data)
			        .then(res => {
			          console.log('相关系数展示')
			          console.log(res)
			        })
			        .catch(e => {
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
			        })
			        break;
		        case "exp4":
					scatterPlot(para).then(res => res.data)
			        .then(res => {
			          console.log('散点图展示')
			          console.log(res)
			        })
			        .catch(e => {
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
			        })
			        break;
			    case "pre1":
			    	filter({ requestStr: JSON.stringify(para) }).then(res => res.data)
			          .then(res => {
			            console.log(res)
			          });
			        break;
			    case "pre2":			    
			    	fillNullValue({ requestStr: JSON.stringify(para) }).then(res => res.data)
			          .then(res => {
			            console.log(res)
			          });
			        break;
		        case "pre3":			    
			    	columnSplit({ requestStr: JSON.stringify(para) }).then(res => res.data)
			          .then(res => {
			            console.log(res)
			          });
			        break;
			    case "pre4":
			    	sort({
			          requestStr: JSON.stringify(para)
			        }).then(res => res.data)
			          .then(res => {
			            console.log(res);			            
			          })
		        default:
		        	break;
			}
		},
		getDataView(){
		  this.tableData = {
				data : [],
				column : [],
				length : 0,
				title : ""
			};
	      // this.tableCol = [];
	      rawDataPreview({ start: 1, end: 50, projectName: "医药病例分类分析" }).then(res => res.data)
	        .then(res => {
	          console.log(res);
	          this.tableData.data = res.data;
	          this.tableData.length = res.length;
	          for (var key in res.data[0]) {
	            this.tableData.column.push({ prop: key })
	          }
	          this.ttableData.column[0].fixed = 'left';
	        })
	        .catch(e => {
	          // Message.error(e.errors || 'rawDataPreview接口错误，请重试')
	        })
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
		}
    },
	computed :{
		funcType(){
			console.log(this.$store.state.funcType);
			return this.$store.state.funcType;
		},
		showDetail(){
			return this.$store.state.showDetail;
		}
	},
	watch :{
		funcType(newV, oldV){
			if(newV != 1){
				this.notHome = true;
			}else{
				this.notHome = false;
			}
		},
		showDetail(newV){
			if(newV == 1){
				this.getDataView();
			}
		}
	},

};
</script>

<style lang='scss'>
.cloud-container{
    width: 100%;
    height :100%;
    position:relative;
    .funcPart {
		width: 100%;
		height:100%;
	    display :flex;
		.funcGuid {
			width : 20%;			
			height:95%;
		}
		.work {
			flex : 1;
			display : flex;
			flex-direction : column;
			border : solid 1px black;
			position :relative;
			margin:2%;			
			height:95%;
			.workTop {
				height : 70%;
				width : 100%;
				.diagram {
					width : 70%;
					float : left;
					height : 100%;
					.header {
						height : 50px;
						background-color:#FFFFFC;
					}
				}
				.config {
					width : 25%;
					float :right;
					height : 100%;
				}
			}
			.log {
				flex : 1;
			}
		}

	}
	.detailPop {
		width : 100%;
		height: 100%;
	    position:absolute;
		left: 0;
		top: 0;
	    filter: Alpha(opacity=60);
	    opacity:0.6;
	    background:#000000;
	}
	.detail{
		width: 80%;
		height: 80%;
		position: fixed;
		left: 0;
		top:0;
		margin:5% 10% 5% 10%;

	}
}
</style>
