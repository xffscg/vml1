<template>
	<div class="rightMenu" @click="menuFunc($event)">
		<div class="menuItem" v-for="item in menuArr[mType]" :id="menuItem[item].id">{{menuItem[item].name}}</div>
	</div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'rightMenu',
  data(){
  	return {
      menuItem : [{
        id: 0,
        name : "删除节点"
      },{
        id : 1,
        name : "从当前节点开始运行"
      },{
        id : 2,
        name : "查看数据"
      },{
        id : 3,
        name : "查看结果"
      }],
  		menuArr : {
  			alg:[0,1,3],
  			dat:[0,1,2],
  			pre:[0,1,2]
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
  		}else if(e.target.id == 2){
        if(this.$store.state.menuOp == "data"+this.mId){
          this.$store.commit('changeShow', true);
        }else{          
          this.$store.commit('changeOp', "data"+this.mId);
        }
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