<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="funcType == 1">home page</div>        
        <div class="funcPart"  v-show="funcType != 1">
        	<div class="funcGuid">
	        	<projectList v-show = "funcType == 3"></projectList>
	        	<algList v-show = "funcType == 4"></algList>
	        	<dataList v-show = "funcType == 2"></dataList>
	        	<reportList v-show = "funcType == 6"></reportList>
	        	<ChooseList v-show = "funcType == 5"></ChooseList>
	        </div>
	        <div class="work" v-show = "funcType != 5">
	        	<div class="workTop">
	        		<div class="diagram">
	        			<div class="header">
	        				<el-button type="primary" plain icon="el-icon-video-play" @click="saveProject">保存项目</el-button>
	        				<el-button type="primary" plain icon="el-icon-video-play" @click="goRun">运行</el-button>
	        				<el-button type="primary" plain icon="el-icon-s-operation" >保存模型</el-button>
	        				<el-button type="primary" plain icon="el-icon-s-operation" @click="clear">清空画布</el-button>
	        				<el-button type="primary" plain icon="el-icon-s-operation" @click="getReport">生成报告</el-button>
	        			</div>
	        			<diagram ref="diagram"></diagram>
	        		</div>
	        		<div class="config"><Config></Config></div>
	        	</div>
	        	<div class="log"><RunLog ref="RunLog" @changeD="changeStyle"></RunLog></div>	        	
	        </div>
	        <div class="reportPart" v-show = "funcType == 5"><Report ref="Report"></Report></div>
        </div>
        <div class="detailPop"  v-show="showDetail !=0 && showDetail !=9">	          
	    </div>
	    <div class="detail" v-show="showDetail == 1"><Detail  :tableData="tableData.data" :column="tableData.column" :length="tableData.length" :title="tableData.title"></Detail></div>	      
	    <div class="detail" v-show="showDetail == 2"><ChartDetail ref="ChartDetail"></ChartDetail></div>
	    <div class="detail" v-show="showDetail == 3"><TableChartDetail ref="TableChartDetail" :tableData="temFrequencyTable" :freName="freName"></TableChartDetail></div>	   
    </div>
</template>

