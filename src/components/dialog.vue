<template>
  <div>
    <el-dialog :title="title" :visible.sync="visibleCopy" width="40%" @close="doClose" :modal-append-to-body="false">
      <div class="dialog-message" style="padding:0">
        <el-steps :active="active" finish-status="success" width="80%" simple>
          <el-step title="步骤 1" icon="el-icon-edit"></el-step>
          <el-step title="步骤 2" icon="el-icon-picture"></el-step>
        </el-steps>
        <div v-if="active =='0'" style="margin: 20px 60px 0px;">
          <span class="choseStyle">{{operate}}</span>
          <div class="choseContent">
            <el-radio-group v-model="markValue" v-for="(fun,index) in visibleData" :key="index">
              <el-radio :label="index">{{fun}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="active =='1'" style="margin: 20px 60px 0px;">
          <span class="choseStyle">{{field}}</span>
          <div class="choseString">
            <div class="choseContent">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="dataExplorationValue" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="value in chooseListData" :label="value" :key="value">{{value}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="last" v-if="active !='0'">上一步</el-button>
        <el-button size="mini" @click="next" v-if="active !='1'">下一步</el-button>
        <el-button size="mini" type="success" @click="judge(),dataExplorationVisolable = false" v-if="active =='1'">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fullTableStatistics, frequencyStatistics, correlationCoefficient, scatterPlot } from '@/api/dataExploration'
import { Message } from 'element-ui'

export default {
  props: ['visible', 'visibleTitle', 'title', 'visibleData', 'listData', 'listDataNumber', 'operate', 'field', 'mainTitle', 'from'],
  data () {
    return {
      visibleCopy: this.visible,
      dataExplorationValue: [],
      dataExplorationListValue: 0,
      active: 0,
      checkAll: false,
      isIndeterminate: true,
      chooseListData: this.listData,
      // 数据探索操作的值
      markValue: 0 // 0,1,2,3前两个提供全部字段，后两个提供数值型字段
    }
  },
  created () {
    this.chooseListData = this.listData
  },
  mounted () {
    this.chooseListData = this.listData
  },
  watch: {
    visible (val) {
      this.visibleCopy = val
    },
    markValue (val) {
      if (val === 0 || val === 1) {
        this.chooseListData = this.listData
      } else {
        this.chooseListData = this.listDataNumber
      }
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.dataExplorationValue = val ? this.chooseListData : []
      this.isIndeterminate = false
      console.log(this.dataExplorationValue)
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.chooseListData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.chooseListData.length
    },
    next () {
      if (this.markValue === 0) {
        this.chooseListData = this.listData
      }
      if (this.active < 2) {
        this.active++
      } else {
        this.active = 2
      }
    },
    last () {
      if (this.active > 0) {
        this.active--
      } else {
        this.active = 0
      }
    },
    judge () {
      switch (this.markValue) {
        case 0:
          this.fullTableStatistics()
          break
        case 1:
          this.frequencyStatistics()
          break
        case 2:
          this.correlationCoefficient()
          break
        case 3:
          this.scatterPlot()
          break
        default:
          console.log('步骤1出错')
      }
    },
    fullTableStatistics () { // 数据探索的全表统计视图
      fullTableStatistics({ projectName: this.mainTitle, columnNames: JSON.stringify(this.dataExplorationValue) }).then(res => res.data)
        .then(res => {
          console.log('生成全表统计视图并展示')
          console.log(res)
          if (this.from === 2) { // 从数据探索视图进入dialog
            this.$emit('explorationData', res.data)
            sessionStorage.setItem('temporaryViewName', res.fileName) // 存放当前视图的临时名称，目前来看是冗余功能
            // console.log(sessionStorage.getItem('temporaryViewName'))
            this.visibleCopy = false
            this.dataExplorationValue = []
          } else if (this.from === 1) { // 从数据对比视图进入dialog，点击“完成”需要进行路由跳转，并传递res.data
            this.$router.push({
              path: '/dataExplorationView',
              query: {
                mainTitle: this.mainTitle,
                explorationData: res.data
              }
            })
          } else {
            Message.error('fullTableStatistics跳转错误，请重试')
          }
        })
        .catch(e => {
          Message.error(e.error || 'fullTableStatistics接口错误，请重试')
        })
    },
    frequencyStatistics () {
      // console.log('选择频率统计')
      frequencyStatistics({ projectName: this.mainTitle, columnNames: JSON.stringify(this.dataExplorationValue) }).then(res => res.data)
        .then(res => {
          // console.log('生成频率统计视图并展示')
          console.log(res)
          var temFrequencyTable = []
          var obj = {}
          for (var index in res) {
            obj.columnName = index
            obj.rate = res[index]
            temFrequencyTable.push(obj)
            obj = {}
          }
          // console.log(temFrequencyTable)
          if (this.from === 2) { // 从数据探索视图进入dialog
            this.$emit('frequencyData', temFrequencyTable, this.dataExplorationValue)
            this.visibleCopy = false
            this.dataExplorationValue = []
          } else if (this.from === 1) { // 从数据对比视图进入dialog，点击“完成”需要进行路由跳转，并传递res.data
            this.$router.push({
              path: '/dataExplorationView',
              query: {
                mainTitle: this.mainTitle,
                transFre: {
                  temFrequencyTable: temFrequencyTable,
                  chosenColumns: this.dataExplorationValue
                }
              }
            })
          }
        })
        .catch(e => {
          Message.error(e.error || 'frequencyStatistics接口错误，请重试')
        })
    },
    correlationCoefficient () {
      // console.log('选择相关系数')
      correlationCoefficient({ projectName: this.mainTitle, columnNames: JSON.stringify(this.dataExplorationValue) }).then(res => res.data) // 列名的传送和处理待定
        .then(res => {
          // console.log('生成相关系数视图并展示')
          // console.log(res)
          if (this.from === 2) { // 从数据探索视图进入dialog
            this.$emit('correlationData', res)
            this.visibleCopy = false
            this.dataExplorationValue = []
          } else if (this.from === 1) {
            this.$router.push({
              path: '/dataExplorationView',
              query: {
                mainTitle: this.mainTitle,
                correlationData: res
              }
            })
          }
        })
        .catch(e => {
          Message.error(e.error || 'correlationCoefficient接口错误，请重试')
        })
    },
    scatterPlot () {
      // console.log('选择散点')
      scatterPlot({ projectName: this.mainTitle, columnNames: JSON.stringify(this.dataExplorationValue) }).then(res => res.data)
        .then(res => {
          // console.log('生成散点图并展示')
          // console.log(res)
          if (this.from === 2) { // 从数据探索视图进入dialog
            this.$emit('scatterPlotData', res)
            this.visibleCopy = false
            this.dataExplorationValue = []
          } else if (this.from === 1) {
            this.$router.push({
              path: '/dataExplorationView',
              query: {
                mainTitle: this.mainTitle,
                scatterPlotData: res
              }
            })
          }
        })
        .catch(e => {
          Message.error(e.error || '接口错误，请重试')
        })
    },
    doClose () {
      this.$emit('keepData', this.visibleTitle, false)
    }
  }
}
</script>
<style scoped>
.choseContent {
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: center;
}
.el-radio {
  margin-top: 10px;
}
</style>
