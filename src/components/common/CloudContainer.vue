<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="!notHome">home page</div>
        <div class="funcPart"  v-show="notHome">
        	<div class="funcGuid">
	        	<projectList v-show = "funcType == 2"></projectList>
	        	<algList v-show = "funcType == 4"></algList>
	        </div>
	        <div class="work">
	        	<diagram style="height:70%"></diagram>
	        	<RunLog style="height:30%"></RunLog>
	        </div>
	        <div class="config">
	        	<Config></Config>
	        </div>
        </div>       
    </div>
</template>

<script>
import projectList from '../function/projectList'
import algList from '../function/algList'
import diagram from '../work/diagram'
import Config from '../work/config'
import RunLog from '../work/runLog'
export default {
	components: {
	    projectList,
	    algList,
	    diagram,
	    Config,
	    RunLog
	},
	data(){
		return {
			notHome : false
		}
	},
	methods:{
    },
	computed :{
		funcType(){
			console.log(this.$store.state.funcType);
			return this.$store.state.funcType;
		}
	},
	watch :{
		funcType(newV, oldV){
			if(newV != 1){
				this.notHome = true;
			}else{
				this.notHome = false;
			}
		}
	},

};
</script>

<style lang='scss'>
.cloud-container{
    width: 100%;
    height :100%;
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
}
</style>
