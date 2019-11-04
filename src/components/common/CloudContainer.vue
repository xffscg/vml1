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
	        			<div class="header">
	        				<el-button type="primary" plain icon="el-icon-video-play" @click="goRun">运行</el-button>
	        				<el-button type="primary" plain icon="el-icon-s-operation" >保存模型</el-button>
	        			</div>
	        			<diagram></diagram>
	        		</div>
	        		<div class="config"><Config></Config></div>
	        	</div>
	        	<div class="log"><RunLog></RunLog></div>	        	
	        </div>
        </div>
        <div class="detailPop"  v-show="showDetail !=0 && showDetail !=9">	          
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
			let that = this;
			console.log(r);
			let order = this.getOrder(r);
			async function runAll(){
				console.log(order);
				for(let i = 1; i< order.length; i++){
					console.log(order[i]);
					let para = this.$store.state.configData[order[i]];
					await this.allAlgApi(order[i], para);
				}
			}
			runAll.call(this);
			this.saveProject();

		},
		getOrder(r){
			console.log(r);
			let start = this.$store.state.start;
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
			return order;
		},
		saveProject(){			
			let session = window.sessionStorage;
			if(session.getItem("project")){
				session.removeItem("project");				
			}
			let project = {projectName : "", configData : {}, relationship : [], nodes : {}};
			project["configData"] = this.$store.state.configData;
			project["relationship"] = this.$store.state.relationship;
			project["nodes"] = this.$store.state.nodes;
            session.setItem('project',JSON.stringify(project));
		},
		allAlgApi(id, para){
			let type = id.slice(4);
			console.log(type);
			console.log(JSON.stringify(para));
			let that = this;
			$("#" + id).css("border","groove 5px #67C23A");
			switch(type){
				case "exp1":
					return new Promise(function(resolve, reject){
						fullTableStatistics(para).then(res => res.data)
				        .then(res => {
				          console.log('生成全表统计视图并展示')
				          console.log(res)
				          let result = {name : id, config : res};
				          that.$store.commit("changeResult", result);
				          $("#" + id).css("border","solid 2px #409EFF");
				          resolve();
				        })
				        .catch(e => {
				        	$("#" + id).css("border","solid 3px #E6A23C");
				          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
				          reject(e);
				        })
					})
			        break;
		        case "exp2":
			        return new Promise(function(resolve, reject){
							frequencyStatistics(para).then(res => res.data)
					        .then(res => {
					          console.log('生成频率统计视图并展示')
					          console.log(res)
					          let result = {name : id, config : res};
					          that.$store.commit("changeResult", result);
					           $("#" + id).css("border","solid 3px #409EFF");
					           resolve();
					        })
					        .catch(e => {
					        	$("#" + id).css("border","solid 3px #E6A23C");
					          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
					          reject(e);
					        })
						})
			        break;
		        case "exp3":
					correlationCoefficient(para).then(res => res.data)
			        .then(res => {
			          console.log('相关系数展示')
			          let result = {name : id, config : res};
			          this.$store.commit("changeResult", result);
			           $("#" + id).css("border","solid 2px #409EFF");
			           resolve();
			        })
			        .catch(e => {
			        	$("#" + id).css("border","solid 3px #E6A23C");
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试');
			          reject(e);
			        })
			        break;
		        case "exp4":
					scatterPlot(para).then(res => res.data)
			        .then(res => {
			          console.log('散点图展示')
			          console.log(res)
			          let result = {name : id, config : res};
			          this.$store.commit("changeResult", result);
			           $("#" + id).css("border","solid 2px #409EFF");
			           resolve();
			        })
			        .catch(e => {
			        	$("#" + id).css("border","solid 3px #E6A23C");
			          Message.error(e.error || 'fullTableStatistics接口错误，请重试');
			          reject(e);
			        })
			        break;
			    case "pre1":
			    	return new Promise(function(resolve, reject){
							filter({ requestStr: JSON.stringify(para) }).then(res => res.data)
					          .then(res => {
					            console.log(res)
					            let result = {name : id, config : res};
					          	that.$store.commit("changeResult", result);
					          	 $("#" + id).css("border","solid 2px #409EFF");
					          	 resolve();
					          })
					          .catch(e=>{
					          	$("#" + id).css("border","solid 3px #E6A23C");
					          	reject(e);
					          });
						})
			        break;
			    case "pre2":			    
			    	fillNullValue({ requestStr: JSON.stringify(para) }).then(res => res.data)
			          .then(res => {
			            console.log(res);
			            let result = {name : id, config : res};
			          	this.$store.commit("changeResult", result);
			          	$("#" + id).css("border","solid 2px #409EFF");
			          	resolve();
			          })
			          .catch(e=>{
			          	$("#" + id).css("border","solid 3px #E6A23C");
			          	reject(e);
			          });
			        break;
		        case "pre3":	
		       		 return new Promise(function(resolve, reject){
						columnSplit({ requestStr: JSON.stringify(para) }).then(res => res.data)
			            .then(res => {
			            console.log(res);
			            let result = {name : id, config : res};
			          	that.$store.commit("changeResult", result);
			          	$("#" + id).css("border","solid 2px #409EFF");
			          	resolve();
				          })
				          .catch(e=>{
				          	$("#" + id).css("border","solid 3px #E6A23C");
				          	reject(e);
				          });
						})		
			        break;
			    case "pre4":
			    	sort({
			          requestStr: JSON.stringify(para)
			        }).then(res => res.data)
			          .then(res => {
			            console.log(res);	
			            let result = {name : id, config : res};
			          	this.$store.commit("changeResult", result);		
			          	$("#" + id).css("border","solid 2px #409EFF");  
			          	resolve();          
			          })
			          .catch(e=>{
			          	$("#" + id).css("border","solid 3px #E6A23C");
			          	reject(e);
			          })
		        default:
		        	break;
			}
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
	      	let r = this.$store.state.relationship;
	      	let order = this.getOrder(r);
	      	let index = order.indexOf(this.menuType.type);
		  	async function runAll(){
				for(let i = index; i< order.length; i++){
					console.log(order[i]);
					let para = this.$store.state.configData[order[i]];
					await this.allAlgApi(order[i], para);
				}
			}
			runAll.call(this);
			this.saveProject();
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
	  	dataInfo(){
	  		return this.$store.state.dataList;
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
			let t = this.menuType.type.slice(4,7)
			if(newV == 1){
				if(t == "dat"){		
					let index = this.menuType.type.slice(8);
					let info = this.dataInfo[Number(index)];						
					this.getDataView(info.fileId, info.fileUrl);
				}else if(t == "pre" || t == "exp"){
					this.setResult();
				}
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
					margin : 5px;
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
		z-index : 2;

	}
}
</style>
