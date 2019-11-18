<template>
	<div class="report">
		<h3>报告</h3>
		<div class="content" id="contentList">
		</div>
		<div class="footer">
			<el-button type="primary" plain icon="el-icon-s-operation" @click="saveReport">保存报告</el-button>
		</div>
	</div>
</template>

<script>
import ChartReport from '../report/relation'
import TableReport from '../report/preProcess'
import FreReport from '../report/freReport'
import Vue from 'vue'
export default {
  name: 'report',
  components : {
  	ChartReport,
  	TableReport,
  	FreReport
  },
  methods: {
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
  	saveReport(){
  		this.$store.commit("changeShow", 0);
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
  	createReport(node){
      console.log(node);
  		let list = this.$store.state.runResult;
      let config = this.$store.state.configData;
      let id = node.id;
  		let space = document.getElementById("contentList");
			if(id.slice(4,7) == "dat" || id.slice(4,8) == "exp1" || id.slice(4,7) == "pre"){
				console.log("data");
				let data = document.createElement("TableReport");
				space.append(data);
        this.subComponents(id, TableReport);
			}else if(id.slice(4,8) == "exp2"){
				console.log("fre")
        this.subComponents(id, FeaReport);
			}else if(id.slice(4,8) == "exp3" || id.slice(4,8) == "exp4"){
				console.log("relation")
        this.subComponents(id, ChartReport);
			}else if(id.slice(0,3) == "txt"){
        console.log("createTxt");
        let d = document.createElement("div");
        d.id = id;
        d.setAttribute("class", "reportItem");
        d.style.margin = "10px 5px 10px 5px";
        d.innerHTML = node.content;
        space.append(d);
      }
  	},
    subComponents(id, subName){
      // 创建可复用的 Profile 组件构造函数
      let space = document.getElementById("contentList");
      let d = document.createElement("div");
      d.id = id;
      d.style.margin = "10px 5px 10px 5px";
      space.append(d);
      let list = this.$store.state.runResult;
      let config = this.$store.state.configData;
      let Profile = Vue.extend(subName);
      // 创建一个 Profile 组件的实例
      // if(subName == "freReport")
      let configD = this.setConfigData(id);
      let tableD = this.setTableData(id);
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
        profile.$mount('#' + id)
      }
      
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
            configD["columnC"].push({ prop: k });
          }
          for(let i in para["parameter"]){
            let obj = {};
            for(let item in para["parameter"][i]){
              let k = this.transferKey(key);
              obj[k] = para["parameter"][i][item];
            }
            configD["configData"].push(obj);
          }
          this.tableData.column[0].fixed = 'left';
        }else{
          for(let item in para){
            if(item != "userId" && item != "projectId"){
              let k = this.transferKey(key);
              configD["columnC"].push({ prop: k });
              let obj = {};
              if(item == "columnNames" || item == "newColumnNames"){
                obj[k] = para[item].join(",");
                configD["configData"].push(obj);
              }else{
                obj[k] = para[item];
                configD["configData"].push(obj);
              }
            }
          }
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
      }
      return k;
      
    },
    setTableData(id){
      let result = this.$store.state.runResult;
      let tableD = {};
      tableD["tableData"] = [];
      tableD["columnD"] = [];
      if(result[i]){
        for(let key in result[i][0]){
          tableD["columnD"].push({prop : key});
        }
        tableD["tableData"] = this.deepCopy(result[i]);
      }else{
        console.log("get from server");
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
	position: relative;
	background-color: white;
}
.reportItem {
	width: 100%;
  margin: 10px 5px 10px 5px; 
}
.content {
	height: 650;
	width: 100%;
	margin-bottom: 10px;
	overflow-y: auto;
}
.footer {
	height: 50px;
	width: 100%;
	bottom: 0;
	padding-bottom: 10px;
	position: absolute;
	display: flex;
	justify-content: center;
}
</style>