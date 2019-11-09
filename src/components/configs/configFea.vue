<template>
	<div class="fea">
		<div v-show="feaType == 1" class="feaFunc">
			<h3>分位数离散</h3>
			<div class="select">
				<el-select v-model="quantile.columnName">
					<el-option v-for="(value, i) in columnNumberType" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<el-input v-model="quantile.newColumnName" placeholder="请输入新列名"></el-input>
			</div>
			<div class="select">
				<el-input v-model="quantile.numBuckets"></el-input>
			</div>
		</div>
		<div v-show="feaType == 2" class="feaFunc">
			<h3>向量索引转换</h3>			
			<div class="selectHigh">
				<h5>列名</h5>				
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-input v-model="vector.newColumnName" placeholder="请输入新列名"></el-input>
			</div>	
			<div class="select">
				<el-input v-model="vector.maxCategories"></el-input>
			</div>		
		</div>
		<div v-show="feaType == 3" class="feaFunc">
			<h3>标准化</h3>
			<div class="selectHigh">
				<h5>列名</h5>

			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-input v-model="standard.newColumnName" placeholder="请输入新列名"></el-input>
			</div>			
		</div>
		<div v-show="feaType == 4" class="feaFunc">
			<h3>pca</h3>
			<div class="selectHigh">
				<h5>列名</h5>
				
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-input v-model="pca.newColumnName" placeholder="请输入新列名"></el-input>
			</div>	
			<div class="select">
				<el-input v-model="pca.k"></el-input>
			</div>		
		</div>
		<div v-show="feaType == 5" class="feaFunc">
			<h3>字符串转标签</h3>
			<div class="select">
				<el-select v-model="indexer.columnName">
					<el-option v-for="(value,i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<el-input v-model="indexer.newColumnName" placeholder="请输入新列名"></el-input>
			</div>			
		</div>
		<div v-show="feaType == 6" class="feaFunc">
			<h3>多项式扩展</h3>
			<div class="selectHigh">
				<h5>列名</h5>

			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-input v-model="poly.newColumnName" placeholder="请输入新列名"></el-input>
			</div>			
		</div>
		<div v-show="feaType == 7" class="feaFunc">
			<h3>卡方</h3>
			<div class="selectHigh">
				<h5>列名</h5>
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-input v-model="chi.newColumnName" placeholder="请输入新列名"></el-input>
			</div>
			<div class="select">
				<el-input v-model="chi.numTopFeatures"></el-input>
			</div>	
			<div class="select">
				<el-input v-model="chi.label"></el-input>
			</div>		
		</div>
		<div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>
	</div>
</template>

<script>
import { filter, fillNullValue, columnMap, columnSplit, columnsMerge, sort, replace } from '@/api/dataProcess'
import { Message } from 'element-ui'
export default {
  name: 'configFea',
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
  		feaType : 0,
  		chooseType : "1",
  		checkAll: false,
      isIndeterminate: true,
      columnsOption : [],
      columnsValue : [],
  		quantile : {
  			columnName : "",
  			newColumnName : "",
  			numBuckets : 5,
  		},
  		vector : {
  			columnNames : [],
  			newColumnName : "",
  			maxCategories : 0
  		},
  		standard : {
  			columnNames : [],
  			newColumnName : ""
  		},
  		pca : {
  			columnNames : [],
  			newColumnName : "",
  			k : 0
  		},
  		indexer : {
  			columnName : "",
  			newColumnName : ""
  		},
  		poly : {
  			columnNames : [],
  			newColumnName : ""
  		},
  		chi :{
  			columnNames : [],
  			newColumnName : "",
  			numTopFeatures : 0,
  			label : ""
  		},
  		
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
  		if(this.feaType == 1){	
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : [this.quantile.newColumnName]}});	  			
        	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.quantile}});
  		}else if(this.feaType == 2){
  			for(let i in this.columnsValue){
  				this.vector.columnNames.push(this.columnsValue[i]);
  			}
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.vector.newColumnName}});
        	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.vector}});
  		}else if(this.feaType == 3){
  			for(let i in this.columnsValue){
  				this.standard.columnNames.push(this.columnsValue[i]);
  			}
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.standard.newColumnName}});
  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.standard}});
  		}else if(this.feaType == 4){
  			for(let i in this.columnsValue){
  				this.pca.columnNames.push(this.columnsValue[i]);
  			}
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.pca.newColumnName}});
  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.pca}});
  		}else if(this.feaType == 5){
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.indexer.newColumnName}});
        	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.indexer}});
	    }else if(this.feaType == 6){
	    	for(let i in this.columnsValue){
  				this.poly.columnNames.push(this.columnsValue[i]);
  			}
  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.poly.newColumnName}});
	        this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : this.poly}});
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
  		let feaT = newV.slice(7,8);

  		this.columnsOption = this.column;
  		if(type == "fea"){  			
  			this.feaType = Number(feaT);
  		}
  	},
  }
};
</script>

<style>
.fea {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
	height: 450px;
	padding-top: 15px; 
  overflow-y: auto;
}
.save {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.feaFunc {
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
.feaList {
	width: 90%;
	display: flex;
	justify-content: center;
	position: relative;
	flex-direction: column;
	align-items: center;
}
.feaList:last-child {
	border-bottom: none;
}
.feaItem {
	border-bottom: solid 1px black;
	width: 90%;
	height: 30px;
	line-height: 30px;
	padding: 5px;
}
</style>