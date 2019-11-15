<template>
	<div class="project">
		<div class="addProject">
	        <el-button icon="el-icon-plus" style="width:90%" type="primary" @click="newProVisible=true">新建项目</el-button>
	    </div>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="(item,i) in proArr">
	        	<div class="dragItem" :id="'pro'+item.id" draggable="true" @dragstart="drag($event)">
	        		<i :class="item.icon"></i>
	                <span>{{item.name}}</span>
	            </div>
	        </template>
	    </el-menu>
	    <el-dialog
  			title="新建项目"
  			:visible.sync="newProVisible"
  			width="30%">
  			<el-input v-model="projectName" placeholder="请输入项目名称"></el-input>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="newProVisible = false">取 消</el-button>
		    <el-button type="primary" @click="createProject">提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult } from '@/api/addProject'
import { Message } from 'element-ui'
export default {
	data() {
		return {
			newProVisible : false,
			projectName : "",
		}
	},
	mounted(){
	},
	methods :{
		drag(e){
			this.$store.commit('changeDrag', e.currentTarget.cloneNode(true));
		},
		createProject(){
			addProject({userId : this.$store.state.userId, projectName : this.projectName}).then(res=>res.data)
			.then(res=>{
				console.log(res);
				this.$store.commit("changeProId", res[res.length-1].id);
				this.$store.commit('getPro', res);
				this.newProVisible = false;
			})
			.catch(e=>{
				console.log(e);
				Message.error(e.error || '新建项目失败，请重试')
			})
		},
	},
	computed:{
		proArr(){
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