<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="funcType == 1" class="homePart"><CoverPage @createCoverPro="createCoverPro"></CoverPage></div>        
        <div class="funcPart"  v-show="funcType != 1">
        	<div class="funcGuid">
	        	<projectList v-show = "funcType == 3" ref="projectList" @save="saveProject"></projectList>
	        	<algList v-show = "funcType == 4"></algList>
	        	<dataList v-show = "funcType == 2"></dataList>
	        	<reportList v-show = "funcType == 6" @delR="yesDialog"></reportList>
	        	<modelList v-show = "funcType == 7"></modelList>
	        	<ChooseList v-show = "funcType == 5" ref="ChooseList" @addContent="addContent" @delContent="delContent"  @reflow="reflowContent"></ChooseList>
	        </div>
	        <div class="work" v-show = "funcType != 5">
	        	<div class="workTop">
	        		<div class="diagram">
	        			<div class="header">
	        				<el-button type="success" plain icon="el-icon-document-checked" @click="saveProject">保存项目</el-button>
	        				<el-button type="primary" plain icon="el-icon-video-play" @click="goRun">运行</el-button>
	        				<el-button type="danger" plain icon="el-icon-video-pause" @click="stopRun">停止运行</el-button>
	        				<el-button type="warning" plain icon="el-icon-delete" @click="clear">清空画布</el-button>
	        				<el-button type="primary" plain icon="el-icon-document" @click="getCreateReport">生成报告</el-button>
	        			</div>
	        			<diagram ref="diagram" @setLog="setLog" @goConfig="goConfig" @clearSuccess="clearSuccess"></diagram>
	        		</div>
	        		<div class="config"><Config ref="Config"></Config></div>
	        	</div>
	        	<div class="log"><RunLog ref="RunLog" @changeD="changeStyle"></RunLog></div>	        	
	        </div>
	        <div class="reportPart" v-show = "funcType == 5"><Report ref="Report" @setChooseData="setChooseData"></Report></div>
        </div>
        <div class="detailPop"  v-show="showDetail !=0 && showDetail !=9">	          
	    </div>
	    <div class="detail" v-show="showDetail == 1"><Detail  :tableData="tableData.data" :column="tableData.column" :length="tableData.length" :title="tableData.title"></Detail></div>	      
	    <div class="detail" v-show="showDetail == 2"><ChartDetail ref="ChartDetail"></ChartDetail></div>
	    <div class="detail" v-show="showDetail == 3"><TableChartDetail ref="TableChartDetail" :tableData="temFrequencyTable" :freName="freName"></TableChartDetail></div>	
	    <el-dialog
  			title="新建项目"
  			:visible.sync="newProVisible"
  			width="30%">
  			<el-input v-model="projectName" placeholder="请输入项目名称"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="newProVisible = false">取 消</el-button>
		    <el-button type="primary" @click="createProject">提交</el-button>
		  </span>
		</el-dialog>  
		<el-dialog
  			title="保存模型"
  			:visible.sync="modelVisible"
  			width="30%">
  			<el-input v-model="modelName" placeholder="请输入模型名称"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="modelVisible = false">取 消</el-button>
		    <el-button type="primary" @click="saveModel">提交</el-button>
		  </span>
		</el-dialog> 
    </div>
</template>

