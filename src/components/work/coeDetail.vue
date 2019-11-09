<template>
	<div class="coeDetail">
		<div id="coeChart" class="chart"></div>
		<div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<script>
export default {
  name: 'coeDetail',
  props : {
  	option : {
  		type : Object
  	}
  },
  methods : {
  	close(){
  		this.$store.commit("changeShow", 0);
  	}
  }
};
</script>

<style>
.coeDetail {
	width:100%;
	height: 100%;
	position: absolute;
	background-color: white;

}
.chart {
	height: 300px;
	width: 500px;
}
.close {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>