<template>
	<div class="project">
		<div class="addProject">
	        <el-button icon="el-icon-plus" style="width:90%" type="primary">新建项目</el-button>
	    </div>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="(item,i) in proArr">
	        	<div class="dragItem" :id="'pro'+item.id" draggable="true" @dragstart="drag($event)">
	        		<i :class="item.icon"></i>
	                <span>{{item.name}}</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { getProject, getDataSource, addProject } from '@/api/addProject'
import { Message } from 'element-ui'
export default {
	data() {
		return {
		}
	},
	mounted(){
	},
	methods :{
		drag(e){
			this.$store.commit('changeDrag', e.currentTarget.cloneNode(true));
		},
	},
	computed:{
		proArr(){
			console.log(this.$store.state.proList);
			return this.$store.state.proList;
		}
	},

};
</script>

<style scoped>
.project {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
.addProject {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.dragItem {
	width: 90%;
	height: 30px;
	font-size: 14px;
	padding: 6px;
	margin-left: 15px;
}
.dragItem:hover {
	background-color: #F2F2F0;
	font-size: 16px;
}
</style>