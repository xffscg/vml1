<template>
	<div class="alg">
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>
	        <template v-for="(item,i) in algArr">
	          <el-submenu :index="i.toString()" :key="i">
	            <template slot="title">
	              <i :class="item.icon"></i>
	              <span slot="title">{{ item.name }}</span>
	            </template>
	            <!-- <draggable  element="ul" v-model="item.list" :options="{group:{name:'people', pull:'clone', put:false }}" @start="isDragging=true" @end="isDragging=false">
					<template v-for="(subItem,i) in item.list">
		              <el-menu-item :key="i">
		                <span>{{subItem.name}}</span>
		              </el-menu-item>
		            </template>
				</draggable> -->
	            <template v-for="(subItem,i) in item.list">
	              <el-menu-item :key="i">
	                <span>{{subItem.name}}</span>
	              </el-menu-item>
	            </template>
	          </el-submenu>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
import { Message } from 'element-ui'
export default {
	data() {
		return {
			algArr : this.$store.state.algList
		}
	},
	mounted(){
		for(let item in this.algArr){
			console.log(this.algArr[item])
		}
	},
	methods :{
	},
	computed:{
	},

};
</script>

<style scoped>
.alg {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
</style>