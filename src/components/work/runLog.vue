<template>
	<div class="runLog">
		<div class="title">
      <h3>日志</h3>
      <el-button type="primary" icon="el-icon-delete" @click="clearLogBoard"></el-button>
      <!-- <el-button type="primary" plain icon="el-icon-delete" @click="clearLogBoard"></el-button> -->
    </div>      
      <div id = "forRoll"><div class="logContent" id="log"></div></div>
	</div>
</template>

<script>
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult } from '@/api/addProject'
export default {
  name: 'runLog',
  data(){
  	return {
      times :1000,
      log : {},
      successList : [],
      start : null,
      lastHeight : 0,
  	}
  },
  mounted(){
    Date.prototype.format = function(fmt){
      var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
      };

      if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
            
      for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(
            RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
        }       
      }

      return fmt;
    }
  },
  methods : {
    clearLog(){
      this.times = 1000;
      let space = document.getElementById("log");
      space.innerHTML = null;
      this.times = 0;
      this.successList = [];
    },
    clearLogBoard(){
      let space = document.getElementById("log");
      space.innerHTML = null;
    },
    fromOne(id){
      let list = this.$store.state.runList;
      this.clearSuccess(id);
      if(list[id].next.length != 0){
        for(let i in list[id].next){
          this.fromOne(list[id].next[i]);
        }
      }     

    },
    clearSuccess(id){
      let index = this.successList.indexOf(id);

      if(this.successList.length == 1){
        this.successList = [];
      }else{   
        if(index == 0){
          this.successList = this.successList.slice(1);
        }else if(index == this.successList.length -1){
          this.successList = this.successList.slice(0, this.successList.length-1);
        }else{
          this.successList = (this.successList.slice(0, index)).concat(this.successList.slice(index+1, this.successList.length));
        }
      }
    },
  	queryResult(id){
  		queryResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, modelExecuteId: id, }).then(res=>res.data)
        .then(res=>{
	      	console.log(res);
          this.log = res;
          this.times += 1;
          if(res.modelExecuteStatus == "running" || res.modelExecuteStatus == "initial"){
            this.start = setTimeout(()=>{          
                    this.queryResult(id); 
                    if(this.times < 5000){
                      this.times += 1000;
                    }else{
                      this.times = 1000;
                    }
            }, this.times);
          }else if(res.modelExecuteStatus == "success"){
            this.start = null;
          }
          this.setLog();
	     })
        .catch(e=>{
      	    console.log(e);
        })
  	},
    autoRoll(){
      let roll = document.getElementById("forRoll");
      let space = document.getElementById("log");
      console.log(space);
      console.log(roll.scrollTop);
      console.log(space.scrollHeight);
      if (roll.scrollTop >= space.scrollHeight) {
       roll.scrollTop = 0;
      } else {
       roll.scrollTop += (space.scrollHeight - roll.scrollTop);
      }
        
        
    },
    setLog(){
      let config = this.$store.state.configData;
      console.log(config);
      let time = new Date().format("yyyy-MM-dd hh:mm:ss");
      let space = document.getElementById("log");
      let content = document.createElement("div");
      content.setAttribute("class", "logItem");
      if(this.log.modelExecuteStatus == "initial"){
        let p = document.createElement("p");
        p.innerHTML = time + "   项目已初始化成功。"
        content.append(p);
      }else if(this.log.modelExecuteStatus == "running"){
        let p = document.createElement("p");
        p.innerHTML = time + "   项目正在运行。"
        content.append(p);
      }else if(this.log.modelExecuteStatus == "success"){
        let p = document.createElement("p");
        p.innerHTML = time + "   项目运行成功。"
        content.append(p);
      }else if(this.log.modelExecuteStatus == "error"){
        let p = document.createElement("p");
        p.innerHTML = time + "   项目运行失败。";
        p.style.color = "red";
        content.append(p);
      }
      for(let i in this.log.operatorStatus){ 
        console.log(this.successList.indexOf(i));
        // this.$emit("changeD", {id : i, state : this.log.operatorStatus[i].status});
        if(this.successList.indexOf(i) == -1){  
          this.$emit("changeD", {id : i, state : this.log.operatorStatus[i].status});     
          let s = this.log.operatorStatus[i];
          // this.$emit("changeD", {id : i, state : s.status});
          // this.$store.commit("changeShowStyle", {id : i, state : s.status});
          if(s.status == "running"){
            let p = document.createElement("p");
            p.innerHTML = time + "   节点"  + config[i].type + "   正在运行。"
            content.append(p);
          }else if(s.status == "success"){
            let p = document.createElement("p");
            p.innerHTML = time + "   节点"  + config[i].type + "   运行成功。"
            content.append(p);
            this.successList.push(i);
          }else if(s.status == "error"){
            let p = document.createElement("p");
            p.style.color = "red";
            p.innerHTML = time + "   节点"  + config[i].type + "   运行失败。\n 失败原因 ： " + s.log;
            content.append(p);
          }
        }
      }
      space.append(content);
      this.autoRoll();

    },
  }
};
</script>

<style>
.runLog {
	width: 100%;
	height: 350px;
  overflow-x: hidden; 
  background-color: #F9F9F5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
#forRoll {
  height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}
.logContent{
  width: 100%;
  margin-top: 10px;
}
.title {
  width: 100%;
  background-color: #F0F0EB;
  display: flex;
  justify-content: space-between;
  height: 30px;
  padding: 3px;
}
.logItem {
  width: 100%;
  min-height: 20px;
  padding: 3px;
}
</style>