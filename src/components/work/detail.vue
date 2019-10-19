<template>
	<div class="detail">
		<p>数据详情</p>
		<button @click="close"></button>
		<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" height="600">
          <el-table-column v-for="col in tableData.column" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
          </el-table-column>
        </el-table>
	</div>
</template>

<script>
export default {
  name: 'detail',
  data(){
  	return {
  		tableD: null,
  		tableData: [],
  		column : [],
  		currentPage:1,
  		pageSize:20,
  	}
  },
  methods :{
  	close(){
  		this.$store.commit("changeShow", false);
  	},
  },
  watch: {
  },
  mounted(){
  	// console.log(this.$store.state.dragContent);
  	// this.tableD = this.$store.state.workData[this.$store.state.dragContent.id];
  	// console.log(this.tableD);
  	// this.tableData = this.tableD.data;
  	// this.column = this.tableD.column;
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