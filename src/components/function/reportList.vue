<template>
	<div class="reportList">
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	    	<template v-for="(item,i) in reportArr">
	        	<div class="dragItem" :id="'rep'+i">
	                <span>{{item.name}}</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { config } from '@/config/url'
import { getreportSource} from '@/api/addProject'
import { Message } from 'element-ui'
export default {
	name : "reportList",
	mounted(){
	},
	methods :{
	},
	computed:{
		reportArr(){
			return this.$store.state.reportList;
		}
	},

};
</script>

<style scoped>
.reportList {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
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
.dragItem:focus {
	background-color: #D8F9FC;
}
</style>