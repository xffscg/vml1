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
				<label>标签字段</label>
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
				<label>标签字段</label>
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
		<div class="mlnFunc" v-show="mlnType==2">
			<h5>GBDT</h5>
			<div class="selectHigh">
				<h5>字段名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<label>标签字段</label>
				<el-select v-model="gbdt.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<label>迭代次数</label>
				<el-input v-model="gbdt.iterations"></el-input>
			</div>	
			<div class="select">
				<label>步长</label>
				<el-input v-model="gbdt.step"></el-input>
			</div>
			<div class="select">
				<label>最大深度</label>
				<el-input v-model="gbdt.maxDepth"></el-input>
			</div>		
			<div class="select">
				<label>叶子节点最少样本</label>
				<el-input v-model="gbdt.minInstancesPerNode"></el-input>
			</div>	
			<div class="select">
				<label>随机数种子</label>
				<el-input v-model="gbdt.seed"></el-input>
			</div>
		</div>
		<div class="mlnFunc" v-show="mlnType==3">
			<h5>逻辑回归二分类</h5>
			<div class="selectHigh">
				<h5>字段名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<label>标签字段</label>
				<el-select v-model="logic.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<label>迭代次数</label>
				<el-input v-model="logic.iterations"></el-input>
			</div>	
			<div class="select">
				<label>回归系数</label>
				<el-input v-model="logic.regParam"></el-input>
			</div>
			<div class="select">
				<label>弹性网络系数</label>
				<el-input v-model="logic.elasticNetParam"></el-input>
			</div>
			<div class="select">
				<label>收敛容限</label>
				<el-input v-model="logic.tol"></el-input>
			</div>		
			<div class="select">
				<label>截距训练</label>
				<el-input v-model="logic.fitIntercept"></el-input>
			</div>
			<div class="select">
				<label>阈值</label>
				<el-input v-model="logic.threshold"></el-input>
			</div>	
		</div>
		<div class="mlnFunc" v-show="mlnType==4">
			<h5>逻辑回归多分类</h5>
			<div class="selectHigh">
				<h5>字段名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<label>标签字段</label>
				<el-select v-model="logicMul.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<label>迭代次数</label>
				<el-input v-model="logicMul.iterations"></el-input>
			</div>	
			<div class="select">
				<label>正则系数</label>
				<el-input v-model="logicMul.regParam"></el-input>
			</div>
			<div class="select">
				<label>弹性网络系数</label>
				<el-input v-model="logicMul.elasticNetParam"></el-input>
			</div>
			<div class="select">
				<label>收敛容限</label>
				<el-input v-model="logicMul.tol"></el-input>
			</div>		
			<div class="select">
				<label>截距训练</label>
				<el-input v-model="logicMul.fitIntercept"></el-input>
			</div>
		</div>
		<div class="mlnFunc" v-show="mlnType==5">
			<h5>多层感知机多分类</h5>
			<div class="selectHigh">
				<h5>字段名</h5>			
			     <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		          <el-checkbox-group v-model="columnsValue" @change="handleCheckedOptionsChange">
		              <el-checkbox v-for="(value,i) in columnsOption" :label="value" :key="i">{{value}}</el-checkbox>
		          </el-checkbox-group>
			</div>
			<div class="select">
				<label>标签字段</label>
				<el-select v-model="mpc.label">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
			<div class="select">
				<label>迭代次数</label>
				<el-input v-model="mpc.iterations"></el-input>
			</div>	
			<div class="select">
				<label>随机数种子</label>
				<el-input v-model="mpc.seed"></el-input>
			</div>
			<div class="select">
				<label>步长</label>
				<el-input v-model="mpc.stepSize"></el-input>
			</div>
			<div class="select">
				<label>每层节点数</label>
				<el-input v-model="mpcLayers"></el-input>
			</div>
			<div class="select">
				<label>收敛容限</label>
				<el-input v-model="mpc.tol"></el-input>
			</div>	
			<div class="select">
				<label>块大小</label>
				<el-input v-model="mpc.blockSize"></el-input>
			</div>	
			<div class="select">
				<label>截距训练</label>
				<el-select v-model="mpc.solver">
					<el-option v-for="(value, i) in mpcOption" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
		</div>
		<div class="mlnFunc" v-show="mlnType==9">
			<h5>评估</h5>
			<div class="select">
				<el-select v-model="evaLabel">
					<el-option v-for="(value, i) in column" :label="value" :key="i" :value="value"></el-option>
				</el-select>
			</div>
		</div>
		<div class="save" @click="save"><el-button icon="el-icon-plus" style="width:90%" type="primary">保存</el-button></div>	
	</div>
