<template>
	<div class="report" id="reportPdf">
    <div class="header">
      <div class="title"><h1>可视化报告</h1></div>
      <div class="save">        
        <el-button type="primary" plain icon="el-icon-s-operation" @click="goSave">保存报告</el-button>
        <el-button type="primary" plain icon="el-icon-s-operation" @click="reportVisible=true">下载报告</el-button>
      </div>
    </div>
		<div class="content" id="contentList">
		</div>
		<el-dialog
        title="保存报告"
        :visible.sync="titleVisible"
        width="30%">
        <el-input v-model="reportTitle" placeholder="请输入报告名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="titleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReportContent">提交</el-button>
      </span>
    </el-dialog>
     <el-dialog
        title="新建报告"
        :visible.sync="reportVisible"
        width="30%">
        <el-input v-model="reportTitle" placeholder="请输入报告名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportVisible = false">取 消</el-button>
        <el-button type="primary" @click="getPdf()">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="配置文本框"
        :visible.sync="txtVisible"
        width="50%">
        <el-form v-model="txtConfig">
          <el-form-item label="文本内容" label-width="150px">
            <el-input type="textarea" v-model="txtConfig.content" :row="3"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色" label-width="150px">
            <el-color-picker v-model="txtConfig.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体大小" label-width="150px">
            <el-input v-model="txtConfig.fontSize"></el-input>
          </el-form-item>
          <el-form-item label="背景颜色" label-width="150px">
            <el-color-picker v-model="txtConfig.backgroundColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="对齐方式" label-width="150px">
            <el-select placeholder="请选择"  v-model="txtConfig.textAlign">
              <el-option v-for="item in algnChoice" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="txtVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTxt()">提交</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import TableReport from '../report/preProcess'
