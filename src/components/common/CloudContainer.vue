<template>
    <div class="cloud-container">
        <!-- <slot></slot> -->
        <div v-show="!notHome">home page</div>
        <div class="funcGuid" v-show="notHome">
        	<projectList></projectList>
        </div>
    </div>
</template>

<script>
import projectList from '../function/projectList'
export default {
	components: {
	    projectList
	},
	data(){
		return {
			notHome : false,
			isHome : true,
		}
	},
	computed :{
		funcType(){
			return this.$store.state.funcType;
		}
	},
	watch :{
		funcType(newV, oldV){
			console.log(newV);
			if(newV == 1){
				this.notHome = false;
				this.isHome = true;
			}else{
				this.notHome = true;
				this.isHome = false;
			}
		}
	},

};
</script>

<style scoped>
.cloud-container{
    width: 100%;
    /* height: 200%; */
}
</style>
