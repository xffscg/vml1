<template>
	<div class="pre">
		<div v-show="preType == 1" class="preFunc">
			<h3>过滤数据</h3>
			<div class="select">
				<el-select v-model="filter.colName">
					<el-option v-for="value in column" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<el-select v-model="filter.operate">
					<el-option v-for="item in filterRuleList" :label="item.value" :key="item.id" :value="item.value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<el-input v-model="filter.value" placeholder="请输入数字"></el-input>
			</div>	
			<div class="select">
				<el-select :disabled="true" v-model="filter.relation">
					<el-option v-for="item in filterRuleList" :label="item.value" :key="item.id" :value="item.value"></el-option>
				</el-select>
			</div>
		</div>
		<div v-show="preType == 2" class="preFunc">
			<h3>填充空值</h3>
			<div class="preList">
				<div class="preItem" v-for="(item, index) in fillArray" :key="index">
					<el-tag type="info">{{item.colName}}</el-tag>&nbsp;&nbsp;<el-link @click="editFill(index)">编辑</el-link>&nbsp;&nbsp;<el-link @click="delFill(index)">删除</el-link><br>
				</div>
			</div>
			<div class="select">
				<h5>列名</h5>
				<el-select v-model="fill.colName">
					<el-option v-for="value in column" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>填充方式</h5>
				<el-select v-model="fill.operate">
					<el-option v-for="item in fillRuleList" :label="item" :key="item" :value="item"></el-option>
				</el-select>
			</div>			
			<div class="save" @click="addFill"><el-button icon="el-icon-plus" style="width:90%" type="primary">新增</el-button></div>
		</div>
		<div v-show="preType == 3" class="preFunc">
			<h3>拆分列</h3>
			<div class="select">
				<h5>拆分列名</h5>
				<el-select v-model="divide.columnName">
					<el-option v-for="value in column" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>分隔符</h5>
				<el-input v-model="divide.delimiter"></el-input>
			</div>
			<div class="preList">
				<div class="preItem" v-for="(item, index) in divide.newColumnNames">
					<el-tag type="info">{{item}}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;<el-link @click="delDivideName(index)">删除</el-link><br>
				</div>
			</div>
			<div class="select">
				<h5>新列名</h5>
				<el-input v-model="newColumnN"></el-input>
			</div>
			<div class="save" @click="addDivideName"><el-button icon="el-icon-plus" style="width:90%" type="primary">新增</el-button></div>
		</div>
		<div v-show="preType == 4" class="preFunc">
			<h3>排序</h3>
			<div class="select">
				<h5>参考列</h5>
				<el-select v-model="sort.columnName">
					<el-option v-for="value in columnNumberType" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>排序方式</h5>
				<el-radio v-model="chooseType" label="1">升序</el-radio>
              	<el-radio v-model="chooseType" label="2">降序</el-radio>
			</div>
		</div>
		<div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>
	</div>
</template>

