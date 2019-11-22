<template>
	<div class="configPart">
		<div v-show="configType == 1" style="padding-top:15px;">
			<h3>请选择字段</h3>
			<div class="choose">
			     <el-checkbox v-show="showAll" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="expValue" @change="handleCheckedOptionsChange" :min="min" :max="max">
              <el-checkbox v-for="value in expOption" :label="value" :key="value">{{value}}</el-checkbox>
          </el-checkbox-group>
    	</div>       
    <div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary" v-show="configType != 4">保存</el-button></div>
		</div>
		<ConfigPre v-show="configType == 2" :column="dataColumns" :columnNumberType="dataColumnsNumber" ref="ConfigPre"></ConfigPre>
    <ConfigFea v-show="configType == 3" :column="dataColumns" :columnNumberType="dataColumnsNumber" ref="ConfigFea"></ConfigFea>
    <ConfigData v-show="configType == 4" ref="ConfigData"></ConfigData>
	</div>

</template>

<script>
import { getColumnNames, getColumnNameWithNumberType, fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
// import {  } from '@/api/dataExploration'
import ConfigPre from '../configs/configPre'
import ConfigFea from '../configs/configFea'
import ConfigData from '../configs/configData'
export default {
  name: 'config',
  components :{
    ConfigPre,
    ConfigFea,
    ConfigData
  },
  data(){
  	return {
  		configType : 0,
      showAll : true,
  		checkAll: false,
      	isIndeterminate: true,
        expOption : [],
      	dataColumns : [],
        dataColumnsNumber : [],
      	expValue : [],
        min : 0,
        max : 0,
        dataInfo : {},
        configT : ""
  	}
  },
  methods :{
    setConfig(newV){
      this.configT = newV;
      this.expValue = [];
      this.checkAll = false;
      this.isIndeterminate = true;
      let type = newV.slice(4,7);
      let run = this.$store.state.runList;
      if(run[newV] && type!= "dat"){
        this.getColumns(newV);
      }
      this.$nextTick(()=>{
        if(type == "exp"){    
          let para = this.$store.state.configData[newV]; 
          if(JSON.stringify(para.config) != "{}"){
            for(let i in para.config.parameter.columnNames){
              if(this.dataColumns.indexOf(para.config.parameter.columnNames[i]) != -1){
                this.expValue.push(para.config.parameter.columnNames[i]);
              }
            }
          }    
          this.configType = 1;
        }else if(type == "pre"){
          this.$refs.ConfigPre.setConfig(newV);
          this.configType = 2;
        }else if(type == "fea"){
          this.$refs.ConfigFea.setConfig(newV);
          this.configType = 3;
        }else if(type == "dat"){
          // let data = this.$store.state.configData[newV];
          // let col = this.$store.state.configOrder[newV];
          // this.dataInfo["name"] = data.type;
          // this.dataInfo["url"] = data.config.fileUrl[0][newV];
          // this.dataInfo["id"] = data.config.fileId;
          // this.dataInfo["column"] = col.column.join(",");
          // this.dataInfo["columnNumber"] = col.columnNumber.join(",");
          // console.log(this.dataInfo);
          this.$refs.ConfigData.getDetail(newV);
          this.configType = 4;
        }
      })
      // if(type == "exp"){    
    //     let para = this.$store.state.configData[newV]; 
    //     if(para.config != null){
    //       this.expValue = this.deepCopy(para.config);
    //     }    
    //     this.configType = 1;
      // }else if(type == "pre"){
      //  this.configType = 2;
      // }else if(type == "fea"){
    //     this.configType = 3;
    //   }
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
  	handleCheckAllChange(val) {
  		console.log(val);
        this.expValue = val ? this.expOption : [];
        this.isIndeterminate = false;
   },
    handleCheckedOptionsChange(value) {
	    let checkedCount = value.length;
	    this.checkAll = checkedCount === this.expOption.length;
	    this.isIndeterminate = checkedCount > 0 && checkedCount < this.expOption.length;
    },
    save(){
    	let para = {parameter : {}, fileUrl : []};
      console.log(this.expValue);
      para.parameter["columnNames"] = this.expValue;
      para.parameter["userId"] = this.$store.state.userId;
      para.parameter["projectId"] = this.$store.state.projectId;
      let list = this.$store.state.runList;
      let pre = list[this.configT].pre;
      let fileUrl = [];
      // 可以后续加判断，如果父节点是分数据的就另外写
      for(let i in pre){
        let obj = {};
        obj[pre[i]] = 0;
        fileUrl.push(obj);
      }
      para["fileUrl"] = fileUrl;
    	this.$store.commit("changeConfig", {type : "addConfig", detail : {name : this.configT, config : para}});
      this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.dataColumns}});
      this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.dataColumnsNumber}});
    },
    getColumns(id){
      // let path = this.popPart(id); 
      let order = this.$store.state.configOrder;
      let list = this.$store.state.runList;
      let pre = list[id].pre;
      if(pre.length == 0){
        this.dataColumns = this.deepCopy(order[id].column);
        this.dataColumnsNumber = this.deepCopy(order[id].columnNumber);
      }else{
        this.dataColumns = []
        this.dataColumnsNumber = [];
        for(let i in pre){
          console.log(pre[i]);
          for(let j in order[pre[i]].column){
            if(this.dataColumns.indexOf(order[pre[i]].column[j]) == -1){
              this.dataColumns.push(order[pre[i]].column[j]);
            }
            
          }
          for(let j in order[pre[i]].columnNumber){
            if(this.dataColumnsNumber.indexOf(order[pre[i]].columnNumber[j]) == -1){
              this.dataColumnsNumber.push(order[pre[i]].columnNumber[j]);
            }
          }
        }
      }
      if((id.slice(7,8) == 1 || id.slice(7,8) == 2) && id.slice(4,7) == "exp"){
        if(id.slice(7,8) == 2){
          this.max = 1;
          this.showAll = false;
        }else{
          this.showAll = true;
          this.max = this.dataColumns.length;
        }
        this.expOption = this.dataColumns;
      }else if((id.slice(7,8) == 3 || id.slice(7,8) == 4) && id.slice(4,7) == "exp"){
        if(id.slice(7,8) == 4){
          this.max = 2;
          // this.min = 2;
          this.showAll = false;
        }else{
          this.max = this.dataColumnsNumber.length;
        }
        this.expOption = this.dataColumnsNumber;
      }
    },//类似于事件的冒泡原理
  },
  computed:{
  	// configT(){
  	// 	return this.$store.state.configType;
  	// },
  },
  watch: {
  	// configT(newV){
   //    this.expValue = [];
   //    this.checkAll = false;
   //    this.isIndeterminate = true;
  	// 	let type = newV.slice(4,7);
   //    let run = this.$store.state.runList;
   //    if(run[newV] && type!= "dat"){
   //      this.getColumns(newV);
   //    }
   //    this.$nextTick(()=>{
   //      if(type == "exp"){    
   //        let para = this.$store.state.configData[newV]; 
   //        if(JSON.stringify(para.config) != "{}"){
   //          for(let i in para.config.parameter.columnNames){
   //            if(this.dataColumns.indexOf(para.config.parameter.columnNames[i]) != -1){
   //              this.expValue.push(para.config.parameter.columnNames[i]);
   //            }
   //          }
   //        }    
   //        this.configType = 1;
   //      }else if(type == "pre"){
   //        this.configType = 2;
   //      }else if(type == "fea"){
   //        this.configType = 3;
   //      }else if(type == "dat"){
   //        // let data = this.$store.state.configData[newV];
   //        // let col = this.$store.state.configOrder[newV];
   //        // this.dataInfo["name"] = data.type;
   //        // this.dataInfo["url"] = data.config.fileUrl[0][newV];
   //        // this.dataInfo["id"] = data.config.fileId;
   //        // this.dataInfo["column"] = col.column.join(",");
   //        // this.dataInfo["columnNumber"] = col.columnNumber.join(",");
   //        // console.log(this.dataInfo);
   //        this.$refs.ConfigData.getDetail(newV);
   //        this.configType = 4;
   //      }
   //    })
  	// 	// if(type == "exp"){    
   //  //     let para = this.$store.state.configData[newV]; 
   //  //     if(para.config != null){
   //  //       this.expValue = this.deepCopy(para.config);
   //  //     }    
   //  //     this.configType = 1;
  	// 	// }else if(type == "pre"){
  	// 	// 	this.configType = 2;
  	// 	// }else if(type == "fea"){
   //  //     this.configType = 3;
   //  //   }
  	// },
  }
};
</script>

<style>
.configPart {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
	min-height: 300px;
}
.save {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.choose {
	height: 300px;
	padding: 10px;
}
</style>