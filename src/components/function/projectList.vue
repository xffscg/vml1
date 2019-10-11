<template>
	<div class="project">
		<div class="addProject">
	        <el-button icon="el-icon-plus" style="width:90%" type="primary">新建项目</el-button>
	    </div>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	        <template v-for="(item,i) in proArr">
	        	
	          <el-submenu :index="i.toString()" :key="i">
	            <template slot="title">
	              <i :class="item.icon"></i>
	              <span slot="title">{{ item.name }}</span>
	            </template>
	            <!-- <template v-for="(subItem,i) in item.submenuList">
	              <el-menu-item :key="i" @click="know(subItem.path,subItem.submenuTitle,item.mainTitle)">
	                <i :class="subItem.icon"></i>
	                <span>{{subItem.submenuTitle}}</span>
	              </el-menu-item>
	            </template> -->
	          </el-submenu>
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
</style>