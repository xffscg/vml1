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
    <div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>
		</div>
		<ConfigPre v-show="configType == 2" :column="dataColumns" :columnNumberType="dataColumnsNumber"></ConfigPre>
    <ConfigFea v-show="configType == 3" :column="dataColumns" :columnNumberType="dataColumnsNumber"></ConfigFea>
	</div>

</template>

<script>
import { getColumnNames, getColumnNameWithNumberType, fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
// import {  } from '@/api/dataExploration'
import ConfigPre from '../configs/configPre'
import ConfigFea from '../configs/configFea'
export default {
  name: 'config',
  components :{
    ConfigPre,
    ConfigFea
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
    	let para = {};
      if(this.configT.slice(7,8) == "2"){
        para = {columnNames : this.expValue[0]};
      }else{
        para = {columnNames : this.expValue};
      }
    	this.$store.commit("changeConfig", {type : "addConfig", detail : {name : this.configT, config : para}});
    },
    getColumns(id){
      let path = this.popPart(id); 
      let order = this.$store.state.configOrder;
      console.log(order);
      let dataS = {};
      for(let i = 0; i < path.length; i++){
        if(!dataS[path[i][0]]){
          dataS[path[i][0]] = {column : this.deepCopy(order[path[i][0]].column), columnNumber : this.deepCopy(order[path[i][0]].columnNumber)}
        }
        for(let item in order){
          if(path[i].indexOf(item)){
            if(order[item].column.length != 0){
              for(let j in order[item].column){
                dataS[path[i][0]].column.push(order[item].column[j]);
              }              
            }
            if(order[item].columnNumber.length != 0){
              for(let j in order[item].columnNumber){
                dataS[path[i][0]].columnNumber.push(order[item].columnNumber[j]);
              } 
            }
          }
        }
      }
      console.log(dataS);
      for(let i in dataS){
        this.dataColumns = dataS[i].column;
        this.dataColumnsNumber = dataS[i].columnNumber;
      }
      if((id.slice(7,8) == 1 || id.slice(7,8) == 2) && id.slice(4,7) == "exp"){
        if(id.slice(7,8) == 2){
          this.max = 1;
          this.showAll = false;
        }else{
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
    popPart(id){
      let list = this.$store.state.runList;
      let res = [];
      for(let i = 0; i < list[id].pre.length; i++){
        let temp = this.deepCopy(res);
        let subRes = this.popPart(list[id].pre[i]);
        if(typeof subRes[0] == "string"){
          res.push(subRes);
        }else{
          for(let i = 0; i< subRes.length; i++){
            res.push(subRes[i]);
          }
        }
      }
      if(res.length != 0){
        if(typeof res[0] == "string"){
          res.push(id);
        }else{
          for(let i = 0; i < res.length; i++){
            res[i].push(id);
          }
        }
      }else{
        res.push(id);
      }      
      return res;      
    },
  },
  computed:{
  	configT(){
  		return this.$store.state.configType;
  	},
  },
  watch: {
  	configT(newV){
      this.expValue = [];
      this.checkAll = false;
      this.isIndeterminate = true;
  		let type = newV.slice(4,7);
      let run = this.$store.state.runList;
      if(run[newV] && type!= "dat"){
        this.getColumns(newV);
      }
  		if(type == "exp"){        
        this.configType = 1;
  		}else if(type == "pre"){
  			this.configType = 2;
  		}else if(type == "fea"){
        this.configType = 3;
      }
  	},
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