<script>
import { rawDataPreview, currentDataPreview, getAlgriList } from '@/api/dataSource'
import { getModel, saveModel, deleteModel } from '@/api/model'
import { fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult, executeAll, executeFromOne, getDataResult } from '@/api/addProject'
import { getReport, deleteReport, updateReport, saveReport } from '@/api/reportOp'
import { Message } from 'element-ui'
import projectList from '../function/projectList'
import algList from '../function/algList'
import dataList from '../function/dataList'
import reportList from '../function/reportList'
import modelList from '../function/modelList'
import diagram from '../work/diagram'
import Config from '../work/config'
import RunLog from '../work/runLog'
import Detail from '../detail/detail'
import Report from '../work/report'
import ChartDetail from '../detail/chartDetail'
import TableChartDetail from '../detail/tableChartDetail'
import ChooseList from '../report/chooseList'
import CoverPage from '../work/coverPage'
export default {
	components: {
	    projectList,
	    algList,
	    dataList,
	    modelList,
	    diagram,
	    Config,
	    RunLog,
	    Detail,
	    Report,
	    reportList,
	    ChartDetail,
	    TableChartDetail,
	    ChooseList,
	    CoverPage
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
			interval : 1000,
			newProVisible : false,
			modelVisible : false,
			projectName : "",
			modelName : ""
		}
	},
	mounted(){
		this.clear();
	},
	methods:{
		saveModel(){
			let id = this.$store.state.menuType.type;
			let para = {userId : this.$store.state.userId, name : this.modelName, operatorId : id};
			this.modelVisible = false;
			saveModel(para).then(res=>res.data)
	          .then(res=>{
	          	console.log(res);
	          })
		      .catch(e => {
		          Message.error(e.errors || '保存模型错误')
		        })
		},
		createCoverPro(id){
			if(id == -1){
				this.$store.commit('changeType', 4);
				this.newProVisible = true;
			}else{
				this.$store.commit('changeType', 4);
				this.$refs.diagram.createCoverProject(id);
			}
		},
		setChooseData(data){
			this.$refs.ChooseList.setChooseData(data);
		},
		yesDialog(id){
	        this.$confirm('此操作将永久删除该报告, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          deleteReport({reportId : id}).then(res=>res.data)
	          .then(res=>{
	          	console.log(res);
	          	getReport({params :{userId : this.$store.state.userId}}).then(res => res.data)
			      .then(res => {
			        console.log(res);
			        this.$store.commit('getReport', res);
          			Message.success("报告删除成功");
			      })
			      .catch(e => {
			          Message.error(e.errors || '算法接口错误，请重试')
			        })
	          })
	        }).catch(() => {
	          Message.info("已取消")         
	        });
		  },
		createProject(){
			addProject({userId : this.$store.state.userId, projectName : this.projectName}).then(res=>res.data)
			.then(res=>{
				console.log(res);
				this.$store.commit("changeProId", res[res.length-1].id);
				this.$store.commit('getPro', res);
				this.newProVisible = false;
				this.saveProject();
			})
			.catch(e=>{
				console.log(e);
				Message.error(e.error || '新建项目失败，请重试')
			})
		},
		goConfig(id){
			this.$refs.Config.setConfig(id);
		},
		clearSuccess(id){
			this.$refs.RunLog.fromOne(id);
		},
		clear(){
			let timestamp = new Date().getTime();
			this.$store.commit("changeStart", {type : "clear"});
			this.$store.commit("changeConfigOrder", {type : "clear"});
			this.$store.commit("changeLoc", {name : "clearClear"});
			this.$store.commit("changeClear", timestamp);
			this.$store.commit("changeResult", {type : "clear"});
		},
		getCreateReport(){
			// this.$store.commit('changeReportList', {type : "add", detail : {name : "新建报告"}});
			// this.$refs.Report.createReport();
			this.$refs.ChooseList.getNode();
			this.$store.commit("changeReportId", -1);
			this.$store.commit('changeType', 5);
		},
		addContent(node){
			this.$refs.Report.createReport(node);
		},
		delContent(node){
			this.$refs.Report.delContent(node);
		},
		reflowContent(node){
			this.$refs.Report.reflow(node);
		},
		changeStyle(node){
			this.$refs.diagram.changeClass(node.state, node.id);
		},
		goRun(){
			let list = this.$store.state.configData;
			for(let i in list){
				this.$refs.diagram.changeClass("initial", i);
			}
			executeAll({userId : this.$store.state.userId, projectId :this.$store.state.projectId}).then(res=>res.data)
			.then(res=>{
				console.log(res);
				Message.success("项目开始运行")
				let start = setTimeout(()=>{	
					 this.$refs.RunLog.clearLog(); 				
      				this.$refs.RunLog.queryResult(res.model_execute_id);
				}, 1000);
				start = null;
			})
			.catch(e=>{
				Message.error(e.error || "运行错误");
			})
		},
		stopRun(){
			this.$refs.RunLog.start = null;
		},
		setLog(id){				
      		this.$refs.RunLog.queryResult(id);
		},
		saveProject(){
			if(this.$store.state.projectId == -1){
				this.newProVisible = true;
			}else{
				let project = {userId : this.$store.state.userId, projectId : this.$store.state.projectId, config : {}, relationship : [], startNode : [], configOrder : {}};
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
		    }
		    Message.success("项目已保存")
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
	          this.tableData.title = "数据详情";
	          console.log(this.tableData.column);
	        })
	        .catch(e => {
	          Message.error(e.errors || 'rawDataPreview接口错误，请重试')
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
		setResult(n){
			this.tableData = {
				data : [],
				column : [],
				length : 0,
				title : ""
			};
			console.log(n);
			getDataResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId : this.menuType.type, start : 0, end : 50})
			.then(res=>res.data).then(res=>{
				console.log(res);
				if(this.menuType.type.slice(4,7) == "eva"){
					this.tableData.column.push({prop : "评估指标"});
					this.tableData.column.push({prop : "评估结果"});
					for(let i in res[n].data){
						let obj = {};
						obj["评估指标"] = res[n].data[i]["指标"];
						obj["评估结果"] = res[n].data[i]["值"];
						this.tableData.data.push(obj);
					}
					this.tableData.title = "评估结果";

					this.tableData.length = res[n].length;
				}else{
					this.tableData.data = res[n].data;
					for(let item in res[n].data[0]){
						console.log(item);
						this.tableData.column.push({prop : item});
					}

					this.tableData.title = "当前节点结果";
					this.tableData.length = res[n].length;
				}
				console.log(this.tableData);

			})
			.catch(e=>{
				Message.error("请求结果错误")
			})
			
		},
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
	  	reportId(){
	  		return this.$store.state.reportId;
	  	}
	},
	watch :{
		reportId(newV){
			if(newV != -1){
				this.$store.commit('changeType', 5);
			}
		},
		showDetail(newV){		
		    console.log(newV);		
			let t = this.menuType.type.slice(4,7);
			let op = this.$store.state.menuOp;
			console.log(op.slice(0,3));
			if(newV == 1){
				if(op.slice(0,4) == "dat1"){
					this.setResult(0);
				}else if(op.slice(0,4) == "dat2"){
					this.setResult(1);
				}else{
					if(t == "dat"){		
						let info = this.$store.state.configData[this.menuType.type].config;
						this.getDataView(info.fileId, info.fileUrl[0][this.menuType.type]);
					}else if(t == "pre" || t == "fea" || t == "exp" || t == "mln" || t == "eva"){
						this.setResult(0);
					}
				}
			}else if(newV == 2){
				// let res = this.$store.state.runResult[newV];
				// this.$refs.ChartDetail.setChart(res, this.menuType.type.slice(7,8));

				// 为暂时替代
				let that = this;
				getDataResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId : this.menuType.type, start : 0, end : 50})
				.then(res=>res.data).then(res=>{
					console.log(res);
					if(that.menuType.type.slice(7,8) == "3"){
						that.$refs.ChartDetail.setChart(res[0], that.menuType.type.slice(7,8));
					}else{
						that.$refs.ChartDetail.setChart(res[0], that.menuType.type.slice(7,8));
					}
					
				})
				.catch(e=>{
					Message.error("请求结果错误")
				})
				
			}else if(newV == 3){
				let that = this;
				getDataResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId : this.menuType.type, start : 0, end : 50})
				.then(res=>res.data).then(res=>{
					that.temFrequencyTable = [];
					for(let i in res[0].data){
						if(i == 0){
							for(let key in res[0].data[i]){
								if(key != "elm" && key != "频率" && key != "isRootInsert"){
									that.freName = key;
								}
							}
						}
						let obj = {columnName : res[0].data[i][that.freName], rate : res[0].data[i]["频率"]};
						that.temFrequencyTable.push(obj);
					}
					that.$refs.TableChartDetail.setChart(that.temFrequencyTable);					
				})
				.catch(e=>{
					Message.error("请求结果错误")
				})
			}else if(newV == 9){
				console.log(newV);
				this.modelVisible = true;
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
    .homePart {
    	width : 99%;
    	height : 700px;
    }
    .funcPart {
		width: 100%;
	    display :flex;
		.funcGuid {
			width : 15%;		
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
			width : 84%;
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
