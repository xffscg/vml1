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
	        				<el-button type="primary" plain icon="el-icon-s-operation" @click="clear">清空画布</el-button>
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
		clear(){
			let timestamp = new Date().getTime();
			this.$store.commit("changeStart", {type : "clear"});
			this.$store.commit("changeConfigOrder", {type : "clear"});
			this.$store.commit("changeLoc", {name : "clearClear"});
			this.$store.commit("changeClear", timestamp);
		},
		goRun(){
			this.saveProject();

		},
		saveProject(){			
			let session = window.sessionStorage;
			if(session.getItem("project")){
				session.removeItem("project");				
			}
			let project = {userId : 1, projectId : "1", config : {}, relationship : [], start : []};
			let runList = this.$store.state.runList;
			console.log(runList);
			let loc = this.$store.state.location;
			project["config"] = this.deepCopy(this.$store.state.configData);
			console.log(project["config"]);
			for(let i in project["config"]){
				console.log(i);
				console.log(runList[i].next);
				project["config"][i]["next"] = this.deepCopy(runList[i].next);
				project["config"][i]["pre"] = this.deepCopy(runList[i].pre);
				project["config"][i]["location"] = this.deepCopy(loc[i]);
			}
			project["relationship"] = this.$store.state.relationship;
			project["start"] = this.deepCopy(this.$store.state.start);
			console.log(project);
            session.setItem('project',JSON.stringify(project));
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
					let info = this.$store.state.configData[this.menuType.type].config;
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
					width : 24%;
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