</template>

<script>
import { Message } from 'element-ui'
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
				regType : "l2",
			},//支持向量机
			evaLabel : "",
			logic : {
				features : [],
				label : "",
				threshold : 0,
				iterations : 0,
				tol : 0,//收敛系数
				regParam : 0,
				elasticNetParam : 0,
				fitIntercept :"True"
			},
			logicMul : {
				features : [],
				label : "",
				iterations : 0,
				tol : 0,//收敛系数
				regParam : 0,
				elasticNetParam : 0,
				fitIntercept :"True"
			},
			mpc : {
				features : [],
				label : "",
				iterations : 0,
				tol : 0,//收敛系数
				seed : 0,
				stepSize : 0,
				solver :"",
				layers : [],
				blockSize : 128,
			},
			mpcOption : ["l-bfgs","gd"],
			mpcLayers : "",
			gbdt : {
				features : [],
				label : "",
				step : 1.0,
				iterations : 0,
				maxDepth : 0,//收敛系数
				minInstancesPerNode : 1,
				seed : 0,
			},
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
	  		console.log(list)
		    let pre = list[this.configT].pre;
		    console.log(pre);
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
	  		}else if(this.mlnType == 3){ 
		    	this.logic.features = [];
	  			for(let i in this.columnsValue){
	  				this.logic.features.push(this.columnsValue[i]);
	  			}
			    for(let i in this.logic){
			    	if(typeof this.logic[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.logic[i]);
	  				}else{
	  					para.parameter[i] = this.logic[i];
	  				}
			    }	
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}else if(this.mlnType == 9){ 
	  			para.parameter["label"] = this.evaLabel;
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}else if(this.mlnType == 4){ 
		    	this.logicMul.features = [];
	  			for(let i in this.columnsValue){
	  				this.logicMul.features.push(this.columnsValue[i]);
	  			}
			    for(let i in this.logicMul){
			    	if(typeof this.logicMul[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.logicMul[i]);
	  				}else{
	  					para.parameter[i] = this.logicMul[i];
	  				}
			    }	
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}else if(this.mlnType == 5){ 
		    	this.mpc.features = [];
		    	this.mpc.layers = [];
	  			for(let i in this.columnsValue){
	  				this.mpc.features.push(this.columnsValue[i]);
	  			}
	  			let f = this.mpcLayers.split(",");
	  			for(let i in f){
	  				this.mpc.layers.push(f[i]);
	  			}
	  			console.log(this.mpc.layers);
			    for(let i in this.mpc){
			    	if(typeof this.mpc[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.mpc[i]);
	  				}else{
	  					para.parameter[i] = this.mpc[i];
	  				}
			    }	
	  			this.$store.commit("changeConfig", {type :"addConfig", detail:{name : this.configT, config : para}});
	  			this.$store.commit("changeConfigOrder", {type :"addColumn", config:{name : this.configT, column : this.column}});
		  		this.$store.commit("changeConfigOrder", {type :"addColumnN", config:{name : this.configT, columnNumber : this.columnNumberType}});
	  		}else if(this.mlnType == 2){ 
		    	this.gbdt.features = [];
	  			for(let i in this.columnsValue){
	  				this.gbdt.features.push(this.columnsValue[i]);
	  			}
			    for(let i in this.gbdt){
			    	if(typeof this.gbdt[i] === "object"){
	  					para.parameter[i] = this.deepCopy(this.gbdt[i]);
	  				}else{
	  					if(i == "step"){
	  						para.parameter[i] = parseFloat(this.gbdt[i]);
	  					}else if(i == "label"){
	  						para.parameter[i] = this.gbdt[i];
	  					}else{
	  						para.parameter[i] = Number(this.gbdt[i]);
	  					}
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
	  		Message.success("配置保存成功")
		},
		setConfig(newV){
	      this.configT = newV;
	      let type = newV.slice(4,7);
	      let mlnT = newV.slice(7,8);
	      let para = this.$store.state.configData[newV]; 
	      this.columnsOption = this.columnNumberType;
	      this.colOption = this.column;
	      this.columnsValue = [];
	      if(type == "mln" || type == "eva"){  
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
			this.gbdt = {
				features : [],
				label : "",
				step : 1.0,
				iterations : 0,
				maxDepth : 0,//收敛系数
				minInstancesPerNode : 1,
				seed : 0,
			};
			this.logic = {
				features : [],
				label : "",
				threshold : 0,
				iterations : 0,
				tol : 0,//收敛系数
				regParam : 0,
				elasticNetParam : 0,
				fitIntercept :"True"
			};
			this.logicMul = {
				features : [],
				label : "",
				iterations : 0,
				tol : 0,//收敛系数
				regParam : 0,
				elasticNetParam : 0,
				fitIntercept :"True"
			};
			this.predict = {
				features : [],
				label : ""
			};
			this.evaLabel = "";
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
	          }else if(n == 2){
	          	for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 
		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.gbdt.label = para.config.parameter.label;
		          }
		          this.gbdt.step = para.config.parameter.step;
		          this.gbdt.iterations = para.config.parameter.iterations;
		          this.gbdt.minInstancesPerNode = para.config.parameter.minInstancesPerNode;
		          this.gbdt.maxDepth = para.config.parameter.maxDepth;
		          this.gbdt.seed = para.config.parameter.seed;
	          }else if(n == 3){
	          	for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 
		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.logic.label = para.config.parameter.label;
		          }
		          this.logic.regParam = para.config.parameter.regParam;
		          this.logic.iterations = para.config.parameter.iterations;
		          this.logic.elasticNetParam = para.config.parameter.elasticNetParam;
		          this.logic.tol = para.config.parameter.tol;
		          this.logic.fitIntercept = para.config.parameter.fitIntercept;
		          this.logic.threshold = para.config.parameter.threshold;
	          }else if(n == 9){
	              if(this.column.indexOf(para.config.parameter.label) != -1){
	                this.evaLabel = para.config.parameter.label;
	              }		       
	          }else if(n == 4){
	          	for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 
		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.logicMul.label = para.config.parameter.label;
		          }
		          this.logicMul.regParam = para.config.parameter.regParam;
		          this.logicMul.iterations = para.config.parameter.iterations;
		          this.logicMul.elasticNetParam = para.config.parameter.elasticNetParam;
		          this.logicMul.tol = para.config.parameter.tol;
		          this.logicMul.fitIntercept = para.config.parameter.fitIntercept;
		          this.logicMul.threshold = para.config.parameter.threshold;
	          }else if(n == 5){
	          	for(let i in para.config.parameter.features){
		              if(this.column.indexOf(para.config.parameter.features[i]) != -1){
		                this.columnsValue.push(para.config.parameter.features[i]);
		              }
		          } 

		          if(this.column.indexOf(para.config.parameter.label) != -1){
		          	this.mpc.label = para.config.parameter.label;
		          }
		          this.mpcLayers = para.config.parameter.layers.join(",")
		          this.mpc.seed = para.config.parameter.seed;
		          this.mpc.iterations = para.config.parameter.iterations;
		          this.mpc.stepSize = para.config.parameter.stepSize;
		          this.mpc.tol = para.config.parameter.tol;
		          this.mpc.solver = para.config.parameter.solver;
		          this.mpc.blockSize = para.config.parameter.blockSize;
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
	        console.log(type+mlnT)
	        if(type+mlnT == "eva1"){
	        	this.mlnType = 9;
	        }else {
	        	this.mlnType = n;
	        }
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