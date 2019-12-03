<template>
	<div class="model">
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="(item,i) in modelArr">
	        	<div class="dragItem" :id="'mod'+i" draggable="true" @dragstart="drag($event)">
	        		<i class="el-icon-magic-stick"></i>
	                <span>{{item.name}}</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { Message } from 'element-ui'
export default {
	name : "modelList",
	data() {
		return {
			newProVisible : false,
			modelName : "",
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
		modelArr(){
			return this.$store.state.modelList;
		}
	},

};
</script>

<style scoped>
.model {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
.addmodel {
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