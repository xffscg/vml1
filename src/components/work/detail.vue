<template>
	<div class="detail">
		<p>数据详情</p>
		<button @click="close"></button>
		<div class="resPart"></div>
	</div>
</template>

<script>
export default {
  name: 'detail',
  methods :{
  	close(){
  		this.$store.commit("changeShow", false);
  	}
  }
};
</script>

<style>
.detail {
	width:100%;
	height: 100%;
	position: absolute;
	background-color: white;
}
/*.resPart {
	position: relative;
	width: 80%;
	height: 80%;
	background-color: white;
	opacity:1;
}*/
</style>