<template>
	<div class="rightMenu" @click="menuFunc($event)">
		<div class="menuItem" v-for="item in menuArr[mType]" :id="menuItem[item].id">{{menuItem[item].name}}</div>
	</div>
</template>

<script>
import $ from 'jquery'
import { getModel, saveModel, deleteModel } from '@/api/model'
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
      },{
        id : 4,
        name : "查看数据1"
      },{
        id : 5,
        name : "查看数据2"
      },{
        id : 6,
        name : "保存模型"
      }],
  		menuArr : {
  			alg:[0,1,3],
  			dat:[0,1,2],
  			pre:[0,1,2],
        exp:[0,1,3],
        fea:[0,1,3],
        ana:[0,1,3],
        mln:[0,1,3,6],
        pre9:[0,1,4,5],
        eva:[0,1,3],
        mod:[0]
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
      if(newV.type.slice(4,8) == "pre9"){
        this.mType = newV.type.slice(4,8);
      }else{
        this.mType = newV.type.slice(4,7);
      }
  		this.mId = newV.type;
		$('.rightMenu').css('left',newV.left);
		$('.rightMenu').css('top',newV.top);
	},
  },
  methods:{
  	menuFunc(e){
        console.log(e.target.id);
  		if(e.target.id == 0){
  			this.$store.commit('changeOp', "del"+this.mId);
  		}else if(e.target.id == 2){
        console.log(this.$store.state.menuOp);
        if(this.$store.state.menuOp == "data"+this.mId){
          this.$store.commit('changeShow', 1);
        }else{          
          this.$store.commit('changeOp', "data"+this.mId);
        }//保证可以多次查看
      }else if(e.target.id == 3){
        if(this.$store.state.menuOp == "res1"+this.mId){
          this.$store.commit('changeShow', 1);
        }else if(this.$store.state.menuOp == "res2"+this.mId){
          this.$store.commit('changeShow', 2);
        }else if(this.$store.state.menuOp == "res3"+this.mId){
          this.$store.commit('changeShow', 3);
        }else if(this.mId.slice(4,8) == "exp1" || this.mId.slice(4,7) == "pre" || this.mId.slice(4,7) == "fea" || this.mId.slice(4,7) == "mln" || this.mId.slice(4,7) == "eva"){        
          this.$store.commit('changeOp', "res1"+this.mId);
        }else if(this.mId.slice(4,8) == "exp3" || this.mId.slice(4,8) == "exp4"){          
          this.$store.commit('changeOp', "res2"+this.mId);
        }else if(this.mId.slice(4,8) == "exp2"){          
          this.$store.commit('changeOp', "res3"+this.mId);
        }//保证可以多次查看
      }else if(e.target.id == 1){
        this.$emit("runFrom");
      }else if(e.target.id == 4){
        if(this.$store.state.menuOp == "dat1"+this.mId){
          this.$store.commit('changeShow', 1);
        }else{          
          this.$store.commit('changeOp', "dat1"+this.mId);
        }//保证可以多次查看
      }else if(e.target.id == 5){
        if(this.$store.state.menuOp == "dat2"+this.mId){
          this.$store.commit('changeShow', 1);
        }else{          
          this.$store.commit('changeOp', "dat2"+this.mId);
        }//保证可以多次查看
      }else if(e.target.id == 6){
        if(this.$store.state.menuOp == "mode"+this.mId){
          this.$store.commit('changeShow', 9);
        }else{          
          this.$store.commit('changeOp', "mode"+this.mId);
        }//保证可以多次查看
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
	/*border: solid 1px black;*/
}
.menuItem {
	height: 30px;
	width: 100%;
	border-bottom: solid 1px   #FFFFF0;
	line-height: 30px;
  font-size: 12px;
	background-color: #F9F9F4;
  padding-left: 5px;
}
.menuItem:last-child {
	border-bottom: none;
}
.menuItem:hover{
	background-color: #EEEEE4;
}
</style>