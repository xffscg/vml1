<template>
	<div class="data">
		<div class="adddata">
			<!-- <form method=post enctype=multipart/form-data :action="uploadUrl">
				<input type=file name=file>
         		<input type=button value=上传 @click="upload">
			</form> -->
			<el-upload class="upload-demo" method=post enctype=multipart/form-data :action="uploadUrl">
				<el-button icon="el-icon-plus" style="width:90%" type="primary">上传数据</el-button>
			</el-upload>
			<!-- <form method=post enctype=multipart/form-data>
		         <el-input type=file name=file value="上传"></el-input>
		    </form> -->
	        <!-- <el-button icon="el-icon-plus" style="width:90%" type="primary">上传数据</el-button> -->
	    </div>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	    	<template v-for="(item,i) in dataArr">
	        	<div class="dragItem" :id="'data'+i" draggable="true" @dragstart="drag($event)">
	                <span>{{item.fileName}}</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { config } from '@/config/url'
import { getDataSource} from '@/api/addProject'
import { Message } from 'element-ui'
export default {
	data() {
		return {
			uploadUrl : config.visualUrl+config.addData
		}
	},
	mounted(){
	},
	methods :{
		drag(e){
			this.$store.commit('changeDrag', e.currentTarget.cloneNode(true));
		},
		upload(){
			let formData = new FormData()
		}
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