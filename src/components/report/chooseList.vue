<template>
	<div class="choose">
		<h3>可用节点</h3>
		<el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
            <template v-for="(item,i) in nodeArr">
	        	<div class="dragItem"  :id="item.id" @click="toContent($event)">
	                <span>{{item.name}}</span>
                  <div class="addStyle"><i style="color:#409EFF" class="el-icon-plus"></i></div>                  
	           </div>
	        </template>          
          <div class="dragItem"  id="txt" @click="newTxtVisible=true">
              <span>新建空白文字框</span>
              <div class="addStyle"><i style="color:#409EFF" class="el-icon-plus"></i></div>
          </div>
	    </el-menu>
	    <h3>已有节点</h3>
	    <el-menu background-color="#F9F9F5" text-color="#000" active-text-color router>	    	
        <draggable v-model="contentArr" v-bind="{group:{name:'report', pull:'clone', put:false }}" @start="isDragging=true" @end="update($event)">
            <template v-for="(item,i) in contentArr">
	        	<div class="dragItem" draggable>
	                <span>{{item.name}}</span>
                  <div class="addStyle"  :id="item.id" @click="delNode(i, item.id)"><i style="color:#409EFF" class="el-icon-minus"></i></div>
	            </div>
	        </template>
        </draggable>
	    </el-menu>
      <el-dialog
          title="新建文本框"
          :visible.sync="newTxtVisible"
          width="50%">
          <el-form v-model="newTxt">
          <el-form-item label="文本框名称" label-width="150px">
            <el-input v-model="newTxt.name"></el-input>
          </el-form-item>
          <el-form-item label="文本框内容" label-width="150px">
            <el-input type="textarea" v-model="newTxt.content" :row="3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newTxtVisible = false">取 消</el-button>
          <el-button type="primary" @click="createTxt">提交</el-button>
        </span>
      </el-dialog>
	</div>
</template>

<script>
import { Message } from 'element-ui'
 import draggable from "vuedraggable";
export default {
  name: 'chooseList',
  data(){
  	return {
  		// nodeList : {},
      nodeArr : [],
      contentArr : [],
      newTxtVisible : false,
      newTxt : {name : "", content:""},
      isDragging: false,
      delayedDragging: false,
  	}
  },
  components : {
    draggable
  },
  methods :{
    setChooseData(data){
      this.nodeArr = [];
      this.contentArr = [];
      this.nodeArr = this.deepCopy(data.na);
      this.contentArr = this.deepCopy(data.ca);
    },
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
    update(e){
      this.isDragging = true;
      let obj = {id : this.contentArr[e.newIndex].id.slice(3), before : "", list : this.contentArr};
      if(e.newIndex < this.contentArr.length-1){
        obj.before = this.contentArr[e.newIndex+1].id.slice(3);
      }
      this.$emit("reflow", obj);
    },
    getNode(){
      let nodeList = this.$store.state.configData;
      this.nodeArr = [];
      for(let i in nodeList){
        this.nodeArr.push({name :nodeList[i].type, id: "i"+i});
      }
      console.log(this.nodeArr);
    },
    toContent(e){
      console.log("add");
      console.log(e.currentTarget.id);
      let id = e.currentTarget.id.slice(1);
      let config = this.$store.state.configData;      
      this.$emit("addContent", {id : id, content : ""});
      this.contentArr.push({name : config[id].type, id : "ini" + id, content : ""});
    },
    createTxt(){
      console.log("add")
      let flag = true;
      for(let i in this.contentArr){
        if(this.contentArr[i].name == this.newTxt.name){
          flag = false;
          Message.error("名称已存在");
          break;
        }
      }
      if(flag == true){
        let timestamp = new Date().getTime(); 
        this.$emit("addContent", {id : "droptxt" + timestamp, content : {title : this.newTxt.name, txt : this.newTxt.content, fontSize : "15px", textAlign : "left", backgroundColor : "", color : ""}});
        this.contentArr.push({name : this.newTxt.name, id: "inidroptxt" + timestamp, content : this.newTxt.content});
        this.newTxtVisible = false;
      }
      
    },
    delNode(i,id){
      console.log(id);
      this.$emit("delContent", {id : id.slice(3), index : i});
      if(this.contentArr.length == 1){
        this.contentArr = [];
      }else{
        if(i == 0){
          this.contentArr = this.contentArr.slice(1);
        }else if(i == this.contentArr.length-1){
          this.contentArr = this.contentArr.slice(0, this.contentArr.length-1);
        }else{
          this.contentArr = this.contentArr.slice(0, i).concat(this.contentArr.slice(i+1, this.contentArr.length));
        }
      }
    }
  },
  computed :{
  },
  watch:{
    isDragging(newValue) {
      if (newValue) {
        console.log(this.contentArr);
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    // contentArr(newValue, oldVal) {
    //   console.log(newValue);
    //     this.$emit("reflow", newValue);
    // }
  }

};
</script>

<style scoped>
.choose {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
}
.dragItem {
	width: 80%;
	height: 30px;
	font-size: 14px;
	padding: 6px;
	margin-left: 15px;
  display: flex;  
  line-height: 30px;
  vertical-align: middle;
  justify-content: space-between;
}
.addStyle {
  font-size: 20px;
  height: 30px;
  vertical-align: middle;
  border-radius: 3px;
}
.addStyle:hover {
  background-color: #F1F8FE;
  font-size: 22px;
}
.addStyle:active {
  background-color: #CFE7FA;
  font-size: 20px;
}
</style>