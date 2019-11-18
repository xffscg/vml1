<template>
	<div class="choose">
		<h3>可用节点</h3>
		<el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="item in nodeList">
	        	<div class="dragItem" :id="item" draggable="true" @dragstart="drag($event)">
	                <span>{{item.type}}</span>
	            </div>
	            <div class="dragItem" :id="txt" draggable="true" @dragstart="drag($event)">
	                <span>新建空白文字框</span>
	            </div>
	        </template>
	    </el-menu>
	    <h3>已有节点</h3>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="(item,i) in containList">
	        	<div class="dragItem" :id="'in'+item">
	                <span>item</span>
	            </div>
	        </template>
	    </el-menu>
	</div>
</template>

<script>
export default {
  name: 'chooseList',
  data(){
  	return {
  		// nodeList : {},
  	}
  },
  methods :{
  	deepCopy(oldVal){
        let target = oldVal.constructor === Array?[]:{};
        for(let key in oldVal){
          if(oldVal.hasOwnProperty(key)){
            if(oldVal[key] && typeof oldVal[key] === "object"){
              target[key] = oldVal[key].constructor === Array?[]:{};
              target[key] = this.deepCopy(oldVal[key]);
            }else{
              target[key] = oldVal[key];
            }
          }
        }
        return target;
    },

  },
  computed :{
  	nodeList(){
  		return this.$store.state.configData;
  	},
  	containList(){
  		return this.$store.state.reportContent;
  	},
  },

};
</script>

<style>
.choose {
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
}
.dragItem:hover {
	background-color: #F2F2F0;
	font-size: 16px;
}
</style>