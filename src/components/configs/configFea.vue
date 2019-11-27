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
      <h3>独热编码</h3>
      <div class="feaList">
        <div class="feaItem" v-for="(item, index) in oneHotList" :key="index">
          <el-tag type="info">{{item.columnName}}</el-tag><el-tag type="info">{{item.newColumnName}}</el-tag>&nbsp;&nbsp;<el-link @click="editHot(index)">编辑</el-link>&nbsp;&nbsp;<el-link @click="delHot(index)">删除</el-link><br>
        </div>
      </div>
      <div class="select">
        <el-select v-model="oneHot.columnName">
          <el-option v-for="(value,i) in columnNumberType" :label="value" :key="i" :value="value"></el-option>
        </el-select>
      </div>
      <div class="select">
        <el-input v-model="oneHot.newColumnName" placeholder="请输入新列名"></el-input>
      </div>     
      <div class="save" @click="addHot"><el-button icon="el-icon-plus" style="width:90%" type="primary">新增</el-button></div> 
    </div>
		<div v-show="feaType == 7" class="feaFunc">
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
		<div v-show="feaType == 8" class="feaFunc">
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
				<el-input v-model="chi.numTopFeatures" type="number"></el-input>
			</div>	
      <div class="select">
        <el-select v-model="chi.columnName_label">
          <el-option v-for="(value,i) in columnNumberType" :label="value" :key="i" :value="value"></el-option>
        </el-select>
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
      configT : "",
  		feaType : 0,
  		chooseType : "1",
  		checkAll: false,
      isIndeterminate: true,
      columnsOption : [],//数值类型
      colOption: [],//非数值类型
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
      oneHot : {
        columnName : "",
        newColumnName : ""
      },
      oneHotArray : {
        columnNames : [],
        newColumnNames : []
      },
      oneHotList : [],
  		poly : {
  			columnNames : [],
  			newColumnName : ""
  		},
  		chi :{
  			columnNames : [],
  			newColumnName : "",
  			numTopFeatures : 0,
  			columnName_label : ""
  		},
  		
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
        this.columnsValue = val ? this.columnsOption : [];
        this.isIndeterminate = false;
    },
    handleCheckedOptionsChange(value) {
	    let checkedCount = value.length;
	    this.checkAll = checkedCount === this.columnsOption.length;
	    this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnsOption.length;
    },
  	save(){
      // 需要做的事情:是否已有配置。已有则读取；已有配置是否合法，不合法则删掉；保存新的配置时，避免重复添加;保证新列名无重复
  		let para = {parameter : {}, fileUrl : []};;
      let list = this.$store.state.runList;
      let pre = list[this.configT].pre;
      let fileUrl = [];
         let r = this.$store.state.relationship;
      // 可以后续加判断，如果父节点是分数据的就另外写
      for(let i in pre){
        let obj = {};
        for(let index in r){
          if(r[index][1].slice(2) == this.configT && r[index][0].slice(5) == pre[i]){
            obj[pre[i]] = Number(r[index][0].slice(4,5));
          }
        }
        fileUrl.push(obj);
      }
      para["fileUrl"] = fileUrl;
      para.parameter["userId"] = this.$store.state.userId;
      para.parameter["projectId"] = this.$store.state.projectId;
  		if(this.feaType == 1){
        if(this.column.indexOf(this.quantile.newColumnName) != -1){
          Message.error(this.quantile.newColumnName + "列名已存在")
        }else{	  		
          let orderPara = this.column.concat([this.quantile.newColumnName]);
          for(let i in this.quantile){
            if(typeof this.quantile[i] === "object"){
              para.parameter[i] = this.deepCopy(this.quantile[i]);
            }else{
              para.parameter[i] = this.quantile[i];
            }
          }
        	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
          this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
          this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
          this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
        }
  		}else if(this.feaType == 2){
        if(this.column.indexOf(this.vector.newColumnName) != -1){
          Message.error(this.vector.newColumnName + "列名已存在")
        }else{  
          this.vector.columnNames = [];
          console.log(this.columnsValue);
    			for(let i in this.columnsValue){
    				this.vector.columnNames.push(this.columnsValue[i]);
    			}
          for(let i in this.vector){
              if(typeof this.vector[i] === "object"){
                para.parameter[i] = this.deepCopy(this.vector[i]);
              }else{
                para.parameter[i] = this.vector[i];
              }
            }
          	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
            let orderPara = this.column.concat([this.vector.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
  		}else if(this.feaType == 3){
        if(this.column.indexOf(this.standard.newColumnName) != -1){
          Message.error(this.standard.newColumnName + "列名已存在")
        }else{  
          this.standard.columnNames = [];
    			for(let i in this.columnsValue){
    				this.standard.columnNames.push(this.columnsValue[i]);
    			}
          for(let i in this.standard){
              if(typeof this.standard[i] === "object"){
                para.parameter[i] = this.deepCopy(this.standard[i]);
              }else{
                para.parameter[i] = this.standard[i];
              }
            }
    			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
          let orderPara = this.column.concat([this.standard.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
  		}else if(this.feaType == 4){
        if(this.column.indexOf(this.pca.newColumnName) != -1){
          Message.error(this.pca.newColumnName + "列名已存在")
        }else{  
          this.pca.columnNames = [];
    			for(let i in this.columnsValue){
    				this.pca.columnNames.push(this.columnsValue[i]);
    			}
          for(let i in this.pca){
              if(typeof this.pca[i] === "object"){
                para.parameter[i] = this.deepCopy(this.pca[i]);
              }else{
                para.parameter[i] = this.pca[i];
              }
            }
    			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
          let orderPara = this.column.concat([this.pca.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
  		}else if(this.feaType == 8){
        if(this.column.indexOf(this.chi.newColumnName) != -1){
          Message.error(this.chi.newColumnName + "列名已存在")
        }else{  
          this.chi.columnNames = [];
          for(let i in this.columnsValue){
            this.chi.columnNames.push(this.columnsValue[i]);
          }
          for(let i in this.chi){
              if(typeof this.chi[i] === "object"){
                para.parameter[i] = this.deepCopy(this.chi[i]);
              }else{
                para.parameter[i] = this.chi[i];
              }
            }
          this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
          let orderPara = this.column.concat([this.chi.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
      }else if(this.feaType == 5){
        if(this.column.indexOf(this.indexer.newColumnName) != -1){
          Message.error(this.indexer.newColumnName + "列名已存在")
        }else{  
          for(let i in this.indexer){
              if(typeof this.indexer[i] === "object"){
                para.parameter[i] = this.deepCopy(this.indexer[i]);
              }else{
                para.parameter[i] = this.indexer[i];
              }
            }
          	this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
            let orderPara = this.column.concat([this.indexer.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
	    }else if(this.feaType == 6){
        if(this.oneHot.columnName != "" && this.oneHot.newColumnName != ""){
          let orderPara = this.column.concat(this.oneHotArray.newColumnNames);
          if(orderPara.indexOf(this.oneHot.newColumnName) != -1){
            Message.error(this.oneHot.newColumnName + "列名已存在")
          }else{            
            this.oneHotList.push({columnName :this.oneHot.columnName, newColumnName : this.oneHot.newColumnName});
            this.oneHotArray.columnNames.push(this.oneHot.columnName);
            this.oneHotArray.newColumnNames.push(this.oneHot.newColumnName);
            this.oneHot.columnName = "";
            this.oneHot.newColumnName = "";
          }
        }  
        for(let i in this.oneHotArray){
            if(typeof this.oneHotArray[i] === "object"){
              para.parameter[i] = this.deepCopy(this.oneHotArray[i]);
            }else{
              para.parameter[i] = this.oneHotArray[i];
            }
          }
          this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
          let orderPara = this.column.concat(this.oneHotArray.newColumnNames);
          this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
          this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
          this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
      }else if(this.feaType == 7){
        if(this.column.indexOf(this.poly.newColumnName) != -1){
          Message.error(this.poly.newColumnName + "列名已存在")
        }else{  
          this.poly.columnNames = [];
  	    	for(let i in this.columnsValue){
    				this.poly.columnNames.push(this.columnsValue[i]);
    			}
          for(let i in this.poly){
              if(typeof this.poly[i] === "object"){
                para.parameter[i] = this.deepCopy(this.poly[i]);
              }else{
                para.parameter[i] = this.poly[i];
              }
            }
  	        this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
            let orderPara = this.column.concat([this.poly.newColumnName]);
            this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : orderPara}});
            this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
            this.nextVaild(this.$store.state.runList[this.configT].next,orderPara, this.columnNumberType);
          }
	    }
  	},
    nextVaild(nextNode, col, colN){
      // 采用逐步提示的方式，如果下一个分支上的节点合法，则继续向下找直到第一个出错的点，或者直到底部；必须包含所有分支
      // let nextNode = this.$store.state.runList[this.configT].next;
      console.log(nextNode);
      let order = this.$store.state.configOrder;
      if(nextNode.length == 0){
        console.log("valid");//无后续节点 安全
      }else{        
        let flag = Array(nextNode.length);
        flag.fill(1);
        for(let i in nextNode){
          console.log(this.$store.state.configData[nextNode[i]]);
          let config = this.$store.state.configData[nextNode[i]].config;
          let name = this.$store.state.configData[nextNode[i]].type;
          console.log(config);
          if(JSON.stringify(config) == "{}"){
            console.log("valid");//下一个节点无配置，下一个节点安全，但是要考虑下一个节点的子节点

          }else{
            if(config.parameter["parameter"]){
              console.log("fill")
              if(typeof config.parameter["parameter"] === "object"){
                console.log("filter或者fill或者shadow")
                console.log(config);
                for(let u in config.parameter["parameter"]){                  
                  if(config.parameter["parameter"][u]["colName"] && col.indexOf(config.parameter["parameter"][u]["colName"]) == -1){
                    console.log("fill filter")
                    flag[i] = 0;
                    Message.warning(name + "配置中包含的" + config.parameter["parameter"][u]["colName"] +"可能出现错误，请检查");
                  }else if(config.parameter["parameter"][u]["colName_1"] && col.indexOf(config.parameter["parameter"][u]["colName_1"]) == -1){
                    flag[i] = 0;
                    Message.warning(name + "配置中包含的" + config.parameter["parameter"][u]["colName_1"] +"可能出现错误，请检查");
                  }else if(config.parameter["parameter"][u]["colName_2"] && col.indexOf(config.parameter["parameter"][u]["colName_2"]) == -1){
                    flag[i] = 0;
                    Message.warning(name + "配置中包含的" + config.parameter["parameter"][u]["colName_2"] +"可能出现错误，请检查");
                  }
                }
              }
            }else if(config.parameter["columnName"] && col.indexOf(config.parameter["columnName"]) == -1){
              console.log("feature或者sort")
              flag[i] = 0;
            Message.warning(name + "配置中包含的" + config.parameter["columnName"] +"可能出现错误，请检查");
          }else if(config.parameter["columnNames"]){
            console.log("feature或者connect")
            console.log(col);
            for(let j in config.parameter["columnNames"]){
              console.log(col.indexOf(config.parameter["columnNames"][j]));
              if(col.indexOf(config.parameter["columnNames"][j]) == -1){
                flag[i] = 0;
                Message.warning(name + "配置中包含的" + config.parameter["columnNames"][j] +"可能出现错误，请检查");
              }
            }
          }
          }
        }
        for(let i in nextNode){
          if(flag[i] == 1){
            if(order[nextNode[i]]){             
              let columnOrder = [];
              for(let  u in order[nextNode[i]].column){
                if(col.indexOf(order[nextNode[i]].column[u]) != -1){
                  columnOrder.push(order[nextNode[i]].column[u]);
                }
              }
              this.$store.commit("changeConfigOrder", {type : "addColumn", config:{name : nextNode[i], column : columnOrder}});
            }
            this.nextVaild(this.$store.state.runList[nextNode[i]].next, col, colN);
          }
        }
      }
    },
    addHot(){
      if(this.oneHot.columnName != "" && this.oneHot.newColumnName != ""){
        let orderPara = this.column.concat(this.oneHotArray.newColumnNames);
        if(orderPara.indexOf(this.oneHot.newColumnName) != -1){
          Message.error(this.oneHot.newColumnName + "列名已存在")
        }else{            
          this.oneHotList.push({columnName :this.oneHot.columnName, newColumnName : this.oneHot.newColumnName});
          this.oneHotArray.columnNames.push(this.oneHot.columnName);
          this.oneHotArray.newColumnNames.push(this.oneHot.newColumnName);
          this.oneHot.columnName = "";
          this.oneHot.newColumnName = "";
        }
      }else{
        Message.error("请完善本条独热编码信息");
      }
    },
    editHot(index){
      console.log(inde + " wait edit");
      // this.fill.colName = this.fillArray[index].colName;
      // this.fill.operate = this.fillArray[index].operate;
    },
    delHot(index){
      if(this.oneHotList.length == 1){
          this.oneHotList = [];
          this.oneHotArray.columnNames = [];
          this.oneHotArray.newColumnNames = [];
      }else{   
          if(index == 0){
            this.oneHotList = this.oneHotList.slice(1);
            this.oneHotArray.columnNames = this.oneHotArray.columnNames.slice(1);
            this.oneHotArray.newColumnNames = this.oneHotArray.newColumnNames.slice(1);
          }else if(index == this.oneHotList.length -1){
            this.oneHotList = this.oneHotList.slice(0, this.oneHotList.length-1);
            this.oneHotArray.columnNames = this.oneHotArray.columnNames.slice(0, this.oneHotList.length-1);
            this.oneHotArray.newColumnNames = this.oneHotArray.newColumnNames.slice(0, this.oneHotList.length-1);
          }else{
            this.oneHotList = (this.oneHotList.slice(0, index)).concat(this.oneHotList.slice(index+1, this.oneHotList.length));
            this.oneHotArray.columnNames = (this.oneHotArray.columnNames.slice(0, index)).concat(this.oneHotArray.columnNames.slice(index+1, this.oneHotList.length));
            this.oneHotArray.newColumnNames = (this.oneHotArray.newColumnNames.slice(0, index)).concat(this.oneHotArray.newColumnNames.slice(index+1, this.oneHotList.length));
        }
      }
    },
    setConfig(newV){
      this.configT = newV;
      let type = newV.slice(4,7);
      let feaT = newV.slice(7,8);
      let para = this.$store.state.configData[newV]; 
      this.columnsOption = this.columnNumberType;
      this.colOption = this.column;
      this.columnsValue = [];
      if(type == "fea"){  
        this.quantile = {
          columnName : "",
          newColumnName : "",
          numBuckets : 5,
        };
        this.vector = {
          columnNames : [],
          newColumnName : "",
          maxCategories : 0
        };
        this.standard = {
          columnNames : [],
          newColumnName : ""
        };
        this.pca = {
          columnNames : [],
          newColumnName : "",
          k : 0
        };
        this.indexer = {
          columnName : "",
          newColumnName : ""
        };
        this.poly = {
          columnNames : [],
          newColumnName : ""
        };
        this.chi ={
          columnNames : [],
          newColumnName : "",
          numTopFeatures : 0,
          label : ""
        };
        this.chi ={
          columnNames : [],
          newColumnName : "",
          numTopFeatures : 0,
          columnName_label : ""
        };
        this.oneHotArray = {
          columnNames : [],
          newColumnNames : []
        };
        this.oneHotList = [];
        let n = Number(feaT)
        if(JSON.stringify(para.config) != "{}"){
          if(para.config.parameter["columnNames"]){
            for(let i in para.config.parameter.columnNames){
              if(this.column.indexOf(para.config.parameter.columnNames[i]) != -1){
                this.columnsValue.push(para.config.parameter.columnNames[i]);
              }
            } 
          }           
          if(n == 7){
              this.poly.newColumnName = para.config.parameter.newColumnName;
          }else if(n == 6){
            for(let i in para.config.parameter.columnNames){
              if(this.column.indexOf(ppara.config.parameter.columnNames[i]) != -1){
                this.oneHotList.push = {columnName : para.config.parameter.columnNames[i], newColumnName :para.config.parameter.newColumnNames[i]};
                this.oneHotArray.columnNames.push(para.config.parameter.columnNames[i]);
                this.oneHotArray.newColumnNames.push(para.config.parameter.newColumnNames[i]);
              }
            }
          }else if(n == 3){
              this.standard.newColumnName = para.config.parameter.newColumnName;
          }else if(n == 4){
              this.pca.newColumnName = para.config.parameter.newColumnName;
          }else if(n == 2){   
              this.vector.newColumnName = para.config.parameter.newColumnName;
              this.vector.maxCategories = para.config.parameter.maxCategories;
          }else if(n == 5){
            if(this.column.indexOf(para.config.parameter.columnName) != -1){
              this.indexer.columnName = para.config.parameter.columnName;
            }
            this.indexer.newColumnName = para.parameter.config.newColumnName;          
          }else if(n == 8){
            this.chi.newColumnName = para.parameter.config.newColumnName;
            this.chi.columnName_label = para.parameter.config.columnName_label;
            this.chi.numTopFeatures = para.parameter.config.numTopFeatures;          
          }else if(n == 1){
            if(this.column.indexOf(para.config.parameter.columnName) != -1){
              this.quantile.columnName = para.config.parameter.columnName;
            }
            this.quantile.newColumnName = para.config.parameter.newColumnName;
            this.quantile.numBuckets = para.config.parameter.numBuckets;
          } 
        }       

        this.feaType = n;
      }
    },
  },
  computed:{
  },
  watch: {
  	
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