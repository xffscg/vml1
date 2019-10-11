<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="!notHome">home page</div>
        <div class="funcPart"  v-show="notHome">
        	<div class="funcGuid">
	        	<projectList v-show = "funcType == 2"></projectList>
	        	<algList v-show = "funcType == 4"></algList>
	        </div>
	        <div class="work"></div>
	        <div class="config"></div>
        </div>       
    </div>
</template>

<script>
import projectList from '../function/projectList'
import algList from '../function/algList'
export default {
	components: {
	    projectList,
	    algList
	},
	data(){
		return {
			notHome : false
		}
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
    /* height: 200%; */
    .funcPart {
		width: 95%;
		display : flex;
		.funcGuid {
			width: 20%;
		}
		.work {
			width : 60%;
			border : solid 1px black;
		}
		.config {
			width : 20%;
		}

	}
}
</style>
