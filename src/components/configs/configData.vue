<template>
	<div class="data">
		<div class="title">
			<h3>数据详情</h3>
		</div>
		<div class="dataItem">
			<span>数据名称： {{dataInfo.name}}</span>
		</div>
		<div class="dataItem">
			<span>数据路径： {{dataInfo.url}}</span>
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
</template>

<script>
export default {
	name : "configData",
	data(){
		return {
			dataInfo : {}
		}
	},
	methods : {
		getDetail(newV){
			console.log("dtata")
		  let data = this.$store.state.configData[newV];
          let col = this.$store.state.configOrder[newV];
          this.dataInfo["name"] = data.type;
          this.dataInfo["url"] = data.config.fileUrl[0][newV];
          this.dataInfo["id"] = data.config.fileId;
          this.dataInfo["column"] = col.column.join(",");
          this.dataInfo["columnNumber"] = col.columnNumber.join(",");
          console.log(this.dataInfo);
		}
	},
	// props : {
	// 	info : {
	// 		type : Object
	// 	}
	// }
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