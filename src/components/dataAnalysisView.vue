<template>
  <div class="table">
    数据分析视图
    <!-- <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" height="600">
      <el-table-column v-for="col in tableCol" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
// import { currentDataPreview } from '@/api/dataSource'
// import { Message } from 'element-ui'

// export default {
//   data () {
//     return {
//       pathID: this.$route.query.id,
//       mainTitle: this.$route.query.mainTitle,
//       tableCol: [],
//       tableData: [],
//       currentPage: 1,
//       pageSize: 20,
//       total: 0
//     }
//   },
//   mounted () {
//     this.currentDataPreview()
//   },
//   watch: {
//     $route () {
//       this.mainTitle = this.$route.query.mainTitle
//       this.currentDataPreview()
//     }
//   },
//   methods: {
//     currentDataPreview () {
//       this.tableCol = []
//       currentDataPreview({ start: 1, end: 50, projectName: this.mainTitle }).then(res => res.data)
//         .then(res => {
//           console.log(res)
//           this.tableData = res.data
//           this.total = this.tableData.length
//           for (var key in res.data[0]) {
//             this.tableCol.push({ prop: key })
//           }
//           this.tableCol[0].fixed = 'left'
//           console.log(this.tableCol)
//         })
//         .catch(e => {
//           Message.error(e.errors || '接口错误，请重试')
//         })
//     },
//     handleSizeChange (val) {
//       this.pageSize = val
//       console.log(`每页 ${val} 条`)
//     },
//     handleCurrentChange (val) {
//       this.currentPage = val
//       console.log(`当前页: ${val}`)
//     }
//   }
// }
</script>
<style scoped>
/* .table {
  margin: 50px;
}
.block {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
} */
</style>