<script>
import { filter, fillNullValue, columnMap, columnSplit, columnsMerge, sort, replace } from '@/api/dataProcess'
import { Message } from 'element-ui'
export default {
  name: 'configPre',
  props:{
  	column : {
  		type : Array
  	},
  	columnNumberType : {
  		type : Array
  	},
  },
  data(){
  	return {
  		preType : 0,
  		chooseType : "1",
  		filter : {
  			colName : "",
  			operate : "",
  			value : "",
  			relation : ""
  		},
  		fill : {
  			colName : "",
  			operate : ""
  		},
  		fillArray :[],
  		sort : {
  			projectName :"医药病例分类分析",
  			userId : 1,
  			columnName : "",
  			sortType: ""
  		},
  		divide : {
  			projectName :"医药病例分类分析",
  			userId : 1,
  			columnName : "",
  			delimiter : "",
  			newColumnNames : []
  		},
		newColumnN: "",
  		filterRuleList: [
        {
          id: 0,
          value: '>'
        },
        {
          id: 1,
          value: '<'
        },
        {
          id: 2,
          value: '=='
        },
        {
          id: 3,
          value: '<='
        },
        {
          id: 4,
          value: '>='
        }
      ],
      fillRuleList : ['均值填充', '最小值填充', '最大值填充', '向前填充', '向后填充'],
  	}
  },
  methods :{
  	save(){
  		let para = {};
  		if(this.preType == 1){  			
  			para = {name : this.configT, config : {projectName : "医药病例分类分析", parameter : [this.filter], userId : 1}};
  		}else if(this.preType == 4){
  			if(this.chooseType == "1"){
  				this.sort.sortType = "升序";
  			}else{
  				this.sort.sortType = "降序";
  			}
  			para = {name : this.configT, config : this.sort};
  		}else if(this.preType == 2){
  			if(this.fill.colName != "" && this.fill.operate != ""){
	  			this.fillArray.push(this.fill);
	  		}
	  		para = {name : this.configT, config : {projectName : "医药病例分类分析", parameter : this.fillArray, userId : 1}};
  		}else if(this.preType == 3){
  			if(this.newColumnN != ""){
	  			this.divide.newColumnNames.push(this.newColumnN);
	  		}
	  		para = {name : this.configT, config : this.divide};
  		}
  		this.$store.commit("changeConfig", para);
  	},
  	addFill(){
  		if(this.fill.colName != "" && this.fill.operate != ""){
  			this.fillArray.push({colName :this.fill.colName, operate : this.fill.operate});
  			this.fill.colName = "";
  			this.fill.operate = "";
  		}else{
  			Message.error("请完善本条填充信息");
  		}
  	},
  	editFill(index){
  		console.log(inde + " wait edit");
  		// this.fill.colName = this.fillArray[index].colName;
  		// this.fill.operate = this.fillArray[index].operate;
  	},
  	delFill(index){
  		if(this.fillArray.length == 1){
	        this.fillArray = [];
	    }else{   
	        if(index == 0){
	        	this.fillArray = this.fillArray.slice(1);
	        }else if(index == this.fillArray.length -1){
	        	this.fillArray = this.fillArray.slice(0, this.fillArray.length-1);
	        }else{
	        	this.fillArray = (this.fillArray.slice(0, index)).concat(this.fillArray.slice(index+1, this.fillArray.length));
	      }
	    }
  	},
  	addDivideName(){
  		if(this.newColumnN != ""){
  			this.divide.newColumnNames.push(this.newColumnN);
  			this.newColumnN = "";
  		}else{
  			Message.error("请完善本条填充信息");
  		}
  	},
  	delDivideName(index){
  		if(this.divide.newColumnNames.length == 1){
	        this.divide.newColumnNames = [];
	    }else{   
	        if(index == 0){
	        	this.divide.newColumnNames = this.divide.newColumnNames.slice(1);
	        }else if(index == this.divide.newColumnNames.length -1){
	        	this.divide.newColumnNames = this.divide.newColumnNames.slice(0, this.divide.newColumnNames.length-1);
	        }else{
	        	this.divide.newColumnNames = (this.divide.newColumnNamesy.slice(0, index)).concat(this.divide.newColumnNames.slice(index+1, this.divide.newColumnNames.length));
	        }
	    }
  	},
  },
  computed:{
  	configT(){
  		return this.$store.state.configType;
  	},
  },
  watch: {
  	configT(newV){
  		let type = newV.slice(4,7);
  		let preT = newV.slice(7,8);
  		if(type == "pre"){  			
  			this.preType = Number(preT);
  		}
  	},
  }
};
</script>

<style>
.pre {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
	min-height: 300px;
	padding-top: 15px; 
}
.save {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.preFunc {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}
.select {
	width: 90%;
	height: 60px;
	margin: 2px;
}
.preList {
	width: 90%;
	display: flex;
	justify-content: center;
	position: relative;
	flex-direction: column;
	align-items: center;
}
.preList:last-child {
	border-bottom: none;
}
.preItem {
	border-bottom: solid 1px black;
	width: 90%;
	height: 30px;
	line-height: 30px;
	padding: 5px;
}
</style>