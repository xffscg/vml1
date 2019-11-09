<template>
	<div class="report">
		<h3>报告</h3>
		<div class="content">
		</div>
		<div class="footer">
			<el-button type="primary" plain icon="el-icon-s-operation" @click="saveReport">保存报告</el-button>
		</div>
	</div>
</template>

<script>
export default {
  name: 'report',
  components : {
  },
  methods: {
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
  	saveReport(){
  		this.$store.commit("changeShow", 0);
  	}
  },
};
</script>

<style scoped>
.report {
	height: 100%;
	width: 100%;
	position: relative;
	background-color: white;
}
.reportItem {
	width: 100%;
}
.content {
	height: 650;
	width: 100%;
	margin-bottom: 10px;
	overflow-y: auto;
}
.footer {
	height: 50px;
	width: 100%;
	bottom: 0;
	padding-bottom: 10px;
	position: absolute;
	display: flex;
	justify-content: center;
}
</style>