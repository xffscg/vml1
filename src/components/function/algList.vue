<template>
	<div class="alg">
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	        <template v-for="(item,i) in algArr">
	          <el-submenu :index="i.toString()" :key="i">
	            <template slot="title">
	              <i :class="item.icon"></i>
	              <span slot="title">{{ item.name }}</span>
	            </template>
	            <template v-for="(subItem,i) in item.list">
	            	<div class="dragItem" :id="subItem.id" draggable="true" @dragstart="drag($event)">
		                <span>{{subItem.name}}</span>
		            </div>
	            </template>
	          </el-submenu>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { Message } from 'element-ui'
export default {
	components :{
		draggable
	},
	data() {
		return {
			test : false,
		}
	},
	mounted(){
	},
	methods :{
		drag(e){
			this.$store.commit('changeDrag', e.currentTarget.cloneNode(true));
		}
	},
	computed:{
		algArr(){
			return this.$store.state.algList;
		}
	},
	watch :{
	}

};
</script>

<style scoped>
.alg {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
.dragItem {
	width: 90%;
	height: 30px;
	font-size: 15px;
	padding: 2px;
	text-align: center;
}
.dragItem:hover {
	background-color: #F2F2F0;
	font-size: 16px;
}
</style>