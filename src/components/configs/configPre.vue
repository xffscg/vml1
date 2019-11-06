<template>
	<div class="pre">
		<div v-show="preType == 1" class="preFunc">
			<h3>过滤数据</h3>
			<div class="preList">
				<div class="preItem" v-for="(item, index) in filterArray" :key="index">
					<el-tag type="info">{{item.colName}}</el-tag><el-tag type="info">{{item.operate}}</el-tag><el-tag type="info">{{item.value}}</el-tag>&nbsp;&nbsp;<el-link @click="editFill(index)">编辑</el-link>&nbsp;&nbsp;<el-link @click="delFilter(index)">删除</el-link><br>
				</div>
			</div>
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
			<div class="save" @click="addFilter"><el-button icon="el-icon-plus" style="width:90%" type="primary">新增</el-button></div>
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
		<div v-show="preType == 5" class="preFunc">
			<h3>数据列投影</h3>
			<div class="preList">
				<div class="preItem" v-for="(item, index) in shadowArray" :key="index">
					<el-tag type="info">{{item.colName_1}}</el-tag><el-tag type="info">{{item.operate_1}}</el-tag><el-tag type="info">{{item.value_1}}</el-tag><el-tag type="info">{{item.operate}}</el-tag><br>
					<el-tag type="info">{{item.colName_2}}</el-tag><el-tag type="info">{{item.operate_2}}</el-tag><el-tag type="info">{{item.value_2}}</el-tag><el-tag type="info">{{item.newName}}</el-tag><br>
					<el-link @click="editFill(index)">编辑</el-link>&nbsp;&nbsp;<el-link @click="delShadow(index)">删除</el-link><br>
				</div>
			</div>
			<div class="select">
				<h5>选择列1</h5>
				<el-select v-model="shadow.colName_1">
					<el-option v-for="value in columnNumberType" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>操作符</h5>
				<el-select v-model="shadow.operate_1">
					<el-option v-for="item in shadowRuleList" :label="item" :key="item" :value="item"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>操作值</h5>
				<el-input v-model="shadow.value_1" placeholder="请输入数字"></el-input>
			</div>
			<div class="select">
				<h5>列间操作符</h5>
				<el-select v-model="shadow.operate">
					<el-option v-for="item in shadowRuleList" :label="item" :key="item" :value="item"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>选择列2</h5>
				<el-select v-model="shadow.colName_2">
					<el-option v-for="value in columnNumberType" :label="value" :key="value" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>操作符</h5>
				<el-select v-model="shadow.operate_2">
					<el-option v-for="item in shadowRuleList" :label="item" :key="item" :value="item"></el-option>
				</el-select>
			</div>
			<div class="select">
				<h5>操作值</h5>
				<el-input v-model="shadow.value_2" placeholder="请输入数字"></el-input>
			</div>
			<div class="select">
				<h5>新列名</h5>
				<el-input v-model="shadow.newName"></el-input>
			</div>
			<div class="save" @click="addShadow"><el-button icon="el-icon-plus" style="width:90%" type="primary">新增</el-button></div>
		</div>
		<div v-show="preType == 6" class="preFunc">
			<h3>多列合并</h3>
			<div class="selectHigh">
				<h5>列名</h5>				
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="value in columnsOption" :label="value" :key="value">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<h5>连接符</h5>
				<el-input v-model="connect.connectorn"></el-input>
			</div>
			<div class="select">
				<h5>新列名</h5>
				<el-input v-model="connect.newColumnName"></el-input>
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
  		checkAll: false,
      isIndeterminate: true,
      columnsOption : [],
      columnsValue : [],
  		filter : {
  			colName : "",
  			operate : "",
  			value : "",
  			relation : ""
  		},
  		filterArray : [],
  		fill : {
  			colName : "",
  			operate : ""
  		},
  		fillArray :[],
  		sort : {
  			columnName : "",
  			sortType: ""
  		},
  		divide : {
  			columnName : "",
  			delimiter : "",
  			newColumnNames : []
  		},
  		connect : {
  			columnNames : [],
  			connector : "",
  			newColumnName : ""
  		},
  		shadow : {
  			colName_1: '',
            operate_1: '',
	        value_1: '',
	        operate : '',
	        colName_2: '',
            operate_2: '',
	        value_2: '',
	        newName : ''
  		},
  		shadowArray : [],
		newColumnN: "",
		shadowRuleList: ['+', '-', '*', '/'],
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
  	handleCheckAllChange(val) {
  		console.log(val);
        this.columnsValue = val ? this.columnsOption : [];
        this.isIndeterminate = false;
    },
    handleCheckedOptionsChange(value) {
	    let checkedCount = value.length;
	    this.checkAll = checkedCount === this.columnsOption.length;
	    this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnsOption.length;
    },
  	save(){
  		let para = {};
  		if(this.preType == 1){ 
	  		if(this.filter.colName != "" && this.filter.operate != "" && this.filter.value != ""){
	  			this.filterArray.push({colName :this.filter.colName, operate : this.filter.operate, value : this.filter.value});
	  			this.filter.colName = "";
	  			this.filter.operate = "";
	  			this.filter.value = "";
	  		}		
  			para = {parameter : this.filterArray};
  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
  		}else if(this.preType == 4){
  			if(this.chooseType == "1"){
  				this.sort.sortType = "升序";
  			}else{
  				this.sort.sortType = "降序";
  			}
  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.sort}});
  			// para = {name : this.configT, config : this.sort};
  		}else if(this.preType == 2){
  			if(this.fill.colName != "" && this.fill.operate != ""){
	  			this.fillArray.push({colName :this.fill.colName, operate : this.fill.operate});
	  			this.fill.colName = "";
	  			this.fill.operate = "";
	  		}
	  		para = {parameter : this.fillArray};
	  		this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
  		}else if(this.preType == 3){
  			if(this.newColumnN != ""){
	  			this.divide.newColumnNames.push(this.newColumnN);
	  			this.newColumnN = "";
	  		}
	  		this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.divide}});
  		}else if(this.preType == 5){
  			if(this.shadow.colName_1 != "" && this.shadow.operate_1 != "" && this.shadow.value_1 != "" && this.shadow.operate != "" && this.shadow.colName_2 != "" && this.shadow.operate_2 != "" && this.shadow.value_2 != "" && this.shadow.newName != ""){
	  			this.shadowArray.push({colName_1 :this.shadow.colName_1, operate_1 : this.shadow.operate_1, value_1 : this.shadow.value_1, operate : this.shadow.operate, colName_2 :this.shadow.colName_2, operate_2 : this.shadow.operate_2, value_2 : this.shadow.value_2, newName : this.shadow.newName});
	  			this.shadow.colName_1 = "";
	  			this.shadow.operate_1 = "";
	  			this.shadow.value_1 = "";
	  			this.shadow.operate = "";
	  			this.shadow.colName_2 = "";
	  			this.shadow.operate_2 = "";
	  			this.shadow.value_2 = "";
	  			this.shadow.newName = "";
	  		}
	  		para = {parameter : this.shadowArray};
	  		this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
  		}else if(this.preType == 5){
  			for(let i in this.columnsValue){
  				this.connect.columnNames.push(this.columnsValue[i]);
  			}
	  		this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.connect}});
  		}
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
  	addFilter(){
  		if(this.filter.colName != "" && this.filter.operate != "" && this.filter.value != ""){
  			this.filterArray.push({colName :this.filter.colName, operate : this.filter.operate, value : this.filter.value});
  			this.filter.colName = "";
  			this.filter.operate = "";
  			this.filter.value = "";
  		}else{
  			Message.error("请完善本条过滤信息");
  		}
  	},
  	addShadow(){
  		if(this.shadow.colName_1 != "" && this.shadow.operate_1 != "" && this.shadow.value_1 != "" && this.shadow.operate != "" && this.shadow.colName_2 != "" && this.shadow.operate_2 != "" && this.shadow.value_2 != "" && this.shadow.newName != ""){
  			this.shadowArray.push({colName_1 :this.shadow.colName_1, operate_1 : this.shadow.operate_1, value_1 : this.shadow.value_1, operate : this.shadow.operate, colName_2 :this.shadow.colName_2, operate_2 : this.shadow.operate_2, value_2 : this.shadow.value_2, newName : this.shadow.newName});
  			this.shadow.colName_1 = "";
  			this.shadow.operate_1 = "";
  			this.shadow.value_1 = "";
  			this.shadow.operate = "";
  			this.shadow.colName_2 = "";
  			this.shadow.operate_2 = "";
  			this.shadow.value_2 = "";
  			this.shadow.newName = "";
  		}else{
  			Message.error("请完善本条过滤信息");
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
  	delFilter(index){
  		if(this.filterArray.length == 1){
	        this.filterArray = [];
	    }else{   
	        if(index == 0){
	        	this.filterArray = this.filterArray.slice(1);
	        }else if(index == this.filterArray.length -1){
	        	this.filterArray = this.filterArray.slice(0, this.filterArray.length-1);
	        }else{
	        	this.filterArray = (this.filterArray.slice(0, index)).concat(this.filterArray.slice(index+1, this.filterArray.length));
	      }
	    }
  	},
  	delShadow(index){
  		if(this.shadowArray.length == 1){
	        this.shadowArray = [];
	    }else{   
	        if(index == 0){
	        	this.shadowArray = this.shadowArray.slice(1);
	        }else if(index == this.shadowArray.length -1){
	        	this.shadowArray = this.shadowArray.slice(0, this.shadowArray.length-1);
	        }else{
	        	this.shadowArray = (this.shadowArray.slice(0, index)).concat(this.shadowArray.slice(index+1, this.shadowArray.length));
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
  		this.columnsOption = this.column;
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
	height: 450px;
	overflow-y: auto;
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
.selectHigh {
  width: 90%;
  min-height: 60px;
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
	min-height: 30px;
	line-height: 30px;
	padding: 5px;
}
</style>