<script>
import { rawDataPreview, currentDataPreview, getAlgriList } from '@/api/dataSource'
import { fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
import { filter, fillNullValue, columnMap, columnSplit, columnsMerge, sort, replace } from '@/api/dataProcess'
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult, executeAll, executeFromOne } from '@/api/addProject'
import { Message } from 'element-ui'
import projectList from '../function/projectList'
import algList from '../function/algList'
import dataList from '../function/dataList'
import reportList from '../function/reportList'
import diagram from '../work/diagram'
import Config from '../work/config'
import RunLog from '../work/runLog'
import Detail from '../work/detail'
import Report from '../work/report'
import ChartDetail from '../work/chartDetail'
import TableChartDetail from '../work/tableChartDetail'
import ChooseList from '../report/chooseList'
export default {
	components: {
	    projectList,
	    algList,
	    dataList,
	    diagram,
	    Config,
	    RunLog,
	    Detail,
	    Report,
	    reportList,
	    ChartDetail,
	    TableChartDetail,
	    ChooseList
	},
	data(){
		return {
			// notHome : false,
			tableData : {
				data : [],
				column : [],
				length : 0,
				title : ""
			},
			temFrequencyTable : [],
			freName : "",
			polling : null,
			times : 0,
			interval : 1000
		}
	},
	methods:{
		clear(){
			let timestamp = new Date().getTime();
			this.$store.commit("changeStart", {type : "clear"});
			this.$store.commit("changeConfigOrder", {type : "clear"});
			this.$store.commit("changeLoc", {name : "clearClear"});
			this.$store.commit("changeClear", timestamp);
			this.$store.commit("changeResult", {type : "clear"});
		},
		getReport(){
			this.$store.commit('changeReportList', {type : "add", detail : {name : "新建报告"}});
			this.$refs.Report.createReport();
			this.$store.commit('changeType', 5);
		},
		changeStyle(node){
			this.$refs.diagram.changeClass(node.state, node.id);
		},
		goRun(){
			executeAll({userId : this.$store.state.userId, projectId :32}).then(res=>res.data)
			.then(res=>{
				console.log(res);
				let start = setTimeout(()=>{	
					this.$refs.RunLog.clearLog(); 				
	          		this.$refs.RunLog.queryResult(); 
				}, 1000);
				start = null;
			})
			.catch(e=>{
				Message.error(e.error || "运行错误");
			})
		},
		saveProject(){	
			let project = {userId : 1, projectId : 32, config : {}, relationship : [], startNode : [], configOrder : {}};
			let runList = this.$store.state.runList;
			console.log(runList);
			let loc = this.$store.state.location;
			let configer = this.deepCopy(this.$store.state.configData);
			for(let i in configer){
				configer[i]["next"] = this.deepCopy(runList[i].next);
				configer[i]["pre"] = this.deepCopy(runList[i].pre);
				configer[i]["location"] = this.deepCopy(loc[i]);
			}
			project["config"] = JSON.stringify(this.deepCopy(configer));
			project["relationship"] = JSON.stringify(this.deepCopy(this.$store.state.relationship));
			project["startNode"] = JSON.stringify(this.deepCopy(this.$store.state.start));
			project["configOrder"] = JSON.stringify(this.deepCopy(this.$store.state.configOrder));
			console.log(project);
            goRun(project).then(res => res.data)
	        .then(res => {
	          console.log(res);
	        })
	        .catch(e => {
	          Message.error(e.error || 'run接口错误，请重试')
	        })
		},		
		getDataView(id, url){
		  this.tableData = {
				data : [],
				column : [],
				length : 0,
				title : ""
			};
	      // this.tableCol = [];
	      let para = { start: 1, end: 50, userId: 1, fileId : id, fileUrl : url};
	      rawDataPreview(para).then(res => res.data)
	        .then(res => {
	          console.log(res);
	          this.tableData.data = res.data;
	          this.tableData.length = res.length;
	          for (var key in res.data[0]) {
	            this.tableData.column.push({ prop: key })
	          }
	          this.tableData.column[0].fixed = 'left';
	          console.log(this.tableData.column);
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
		},
		setResult(){
			this.tableData = {
				data : [],
				column : [],
				length : 0,
				title : ""
			};
			let res = this.$store.state.runResult[this.menuType.type];
			this.tableData.data = res.data;
			this.tableData.length = res.length;
			for(let item in res.data[0]){
				console.log(item);
				this.tableData.column.push({prop : item});
			}
			this.tableData.column[0].fixed = "left";
		},
		runFrom(){
			console.log(9);
	      	let id = this.menuType.type;
	      	this.initialStyle(id);
	      	executeFromOne({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId: id})
	      	.then(res=>res.data).then(res=>{
	      		console.log(res);
	      		this.$refs.RunLog.clearLog(); 				
          		this.$refs.RunLog.queryResult();
	      	})
	      	.catch(e=>{
	      		Message.error("运行失败");
	      	})
	    },
	    initialStyle(id){
	    	let list = this.$store.state.runList;
	    	if(runList[id].next.length != 0){
	    		for(let i in runList[id].next){
	    			this.$refs.diagram.changeClass("initial", id);
	    			this.initialStyle(runList[id].next[i]);
	    		}
	    	}
	    }
	    
    },
	computed :{
		funcType(){
			console.log(this.$store.state.funcType);
			return this.$store.state.funcType;
		},
		showDetail(){
			return this.$store.state.showDetail;
		},
		menuType(){
	  		return this.$store.state.menuType;
	  	},
	},
	watch :{
		showDetail(newV){		
		    console.log(newV);		
			let t = this.menuType.type.slice(4,7)
			if(newV == 1){
				console.log(t);
				if(t == "dat"){		
					let info = this.$store.state.configData[this.menuType.type].config;
					this.getDataView(info.fileId, info.fileUrl);
				}else if(t == "pre" || t == "fea" || t == "exp"){
					this.setResult();
				}
			}else if(newV == 2){
				// let res = this.$store.state.runResult[newV];
				// this.$refs.ChartDetail.setChart(res, this.menuType.type.slice(7,8));

				// 为暂时替代
				let that = this;
				if(this.menuType.type.slice(7,8) == "3"){
					correlationCoefficient({ projectName: "特征工程测试项目", columnNames: JSON.stringify(["数量", "销售额", "折扣"]) }).then(res => res.data) // 列名的传送和处理待定
			        .then(res => {
			          console.log(res)
					that.$refs.ChartDetail.setChart(res, this.menuType.type.slice(7,8));
			        })
			        .catch(e => {
			          Message.error(e.error || 'correlationCoefficient接口错误，请重试')
			        })
				}else{
					scatterPlot({ projectName: "特征工程测试项目", columnNames: JSON.stringify(["数量", "销售额"]) }).then(res => res.data)
			        .then(res => {
			          console.log(res);
			         that.$refs.ChartDetail.setChart(res, this.menuType.type.slice(7,8));
			        })
			        .catch(e => {
			          Message.error(e.error || '接口错误，请重试')
			        })
				}
				// 暂时替代
				
			}else if(newV == 3){
				// let res = this.$store.state.runResult[newV];
				// this.temFrequencyTable = []
		  //       for (let index in res) {
		  //         	let obj = {}
		  //           obj.columnName = index
		  //           obj.rate = res[index]
		  //           this.temFrequencyTable.push(obj)
		  //       }
				// let config = this.$store.state.configData[newV].config;
				// this.freName = config.columnNames[0];
				// this.$refs.TableChartDetail.setChart(this.temFrequencyTable);
				let that = this;
				frequencyStatistics({ projectName: "特征工程测试项目", columnNames: JSON.stringify(["产品名称"]) }).then(res => res.data)
		        .then(res => {
		          console.log(res)
		          that.temFrequencyTable = []
		          for (let index in res) {
		          	let obj = {}
		            obj.columnName = index
		            obj.rate = res[index]
		            that.temFrequencyTable.push(obj)
		          }
		          that.freName = "产品名称"
		          that.$refs.TableChartDetail.setChart(that.temFrequencyTable);
		        })
		        .catch(e => {
		          Message.error(e.error || 'frequencyStatistics接口错误，请重试')
		        })
			}else if(newV == 9){
				this.runFrom();
			}
		},
	},

};
</script>

<style lang='scss'>
.cloud-container{
    width: 100%;
    position:relative;
    background-color: #FCFCF2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .funcPart {
		width: 100%;
	    display :flex;
		.funcGuid {
			width : 20%;		
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		}
		.work {
			flex : 1;
			display : flex;
			flex-direction : column;
			position :relative;
			margin:5px;		
			.workTop {
				width : 100%;
				background-color : #FFFFFF;
				display : flex;
				box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
				.diagram {
					width : 75%;			
					display : flex;
					flex-direction: column;
					.header {
						height : 50px;
						background-color:#FFFFFC;
					}
				}
				.config {
					width : 24%;
					margin : 5px;
				}
			}
			.log {
				flex : 1;
			}
		}
		.reportPart {
			flex : 1;
			position :relative;
			margin:5px;
			height : 700px;	
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
		z-index : 2;

	}
}
</style>
