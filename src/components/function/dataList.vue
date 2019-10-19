<template>
	<div class="data">
		<div class="adddata">
	        <el-button icon="el-icon-plus" style="width:90%" type="primary">上传数据</el-button>
	    </div>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	    	<template v-for="(item,i) in dataArr">
	        	<div class="dragItem" :id="'data'+item.id" draggable="true" @dragstart="drag($event)">
	                <span>{{item.name}}</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { getDataSource } from '@/api/addProject'
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
		dataArr(){
			return this.$store.state.dataList;
		}
	},

};
</script>

<style scoped>
.data {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
.adddata {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
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