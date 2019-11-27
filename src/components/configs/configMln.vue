<template>
	<div class="mln">
		<div class="mlnFunc" v-show="mlnType==0">
			<h5>预测</h5>
			<div class="selectHigh">
				<h5>列名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-select v-model="predict.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>			
		</div>
		<div class="mlnFunc" v-show="mlnType==1">
			<h5>支持向量机二分类</h5>
			<div class="selectHigh">
				<h5>列名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<el-select v-model="svm.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<label>迭代次数</label>
				<el-input v-model="svm.iterations"></el-input>
			</div>	
			<div class="select">
				<label>步长</label>
				<el-input v-model="svm.step"></el-input>
			</div>
			<div class="select">
				<label>正则化</label>
				<el-input v-model="svm.regType"></el-input>
			</div>		
			<div class="select">
				<label>正则化系数</label>
				<el-input v-model="svm.regParam"></el-input>
			</div>	
			<div class="select">
				<label>收敛系数</label>
				<el-input v-model="svm.convergenceTol"></el-input>
			</div>
		</div>
		
		<div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>	
	</div>
</template>

<script>
export default {
	name : "configMln",
	props : {
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
			mlnType : -1,
			checkAll: false,
      isIndeterminate: true,
			svm : {
				features : [],
				label : "",
				step : 1.0,
				iterations : 0,
				convergenceTol : 0.001,//收敛系数
				regParam : 0,
				regType : 0,
			},//支持向量机
			predict : {
				features : [],
				label : ""
			},
			columnsOption : [],//数值型
			colOption : [],//非数值型
			columnsValue : []
		}
	},
	methods : {
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
			let para = {parameter : {}, fileUrl : []};
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
		    if(this.mlnType == 1){ 
		    	this.svm.features = [];
	  			for(let i in this.columnsValue){
	  				this.svm.features.push(this.columnsValue[i]);
	  			}
			    for(let i in this.svm){
			    	if(typeof this.svm[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.svm[i]);
	  				}else{
	  					para.parameter[i] = this.svm[i];
	  				}
			    }	
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}else if(this.mlnType == 0){
	  			this.predict.features = [];
	  			for(let i in this.columnsValue){
	  				this.predict.features.push(this.columnsValue[i]);
	  			}
	  			for(let i in this.predict){
			    	if(typeof this.predict[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.predict[i]);
	  				}else{
	  					para.parameter[i] = this.predict[i];
	  				}
			    }
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}
		},
		setConfig(newV){
	      this.configT = newV;
	      let type = newV.slice(4,7);
	      let mlnT = newV.slice(7,8);
	      let para = this.$store.state.configData[newV]; 
	      this.columnsOption = this.columnNumberType;
	      this.colOption = this.column;
	      this.columnsValue = [];
	      if(type == "mln"){  
	        let n = Number(mlnT);
	        this.svm = {
				features : [],
				label : "",
				step : 1.0,
				iterations : 0,
				convergenceTol : 0.001,//收敛系数
				regParam : 0,
				regType : 0,
			};
			this.predict = {
				features : [],
				label : ""
			};
	        if(JSON.stringify(para.config) != "{}"){  
	          if(n == 1){
	              for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 
		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.svm.label = para.config.parameter.label;
		          }
		          this.svm.step = para.config.parameter.step;
		          this.svm.iterations = para.config.parameter.iterations;
		          this.svm.convergenceTol = para.config.parameter.convergenceTol;
		          this.svm.regParam = para.config.parameter.regParam;
		          this.svm.regType = para.config.parameter.regType;
	          }else if(n == 0){
	              for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 
		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.predict.label = para.config.parameter.label;
		          }		        
	          }
	        }       

	        this.mlnType = n;
	      }
	    },
	},
};
</script>

<style scoped>
.mln {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
	height: 450px;
	padding-top: 15px; 
  	overflow-y: auto;
}
.mlnFunc {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}
.select {
	width: 90%;
	min-height: 30px;
	line-height: 30px;
	padding: 5px;
}
.title {
	display: flex;
	justify-content: center;
	background-color: #F9F9F5;
	height: 40px;
	/*margin : 5px;*/
	width: 100%;
}
.selectHigh {
  width: 90%;
  min-height: 60px;
  margin: 2px;
}
</style>