import FreReport from '../report/freReport'
import { getReport, deleteReport, updateReport, saveReport, getReportById } from '@/api/reportOp'
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult, executeAll, executeFromOne, getDataResult } from '@/api/addProject'
import { getOptionsAll } from '@/api/getOptionsAll'
import { Message } from 'element-ui'
import Vue from 'vue'
import echarts from 'echarts'
// import {echartOption} from '././api/getOptionAll'
export default {
  name: 'report',
  components : {
  	TableReport,
  	FreReport
  },
  data(){
    return {
      reportTitle : "",
      titleVisible : false,
      reportVisible : false,
      txtVisible : false,
      txtConfig : {
        fontSize : "",
        color : "",
        textAlign : "",
        backgroundColor : "",
        content : "",
        txtId : ""
      },
      listNode : [],
      algnChoice : ["center", "left", "right"],
      reportContent  : {},
      projectContent :{},
      projectId : -1
    }
  },
  mounted(){
  },
  methods: {
    setReport(){
      this.reportContent = {};
      console.log(this.reportId);
      getReportById({params : {reportId : this.reportId}}).then(res=>res.data)
      .then(res=>{
        console.log(res);
        this.reportTitle = res.title;
        let c = JSON.parse(res.content);
        console.log(c);
        this.projectId = c.projectId;
        queryProject({userId : this.$store.state.userId, projectId : c.projectId}).then(res1=>res1.data)
        .then(res1=>{
          console.log(res1);
          this.setReportData(c,res1);          
       })
        .catch(e=>{
            console.log(e);
        })
        
      })
    },
    setReportData(res, res1){
      let space = document.getElementById("contentList");
      space.innerHTML = null;
      this.projectContent = this.deepCopy(res1.config);
      let nodeArr = [];
      let contentArr = [];
      for(let i in res1.config){
        nodeArr.push({name :res1.config[i].type, id: "i"+i});
      }
      for(let i in res.list){        
        if(res.list[i].slice(4,7) != "txt"){
          contentArr.push({name : res1.config[res.list[i]].type, id : "ini" + res.list[i], content : ""});
          this.createReport({id : res.list[i], content : ""})
        }else{
          contentArr.push({name : res.detail[res.list[i]].content.title, id : "ini" + res.list[i], content : res.detail[res.list[i]].content.txt});
          this.createReport({id : res.list[i], content : res.detail[res.list[i]].content});
        }
      }
      this.$emit("setChooseData", {na : nodeArr, ca : contentArr});
    },
    goSave(){
      if(this.reportId != -1){
        let para = {reportId : this.reportId, title : this.reportTitle, content:{}};
        let content = {};
        content["list"] = this.deepCopy(this.listNode);
        content["detail"] = this.deepCopy(this.reportContent);
        content["projectId"] = this.projectId;
        para["content"] = JSON.stringify(content);
        console.log(para);
        updateReport(para).then(res=>res.data)
        .then(res=>{
            console.log(res);
            Message.success("报告保存成功")

          })
          .catch(e=>{
            console.log(e);
          })
        }else{
          this.titleVisible = true;
        }
    },
    saveReportContent(){
      let para = {userId : this.$store.state.userId, title : this.reportTitle, content:{}};
      let content = {};
      content["list"] = this.deepCopy(this.listNode);
      content["detail"] = this.deepCopy(this.reportContent);
      content["projectId"] = this.$store.state.projectId;
      para["content"] = JSON.stringify(content);
      console.log(para);
      saveReport(para).then(res=>res.data)
      .then(res=>{
          console.log(res);
          this.titleVisible = false;
          Message.success("报告保存成功")
        })
      .catch(e=>{
        console.log(e);
      })      
    },
    setTxt(){
      let t = document.getElementById(this.txtConfig.txtId);
      console.log(t)
      console.log(t.style)
      t.style.fontSize = this.txtConfig.fontSize;
      t.style.backgroundColor = this.txtConfig.backgroundColor;
      t.style.color = this.txtConfig.color;
       t.style.textAlign = this.txtConfig.textAlign;
       t.innerHTML = this.txtConfig.content;
      this.txtVisible = false;
      let title = this.reportContent[this.txtConfig.txtId.slice(6)].content.title;
      this.reportContent[this.txtConfig.txtId.slice(6)] = {};
      this.reportContent[this.txtConfig.txtId.slice(6)] = {content :{title : title,txt : this.txtConfig.content, fontSize :t.style.fontSize, color : t.style.color, backgroundColor : t.style.backgroundColor, textAlign : t.style.textAlign }};
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
    delContent(node){
      let space = document.getElementById("contentList");
      let d = document.getElementById("report" + node.id);
      space.removeChild(d);
      delete this.reportContent[node.id];
      if(this.listNode.length == 1){
        this.listNode = [];
      }else{
        let i = node.index;
        if(i == 0){
          this.listNode = this.listNode.slice(1);
        }else if(i == this.listNode.length-1){
          this.listNode = this.listNode.slice(0, this.listNode.length-1);
        }else{
          this.listNode = this.listNode.slice(0, i).concat(this.listNode.slice(i+1, this.listNode.length));
        }
      }
    },
    reflow(node){
      let space = document.getElementById("contentList");
      let d = document.getElementById("report" + node.id);
      space.removeChild(d);
      if(node.before == ""){
        space.append(d);
      }else{
        let b = document.getElementById("report" + node.before);
        space.insertBefore(d, b);
      }
      this.listNode = [];
      for(let i in node.list){
        this.listNode.push(node.list[i].id.slice(3));
      }
    },
    setChart(res, c){      
      console.log(res);
      console.log(c)
      let chart = echarts.init(document.getElementById(c));
      console.log(chart);
      chart.clear();
      let option = {};
      if(c.slice(9,13) == "exp2"){        
        // option = this.getOption(res);
        option = getOptionsAll(res, 1);
      }else if(c.slice(9,13) == "exp3"){
        // option = this.getCoeOption(res);
        option = getOptionsAll(res, 2);
      }

      chart.setOption(option);
    },
  	createReport(node){
      console.log(node);
      let id = node.id;
      this.listNode.push(node.id);
  		let space = document.getElementById("contentList");
			if(id.slice(4,7) == "dat" || id.slice(4,8) == "exp1" || id.slice(4,7) == "pre" || id.slice(4,7) == "mln"){
				console.log("data");
				this.setTableData(id, TableReport);
			}else if(id.slice(4,8) == "exp2"){
				console.log("fre")
        this.setTableData(id, FreReport);
			}else if(id.slice(4,8) == "exp3" || id.slice(4,8) == "exp4"){
				console.log("relation")
        this.setTableData(id, "relation");
			}else if(id.slice(4,7) == "txt"){
        let d = document.createElement("div");
        d.setAttribute("class", "reportItem")
        d.setAttribute("id", "report" + id);
        d.style.margin = "10px 5px 10px 5px";
        d.style.color = node.content.color;
        d.style.backgroundColor = node.content.backgroundColor;
        d.style.textAlign = node.content.textAlign;
        d.style.fontSize = node.content.fontSize;
        d.innerHTML = node.content.txt;

        space.append(d);
        this.reportContent[id] = {content : {title : node.content.title,txt : node.content.txt, fontSize :node.content.fontSize, color : node.content.color, backgroundColor : node.content.backgroundColor, textAlign : node.content.textAlign }};
        let that = this;
        d.addEventListener("click",function(event){
          let t = document.getElementById(event.target.id);
          console.log(t.id)
          that.txtConfig.txtId = t.id;
          that.txtConfig.fontSize = t.style.fontSize;
          that.txtConfig.backgroundColor = t.style.backgroundColor;
          that.txtConfig.color = t.style.color;
          that.txtConfig.content = t.innerHTML;
          that.txtVisible = true;
        })
      }
  	},
    subComponents(id, subName, tc){
      // 创建可复用的 Profile 组件构造函数
      let tableD = tc.tableD;
      let configD = tc.configD;
      console.log(tableD);
        let space = document.getElementById("contentList");
        let dOutside = document.createElement("div");
        dOutside.id = "report" + id;
        dOutside.setAttribute("class", "reportItem");
      let t = document.createElement("h3");
          t.innerHTML = "配置内容 ："  
          dOutside.append(t)  
        let d = document.createElement("div");
        d.style.margin = "10px 5px 10px 5px";                        
        dOutside.append(d); 
        console.log(dOutside);
      let list = this.$store.state.runResult;
      let config = this.$store.state.configData;  
      let ProfileTable = Vue.extend(TableReport);
      let Profile = null;
      if(id.slice(4,8) != "exp3"){
        Profile = Vue.extend(subName);
      }      
      // 创建一个 Profile 组件的实例
      // let configD = this.setConfigData(id);
      let profile1 = new ProfileTable({
          data: {
            tableData : configD.configData,
            columnD : configD.columnC,
          }  
        })
        profile1.$mount(d);
      if(subName == TableReport){ 
        if(id.slice(4,8) == "pre9"){
          let t1 = document.createElement("h3");
          t1.innerHTML = "数据结果1 ："  
          dOutside.append(t1)    
          let d1 = document.createElement("div");
          d1.style.margin = "10px 5px 10px 5px";                        
          dOutside.append(d1);  
          console.log(dOutside);
          let profile = new Profile({
            data: {
              tableData : tableD[0].tableData,
              columnD : tableD[0].columnD,
            }  
          })
          profile.$mount(d1);
          let t2 = document.createElement("h3");
          t2.innerHTML = "数据结果2 ："  
          dOutside.append(t2)    
          let d2 = document.createElement("div");
          d2.style.margin = "10px 5px 10px 5px";                        
          dOutside.append(d2); 
          let profile0 = new Profile({
            data: {
              tableData : tableD[1].tableData,
              columnD : tableD[1].columnD,
            }  
          })
          profile0.$mount(d2);
        }else{
          let t1 = document.createElement("h3");
          t1.innerHTML = "数据结果 ："  
          dOutside.append(t1)    
          let d1 = document.createElement("div");
          d1.style.margin = "10px 5px 10px 5px";                        
          dOutside.append(d1);  
          let profile = new Profile({
            data: {
              configData : configD.configData,
              columnC : configD.columnC,
            }  
          })
          profile.$mount(d1);
        }
      }else if(subName == "relation"){
        // let t1 = document.createElement("h3");
        //   t1.innerHTML = "相关系数视图"  
        //   dOutside.append(t1)    
        let chart = document.createElement("div");
        chart.setAttribute("id", "chart"+id);
        chart.style.height="200px";
        chart.style.width = "100%";              
        dOutside.append(chart);  
      }else if(subName == FreReport){
        console.log(tableD)
        let chart = document.createElement("div");
        chart.setAttribute("id", "chart"+id);
        chart.style.height="200px";
        chart.style.width = "100%";              
        dOutside.append(chart);
        chart.addEventListener("click", function(e){
          console.log(e.currentTarget)
        });           
        let d1 = document.createElement("div");
        d1.style.margin = "10px 5px 10px 5px";                        
        dOutside.append(d1);         
        let profile = new Profile({
          data: {
            tableData : tableD[0].tableData,
            freName : tableD[0].freName,
          },
        })
        profile.$mount(d1);
 
        console.log(dOutside);
      }
      space.append(dOutside);    
      if(id.slice(4,8) == "exp2" || id.slice(4,8) == "exp3"){        
        this.setChart(tableD[0].tableData, "chart"+id);
      }

      // 挂载到元素上
    },
    setConfigData(id){
      let config = null;
      if(this.reportId == -1){
        config = this.$store.state.configData;
      }else{
        config = this.projectContent;
      }      
      let configD = {};   
      configD["configData"] = [];
      configD["columnC"] = [];
      configD["title"] = config[id].type;
      if(JSON.stringify(config[id].config) != "{}"){
        let para = config[id].config.parameter;
        if(para["parameter"]){
          for (let key in para["parameter"][0]) {
            let k = this.transferKey(key);
            configD["configData"].push({ prop: k });
          }
          for(let i in para["parameter"]){
            let obj = {};
            for(let item in para["parameter"][i]){
              let k = this.transferKey(item);
              obj[k] = para["parameter"][i][item];
            }
            configD["configData"].push(obj);
          }
        }else{

          let obj = {};
          for(let item in para){
            if(item != "userId" && item != "projectId"){
              let k = this.transferKey(item);
              configD["columnC"].push({ prop: k });
              console.log(item);
              if(item == "columnNames" || item == "newColumnNames" || item == "features"){
                obj[k] = para[item].join(",");
              }else{
                obj[k] = para[item];
              }
            }
          }
          configD["configData"].push(obj);
        }
      }
      return configD;
    },
    transferKey(key){
      let k = "";
      switch(key){
        case "colName":
          k = "字段名";
          break;
        case "colName_1":
          k = "字段名1";
          break;
        case "colName_2":
          k = "字段名2";
          break;
        case "columnName":
          k = "字段名";
          break;
        case "columnNames":
          k = "字段名";
          break;
        case "operate":
          k = "操作规则";
          break;
        case "operate_1":
          k = "操作规则1";
          break;
        case "operate_2":
          k = "操作规则2";
          break;
        case "value":
          k = "取值";
          break;
        case "value_1":
          k = "取值1";
          break;
        case "value_2":
          k = "取值2";
          break;
        case "relation":
          k = "关系";
          break;
        case "newName":
          k = "新字段名";
          break;
        case "newColumnName":
          k = "新字段名";
          break;
        case "newColumnNames":
          k = "新字段名";
          break;
        case "sortType":
          k = "排序规则";
          break;
        case "numBuckets":
          k = "分箱值";
          break;
        case "maxCategories":
          k = "最大类目";
          break;
        case "k":
          k = "维度";
          break;
        case "features":
          k = "字段名";
          break;
        case "step":
          k = "步长";
          break;
        case "regType":
          k = "正则类型";
          break;
        case "regParam":
          k = "正则化系数";
          break;
        case "convergenceTol":
          k = "收敛系数";
          break;
        case "iterations":
          k = "迭代次数";
          break;
        case "label":
          k = "标签列";
          break;
        case "proportion1":
          k = "比例1";
          break;
        case "proportion2":
          k = "比例2";
          break;
        case "seed":
          k = "随机数种子";
          break;
      }
      return k;
      
    },
    setTableData(id, subName){
      let tableAll = [];
      let TC = {}
      TC["configD"] = this.setConfigData(id);      
      
      if(id.slice(4,8) == "mln1"){
        // this.subComponents(id, subName, tableD);
      }else{
        getDataResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId : id, start : 0, end : 5})
        .then(res=>res.data).then(res=>{
          console.log(res)
          console.log(id);
          if(id.slice(4,8) == "exp2"){        
          console.log("exp2")    
            let tableD = {};
            tableD["tableData"] = [];
            tableD["columnD"] = [];
            tableD["freName"] = "";
            for(let i=0; i <res[0].data.length; i++){
              if(i == 0){
                console.log("0");
                for(let key in res[0].data[i]){
                  if(key != "elm" && key != "频率" && key != "isRootInsert"){
                    tableD.freName = key;
                  }
                }
              }
              let obj = {columnName : res[0].data[i][tableD.freName], rate : res[0].data[i]["频率"]};
              tableD.tableData.push(obj);
            }
            tableAll.push(tableD);
          }else if(id.slice(4,8) == "exp3"){
             let tableD = {};
              tableD["tableData"] = res[0].data;
              tableAll.push(tableD);
          }else{
            for(let index = 0; index < res.length; index ++){
               let tableD = {};
              tableD["columnD"] = [];
              tableD["tableData"] = res[index].data;
              for(let item in res[index].data[0]){
                tableD["columnD"].push({prop : item});
              }
              tableAll.push(tableD);
            }
          }
          TC["tableD"] = tableAll;     
          this.subComponents(id, subName, TC);
                 
        })
        .catch(e=>{
          Message.error("请求结果错误")
        })
      }
    },
  },
  computed : {
    reportId(){
      return this.$store.state.reportId;
    }
  },
  watch : {
    reportId(newV){
      if(newV != -1 && newV != -2){
        console.log(newV);
        this.setReport();
      }
    }
  }
};
</script>

<style scoped>
.report {
	height: 100%;
	width: 100%;
  overflow-x: auto;
	position: relative;
	background-color: white;
  padding: 5px;
}
.title {
  width: 60%;
  position: absolute;
  float: left;
  background-color: #F9F9F5;
  line-height: 50px;
  display: flex;
  justify-content: center;
}
.save {
  width: 35%;
  float: right;
  background-color: #F9F9F5;
}
.reportItem {
	width: 100%;
  margin: 10px 5px 10px 5px; 
}
.content {
	min-height: 650;
	width: 100%;
	margin-bottom: 10px;
}
.header {
	height: 50px;
	width: 100%;
	top: 0;
	padding-bottom: 10px;
  background-color: #F9F9F5;
}
</style>