<template>
	<div class="detail">
		<div class="content">
			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" height="600">
        <el-table-column v-for="col in column" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
        </el-table-column>
      </el-table>			
		</div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="length">
          </el-pagination>
        </div>
        <div class="close"><el-button style="width:20%" type="primary" @click="close">关闭</el-button></div>
	</div>
</template>

<script>
export default {
  name: 'detail',
  props : {
  	tableData : {
  		type : Array
  	},
  	column : {
  		type : Array
  	},
  	title : {
  		type : String
  	},
  	length : {
  		type : Number
  	}
  },
  data(){
  	return {
  		currentPage:1,
  		pageSize:10,
  	}
  },
  methods :{
  	close(){
  		this.$store.commit("changeShow", 0);
  	},
  	handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
  },
  watch: {
  },
  computed : {
  },
  mounted(){
  }
};
</script>

<style scoped>
.detail {
	width:100%;
	height: 100%;
	position: absolute;
	background-color: white;
	overflow-y: auto; 

}
.title {
	text-align: center;
	margin: 10px 0 5px 0;
	height: 10%;
}
.content {
	flex: 1;
}
.block {
	height: 10%;
	display: flex;
	justify-content: flex-end;
	margin-top: 30px;
}
.close {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>