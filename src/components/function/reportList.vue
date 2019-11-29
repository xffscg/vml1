<template>
	<div class="reportList">
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	    	<template v-for="(item,i) in reportArr">
	        	<div class="dragItem">
	        		<div class="titleItem" :id='"title"+item.id' @click="editReport(item.id)">{{item.title}}</div>
	        		<div class="delItem" :id='"del"+item.id' @click="delReport(item.id)"><el-tag type="danger">删除</el-tag></div>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { config } from '@/config/url'
import { Message } from 'element-ui'
export default {
	name : "reportList",
	mounted(){
	},
	methods :{
		editReport(id){
			if(id == this.$store.state.reportId){
				this.$store.commit("changeReportId", -2);
			}
			let start = setTimeout(()=>{          
                this.$store.commit("changeReportId", id);    
            }, 300);
            start = null;
		},
		delReport(id){
			this.$emit("delR", id);
		},
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
	display: flex;
	position: relative;
	/*justify-content: space-around;*/
}
.titleItem {
	width: 65%;
	line-height: 30px;
}
.delItem {
	width: 15%;
}
.titleItem:hover {
	background-color: #F2F2F0;
	font-size: 16px;
	cursor: pointer;
}
.delItem:hover {
	font-size: 17px;	
	cursor: pointer;
}
.dragItem:focus {
	background-color: #D8F9FC;
}
</style>