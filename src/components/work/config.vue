<template>
	<div class="configPart">
		<div v-show="configType == 1" style="padding-top:15px;">
			<h3>请选择字段</h3>
			<div class="choose">
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="expValue" @change="handleCheckedOptionsChange">
              <el-checkbox v-for="value in expOption" :label="value" :key="value">{{value}}</el-checkbox>
          </el-checkbox-group>
    	</div>       
    <div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>
		</div>
		<ConfigPre v-show="configType == 2" :column="dataColumns" :columnNumberType="dataColumnsNumber"></ConfigPre>
	</div>

</template>

<script>
import { getColumnNames, getColumnNameWithNumberType, fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
// import {  } from '@/api/dataExploration'
import ConfigPre from '../configs/configPre'
export default {
  name: 'config',
  components :{
    ConfigPre
  },
  data(){
  	return {
  		configType : 0,
  		checkAll: false,
      	isIndeterminate: true,
        expOption : [],
      	dataColumns : [],
        dataColumnsNumber : [],
      	expValue : []
  	}
  },
  methods :{
  	handleCheckAllChange(val) {
  		console.log(val);
        this.expValue = val ? this.dataColumns : [];
        this.isIndeterminate = false;
   },
    handleCheckedOptionsChange(value) {
	    let checkedCount = value.length;
	    this.checkAll = checkedCount === this.dataColumns.length;
	    this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataColumns.length;
    },
    save(){
    	let para = {name : this.configT, config : {projectName : "医药病例分类分析", columnNames: JSON.stringify(this.expValue)}};
    	this.$store.commit("changeConfig", para);
    },
    getClomns(){
      getColumnNames({ params: { projectName: "医药病例分类分析" } })
      .then(res => res.data)
      .then(res => {
        this.dataColumns = res;
        if(this.configT.slice(7) == "1" || this.configT.slice(7) == "2"){
          this.expOption = res;          
        }
      })
      .catch(e => {
        Message.error(e.error || 'getColumnNames接口1错误，请重试')
      })
      getColumnNameWithNumberType({ // 获取数值型列名
        params: {
          projectName: "医药病例分类分析"
        }
      })
        .then(res => res.data)
        .then(res => {
          this.dataColumnsNumber = res;
          if(this.configT.slice(7) == "3" || this.configT.slice(7) == "4"){
            this.expOption = res;          
          }
          // console.log(res) // 以数组的形式返回列名
          // for (var i = 0; i < res.length; i++) {
          //   let value = { value: res[i], id: i }
          //   this.dataShadowFieldList.push(value)
          //   this.dataSortFieldList.push(value)
          // }
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNameWithNumberType接口错误，请重试')
        })
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
  		let type = newV.slice(4,7);
      let type1 = newV.slice(7);
      let r = this.$store.state.relationship;
      for(let i = 0; i < r.length; i++){
        if(r[i][1] == newV){
          this.getClomns();
        }
      }
  		if(type == "exp"){  		        
        this.configType = 1;
  		}else if(type == "pre"){
  			this.configType = 2;
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