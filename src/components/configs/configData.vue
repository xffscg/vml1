<template>
	<div class="data">
		<div v-show="data">
			<div class="title">
				<h3>数据详情</h3>
			</div>
			<div class="dataItem">
				<span>数据名称： {{name}}</span>
			</div>
			<div class="dataItem">
				<span>数据路径： {{url}}</span>
			</div>
			<div class="dataItem">
				<span>数据Id： {{dataInfo.id}}</span>
			</div>
			<div class="dataItem">
				<span>数据列名： </span><br>
				<span>{{dataInfo.column}}</span>
			</div>
			<div class="dataItem">
				<span>数值类型数据列名： </span><br>
				<span>{{dataInfo.columnNumber}}</span>
			</div>
		</div>
		<div v-show="model">
			<div class="title">
				<h3>模型详情</h3>
			</div>
			<div class="dataItem">
				<span>模型名称： {{modelInfo.name}}</span>
			</div>
			<div class="dataItem">
				<span>模型id： {{modelInfo.id}}</span>
			</div>
			<div class="dataItem">
				<span>模型核心算法： {{modelInfo.oriName}}</span>
			</div>
		</div>
		
	</div>
</template>

<script>
export default {
	name : "configData",
	data(){
		return {
			dataInfo : {},
			modelInfo : {
				name : "",
				id : 0,
				oriName : ""
			},
			name : "",
			url : "",
			data : false,
			model : false
		}
	},
	methods : {
		getDetail(newV){
		  let data = this.$store.state.configData[newV];
          let col = this.$store.state.configOrder[newV];
          this.dataInfo["name"] = data.type;
          this.name = data.type;
          this.url = data.config.fileUrl[0][newV]
          this.dataInfo["url"] = data.config.fileUrl[0][newV];
          this.dataInfo["id"] = data.config.fileId;
          this.dataInfo["column"] = col.column.join(",");
          this.dataInfo["columnNumber"] = col.columnNumber.join(",");
          this.model = false;
          this.data = true;
          console.log(this.dataInfo);
		},
		getModelDetail(newV){
			this.modelInfo = {
				name : "",
				id : 0,
				oriName : ""
			};
		  let data = this.$store.state.configData[newV];
		  console.log(data);
		  let alg = this.$store.state.algList;
		  console.log(alg);
		  let oriName = "";
		  if(String(data.config.parameter.modelTypeId).slice(0,3) == "600"){

		  	console.log(alg[4]);
		  	for(let i in alg[4].list){
		  		if(alg[4].list[i].id == data.config.parameter.modelTypeId){
		  			oriName = alg[4].list[i].name;
		  		}
		  	}
		  }
		  this.modelInfo["id"] = data.config.parameter.MLModelId;		
		  this.modelInfo["name"] = data.type;	
		  this.modelInfo["oriName"] = oriName;
		  this.data = false;
		  this.model = true;
		},
	},
};
</script>

<style scoped>
.data {
	width: 100%;
	height: 100%;
	background-color: #F9F9F5;
	height: 450px;
	padding-top: 15px; 
  	overflow-y: auto;
}
.dataItem {
	border-bottom: solid 1px black;
	width: 90%;
	min-height: 30px;
	line-height: 30px;
	padding: 5px;
}
.dataItem:last-child {
	border-bottom: none;
}
.title {
	display: flex;
	justify-content: center;
	background-color: #F9F9F5;
	height: 40px;
	/*margin : 5px;*/
	width: 100%;
}
</style>