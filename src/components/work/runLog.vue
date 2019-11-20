<template>
	<div class="runLog" >
		<div class="title">
      <h3>日志</h3>
      <el-button type="primary" plain icon="el-icon-delete" @click="clearLogBoard"></el-button>
    </div>
    <div class="logContent" id="log"></div>
	</div>
</template>

<script>
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult } from '@/api/addProject'
export default {
  name: 'runLog',
  data(){
  	return {
      times :0,
      log : {},
      successList : [],
      start : null,
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
      let space = document.getElementById("log");
      space.innerHTML = null;
      this.times = 0;
      this.successList = [];
    },
    clearLogBoard(){
      let space = document.getElementById("log");
      space.innerHTML = null;
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
            }, 1000);
          }else if(res.modelExecuteStatus == "success"){
            this.start = null;
          }
          this.setLog();
	     })
        .catch(e=>{
      	    console.log(e);
        })
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
      }
      for(let i in this.log.operatorStatus){ 
        console.log(this.successList.indexOf(i));
        this.$emit("changeD", {id : i, state : this.log.operatorStatus[i].status});
        if(this.successList.indexOf(i) == -1){       
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
          }
        }else{}
      }
      space.append(content);

    },
  }
};
</script>

<style>
.runLog {
	width: 100%;
	min-height: 250px; 
  background-color: #F9F9F5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
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