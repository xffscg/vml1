<template>
	<div class="cover">
		<div class="coverTitle"><h1>项目模板</h1></div>
		<div class="proContainer">
			<div class="coverItem">
				<h4>新建空白文档</h4>
				<img src="../../assets/img/blank.jpg" style="width:180px; height : 180px; padding-top:10px; padding-left:8px">
				<div class="footer">					
					<el-button type="text" @click="createProject(-1)">创建项目</el-button>
				</div>
			</div>
			<div class="coverItem" v-for="item in formList">
				<h4>{{item.name}}</h4>
				<img :src="item.imgSrc"  style="width:180px; height : 180px;  padding-top:10px; padding-left:8px">
				<div class="footer">					
					<el-button type="text" @click="createProject(item.id)">从模板创建</el-button>
					<el-button type="text">查看文档</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name : "coverPage",
		data(){
			return {
				formList : [{
					id : 41,
					name : "支持向量机二分类",
					imgSrc : require("../../assets/img/svm.jpg")
				},{
					id : 40,
					name : "朴素贝叶斯二分类",
					imgSrc : require("../../assets/img/NB.jpg")
				},{
					id : 39,
					name : "随机森林二分类",
					imgSrc : require("../../assets/img/randforest.png")
				},{
					id : 37,
					name : "逻辑回归多分类",
					imgSrc : require("../../assets/img/randforest.png")
				}]
			}
		},
		methods :{
			createProject(id){
				this.$emit("createCoverPro",id);
			}
		},
	};
</script>

<style scoped>
.cover {
	width: 100%;
	height: 100%;
	background-color: #FFFFFF;
}
.coverTitle {
	padding-top: 15px;
	width: 100%;
	height: 50px;
	text-align: center;
	margin-bottom: 10px;
}
.proContainer {
	width: 95%;
	padding: 1%;
	height: 580px;
	display: flex;
}
.coverItem {
	width: 200px;
	height: 250px;
	padding: 10px;
	margin: 15px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.footer {
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: center;
}
</style>