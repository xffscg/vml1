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
	        	<diagram style="height:70%"></diagram>
	        	<RunLog style="height:30%"></RunLog>
	        </div>
	        <div class="config">
	        	<Config></Config>
	        </div>
        </div>
        <div class="detailPop"  v-show="showDetail">	          
	    </div>
	    <div class="detail"><Detail v-show="showDetail"></Detail></div>
	         
    </div>
</template>

<script>
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
		}
	},
	methods:{
    },
	computed :{
		funcType(){
			console.log(this.$store.state.funcType);
			return this.$store.state.funcType;
		},
		showDetail(){
			console.log(this.$store.state.showDetail);
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
			border : solid 1px black;
			position :relative;
			margin:2%;			
			height:95%;
		}
		.config {
			width :20%;			
			height:95%;
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
