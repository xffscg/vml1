<template>
	<div class="rightMenu" @click="menuFunc($event)">
		<div class="menuItem" v-for="(item, i) in menuArr[mType]" :id="i">{{item}}</div>
	</div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'rightMenu',
  data(){
  	return {
  		menuArr : {
  			alg:["删除节点", "从当前节点开始运行","查看模型"],
  			dat:["删除节点", "从当前节点开始运行","查看数据"],
  			pre:["删除节点", "从当前节点开始运行","查看结果"]
  		},
  		mType : "",
  		mId : ""
  	}
  },
  computed :{
	menuType(){
		return this.$store.state.menuType;
	},
  },
  watch: {
  	menuType(newV){
  		this.mType = newV.type.slice(4,7);
  		this.mId = newV.type;
		$('.rightMenu').css('left',newV.left);
		$('.rightMenu').css('top',newV.top);
	},
  },
  methods:{
  	menuFunc(e){
  		if(e.target.id == 0){
  			this.$store.commit('changeOp', "del"+this.mId);
  		}
  	},
  },
};
</script>

<style>
.rightMenu {
	position: absolute;
	display: flex;
	flex-direction: column;
	width: 150px;
	min-height: 60px;
	border: solid 1px black;
}
.menuItem {
	height: 35px;
	width: 100%;
	border-bottom: solid 1px black;
	text-align: center;
	line-height: 35px;
	font-weight: bold;
	background-color: #EEEEE4;
}
.menuItem:last-child {
	border-bottom: none;
}
.menuItem:hover{
	background-color: #F9F9F4;
}
</style>