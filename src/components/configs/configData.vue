<template>
	<div class="data">
		<div class="title">
			<h3>数据详情</h3>
		</div>
		<div class="dataItem">
			<span>数据名称： {{info.name}}</span>
		</div>
		<div class="dataItem">
			<span>数据路径： {{info.url}}</span>
		</div>
		<div class="dataItem">
			<span>数据Id： {{info.id}}</span>
		</div>
		<div class="dataItem">
			<span>数据列名： </span><br>
			<span>{{info.column}}</span>
		</div>
		<div class="dataItem">
			<span>数值类型数据列名： </span><br>
			<span>{{info.columnNumber}}</span>
		</div>
	</div>
</template>

<script>
export default {
	name : "configData",
	props : {
		info : {
			type : Object
		}
	}
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