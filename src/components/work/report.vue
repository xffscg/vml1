<template>
	<div class="report" id="reportPdf">
    <div class="header">
      <div class="title"><h1>可视化报告</h1></div>
      <div class="save">        
        <el-button type="primary" plain icon="el-icon-s-operation">保存报告</el-button>
        <el-button type="primary" plain icon="el-icon-s-operation" @click="reportVisible=true">下载报告</el-button>
      </div>
    </div>
		<div class="content" id="contentList">
		</div>
		
     <el-dialog
        title="新建项目"
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
import ChartReport from '../report/relation'
import TableReport from '../report/preProcess'
import FreReport from '../report/freReport'
import { getProject, getDataSource, addProject, goRun, queryProject, queryResult, executeAll, executeFromOne, getDataResult } from '@/api/addProject'
import Vue from 'vue'
import echarts from 'echarts'
export default {
  name: 'report',
  components : {
  	ChartReport,
  	TableReport,
  	FreReport
  },
  data(){
    return {
      reportTitle : "",
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
    }
  },
  mounted(){
  },
  methods: {
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
    },
    getOption(res){
      console.log(res);
      let xName = [];
      let yName = [];
      for (let i = 0; i < res.length; i++) {
        xName.push(res[i].columnName)
        yName.push(res[i].rate);
      }
      let option = {
        title: {
          text: '频率统计视图'
        },
        tooltip: {},
        legend: {
          data: ['频率']
        },
        xAxis: {
          data: xName
        },
        yAxis: {},
        series: [{
          name: '频率',
          type: 'bar',
          data: yName
        }]
      }
      console.log(option);
      return option;
    },
    setChart(res, c){      
      console.log(res);
      console.log(c)
      let chart = echarts.init(document.getElementById(c));
      console.log(chart);
      chart.clear();
      let option = {};
      option = this.getOption(res);

      chart.setOption(option);
    },
  	createReport(node){
      console.log(node);
  		let list = this.$store.state.runResult;
      let config = this.$store.state.configData;
      let id = node.id;
  		let space = document.getElementById("contentList");
			if(id.slice(4,7) == "dat" || id.slice(4,8) == "exp1" || id.slice(4,7) == "pre" || id.slice(4,7) == "mln"){
				console.log("data");
				this.setTableData(id, TableReport);
			}else if(id.slice(4,8) == "exp2"){
				console.log("fre")
        this.setTableData(id, FreReport);
			}else if(id.slice(4,8) == "exp3" || id.slice(4,8) == "exp4"){
				console.log("relation")
        this.subComponents(id, ChartReport);
			}else if(id.slice(4,7) == "txt"){
        let d = document.createElement("div");
        d.setAttribute("class", "reportItem")
        d.setAttribute("id", "report" + id);
        d.style.margin = "10px 5px 10px 5px";
        d.style.fontSize = "15px";
        d.innerHTML = node.content;
        space.append(d);
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
    subComponents(id, subName, tableD){
      // 创建可复用的 Profile 组件构造函数
      console.log("iii")
        let space = document.getElementById("contentList");
        let dOutside = document.createElement("div");
        dOutside.id = "report" + id;
        dOutside.setAttribute("class", "reportItem");
        let d = document.createElement("div");
        d.style.margin = "10px 5px 10px 5px";                        
        dOutside.append(d); 
      let list = this.$store.state.runResult;
      let config = this.$store.state.configData;
      let Profile = Vue.extend(subName);
      // 创建一个 Profile 组件的实例
      // if(subName == "freReport")
      let configD = this.setConfigData(id);
      if(subName == TableReport){        
        let profile = new Profile({
          data: {
            title : configD.title,
            tableData : tableD.tableData,
            columnD : tableD.columnD,
            configData : configD.configData,
            columnC : configD.columnC,
          }  
        })
        profile.$mount(d);
      }else if(subName == FreReport){

        console.log("fre")
        let chart = document.createElement("div");
        chart.setAttribute("id", "chart"+id);
        chart.style.height="200px";
        chart.style.width = "100%";              
        dOutside.prepend(chart);

        console.log(dOutside);               
        let profile = new Profile({
          data: {
            title : configD.title,
            tableData : tableD.tableData,
            freName : tableD.freName,
            configData : configD.configData,
            columnC : configD.columnC,
          },
        })
        profile.$mount(d);
      }
      space.append(dOutside);     
      this.setChart(tableD.tableData, "chart"+id);    

      // 挂载到元素上
    },
    setConfigData(id){
      let config = this.$store.state.configData;
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
          configD["columnC"][0].fixed = 'left';
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
          console.log(configD["columnC"]);
          console.log(configD["configData"]);
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
      }
      return k;
      
    },
    setTableData(id, subName){
      let tableD = {};
      tableD["tableData"] = [];
      tableD["columnD"] = [];
      tableD["freName"] = "";
      if(id.slice(4,8) == "mln1"){
        this.subComponents(id, subName, tableD);
      }else{
        getDataResult({userId : this.$store.state.userId, projectId : this.$store.state.projectId, operatorId : id, start : 0, end : 5})
        .then(res=>res.data).then(res=>{
          if(id.slice(4,8) == "exp2"){
            for(let i in res.data){
              if(i == 0){
                for(let key in res.data[i]){
                  if(key != "elm" && key != "频率" && key != "isRootInsert"){
                    tableD.freName = key;
                  }
                }
              }
              let obj = {columnName : res.data[i][tableD.freName], rate : res.data[i]["频率"]};
              tableD.tableData.push(obj);
            }
          }else{
            tableD["tableData"] = res.data;
            for(let item in res.data[0]){
              tableD["columnD"].push({prop : item});
            }
          }          
          this.subComponents(id, subName, tableD);
                 
        })
        .catch(e=>{
          Message.error("请求结果错误")
        })
      }
    },
    setChartData(id){}
  },
};
</script>

<style scoped>
.report {
	height: 100%;
	width: 100%;
  overflow-x: auto;
	position: relative;
	background-color: white;
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