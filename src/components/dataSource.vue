<template>
  <div>
    <div class="module-button">
      <el-button icon="el-icon-view" style="width:150px" type="success" @click="dataExplorationVisolable = true">数据探索</el-button>
      <el-button icon="el-icon-setting" style="width:150px" type="primary" @click="dataProcessVisible = true">数据预处理</el-button>
      <el-button icon="el-icon-menu" style="width:150px" type="warning">特征工程</el-button>
      <el-button icon="el-icon-search" style="width:150px" type="primary" plain>数据分析</el-button>
      <el-button icon="el-icon-news" style="width:150px" type="danger">模型</el-button>
    </div>
    <div class="source" v-if="sourceShow" style="width: 50%">
      <div class="title">
        <h2>数据源</h2>
      </div>
      <div class="table">
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" height="600">
          <el-table-column v-for="col in tableCol" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="current">
      <div class="title">
        <h2>当前数据视图</h2>
      </div>
      <div class="table">
        <el-table :data="tableData2.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" style="width: 100%" height="600">
          <el-table-column v-for="col2 in tableCol2" :fixed="col2.fixed" :prop="col2.prop" :label="col2.prop" :key="col2.prop">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="total2">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 数据探索的弹窗 -->
    <Dialog :visible=dataExplorationVisolable :title="'数据探索'" :mainTitle=mainTitle :visibleTitle="'dataExplorationVisolable'" :visibleData=dataExploration :listData=dataExplorationList :listDataNumber=dataExplorationListNumber :from=from :operate="'请选择数据探索操作'" :field="'请选择相应字段'" @keepData="keepData"></Dialog>
    <!-- 数据预处理的弹窗 -->
    <dataProcessDialog :visible=dataProcessVisible :mainTitle=mainTitle :title="'数据预处理'" :visibleTitle="'dataProcessVisible'" :visibleData=dataProcess :listData=dataExplorationList :listDataNumber=dataExplorationListNumber :from=from :isReloadCurrentData=isReloadCurrentData :operate="'请选择数据处理操作'" :field="'请选择相应操作'" @keepData="keepData" @reloadCurrentData="reloadCurrentData"></dataProcessDialog>
  </div>
</template>
<script>
import Dialog from './Dialog'
import dataProcessDialog from './dialog/dataProcessDialog'
import { rawDataPreview, currentDataPreview } from '@/api/dataSource'
import { getColumnNames, getColumnNameWithNumberType } from '@/api/dataExploration'
import { Message } from 'element-ui'
// import echarts from 'echarts'
export default {
  data () {
    return {
      // 控制数据源一侧是否展示
      sourceShow: true,
      // 数据源
      pathID: this.$route.query.id,
      mainTitle: this.$route.query.mainTitle,
      tableCol: [],
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      // 当前数据视图
      tableCol2: [],
      tableData2: [],
      currentPage2: 1,
      pageSize2: 20,
      total2: 0,
      // 弹窗控制
      dataExplorationVisolable: false, // 数据探索的弹窗控制
      dataProcessVisible: false, // 数据处理的弹窗控制
      // dataAnalysisVisible: false,
      // modelVisible: false,
      // 弹窗内待选择数据
      dataExploration: ['全表统计', '频率统计', '相关系数', '散点图'],
      dataProcess: ['过滤', '填充空值', '数据列拆分', '数据列合并', '排序', '数据列投影', '数据列替换'],
      dataAnalysis: ['关联分析', '主成分分析', 'K均值聚类'],
      model: ['随机森林', 'SVM', '逻辑回归'],
      // 传递给子组件数据
      from: 1, // from标志位，1代表从数据对比视图弹出dialog，需要控制路由跳转
      isReloadCurrentData: 0, // 用于本页数据预处理弹窗处理成功之后，重新获取当前数据视图（右侧表格）的标志位
      dataExplorationList: [], // 全部列名
      dataExplorationListNumber: [], // 数值型列名
      dataProcessList: [], // 向数据处理弹窗（子组件）传递数据
      // dataAnalysisList: [],
      // modelList: [],

      currentExp: '', // 当前探索类型
      flag: 0,
      freColName: '',
      deleteFileName: ''
    }
  },
  created () {
    this.rawDataPreview()
    this.currentDataPreview()
    this.getColumnNames()
    this.getColumnNamesNumber()
  },
  mounted () {
    // this.rawDataPreview()
    // this.currentDataPreview()
    // this.getColumnNames()
    // this.getColumnNamesNumber()
  },
  components: {
    Dialog,
    dataProcessDialog
  },
  watch: {
    $route () {
      this.mainTitle = this.$route.query.mainTitle
      this.rawDataPreview()
      this.currentDataPreview()
      this.getColumnNames()
      this.getColumnNamesNumber()
    }
  },
  methods: {
    getColumnNames () {
      getColumnNames({ params: { projectName: this.mainTitle } })
        .then(res => res.data)
        .then(res => {
          // console.log('getColumnNames()返回列名')
          // console.log(res) // 以数组的形式返回列名
          this.dataExplorationList = res
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNames接口1错误，请重试')
        })
    },
    getColumnNamesNumber () {
      getColumnNameWithNumberType({
        params: {
          projectName: this.mainTitle
        }
      })
        .then(res => res.data)
        .then(res => {
          // console.log(res) // 以数组的形式返回列名
          this.dataExplorationListNumber = res
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNameWithNumberType接口错误，请重试')
        })
    },
    rawDataPreview () {
      this.tableCol = []
      rawDataPreview({ start: 1, end: 50, projectName: this.mainTitle }).then(res => res.data)
        .then(res => {
          console.log(res)
          this.tableData = res.data
          this.total = this.tableData.length
          for (var key in res.data[0]) {
            this.tableCol.push({ prop: key })
          }
          this.tableCol[0].fixed = 'left'
          console.log(this.tableCol)
        })
        .catch(e => {
          Message.error(e.errors || 'rawDataPreview接口错误，请重试')
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    },
    currentDataPreview () {
      this.tableCol2 = []
      currentDataPreview({ start: 1, end: 50, projectName: this.mainTitle }).then(res => res.data)
        .then(res => {
          console.log(res)
          this.tableData2 = res.data
          this.total2 = this.tableData2.length
          for (var key in res.data[0]) {
            this.tableCol2.push({ prop: key })
          }
          this.tableCol2[0].fixed = 'left'
          console.log(this.tableCol2)
        })
        .catch(e => {
          Message.error(e.errors || 'currentDataPreview接口错误，请重试')
        })
    },
    handleSizeChange2 (val) {
      this.pageSize2 = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange2 (val) {
      this.currentPage2 = val
      console.log(`当前页: ${val}`)
    },
    // 以下为从dataExploration中复制粘贴
    keepData (type, val) {
      this[type] = val
    },
    reloadCurrentData (val) {
      if (val === 1) {
        console.log('重新加载当前数据视图')
        this.currentDataPreview()
      }
    }
  }
}
</script>
<style scoped>
.table {
  margin: 30px;
}
.block {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.source {
  float: left;
}
.current {
  float: left;
  width: 50%;
}
.module-button {
  text-align: center;
  margin-top: 25px;
  margin-bottom: 25px;
  float: center;
}
.title {
  text-align: center;
}
</style>
