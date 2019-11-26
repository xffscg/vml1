<template>
	<div class="table">		
		<h3>分析方法： {{title}}</h3>
    <p>配置内容：</p>
    <!-- <div class="config">
      <div class="configItem" v-for="item in configData">
        <span>{{item.key}} : {{item.para}}</span>
      </div>
    </div> -->
    <el-table :data="configData" style="width: 100%" height="200">
          <el-table-column v-for="col in columnC" :prop="col.prop" :label="col.prop" :key="col.prop">
          </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%" height="600">
          <el-table-column v-for="col in columnD" :prop="col.prop" :label="col.prop" :key="col.prop">
          </el-table-column>
    </el-table> 
	</div>
</template>

<script>
// 全表统计   +++   预处理  ++ 频率统计 ++ 特征工程
export default {
  name: 'preProcess',
};
</script>

<style scoped>
.table{
  width: 97%;
  margin: 10px; 
}
.config {
  width: 100%;
  min-height: 30px;
  display: flex;
  flex-direction: column;
}
.configItem {
  border-bottom: solid 1px black;
  width: 90%;
  min-height: 30px;
  line-height: 30px;
  padding: 5px;
}
.configItem:last-child {
  border-bottom: none;
}
</style>