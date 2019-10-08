<template>
  <div>
    <el-dialog :title="title" :visible.sync="visibleCopy" width="60%" @close="doClose" :modal-append-to-body="false">
      <div class="dialog-message" style="padding:0">
        <el-steps :active="active" finish-status="success" width="80%" simple>
          <el-step title="步骤 1" icon="el-icon-edit"></el-step>
          <el-step title="步骤 2" icon="el-icon-picture"></el-step>
        </el-steps>
        <div v-if="active =='0'" style="margin: 20px 35px 0px;">
          <span class="choseStyle">{{operate}}</span>
          <div class="choseContent">
            <el-radio-group v-model="markValue" v-for="(fun,index) in visibleData" :key="index">
              <el-radio :label="index" style="margin-right:15px">{{fun}}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div v-if="active == '1' && markValue == '0'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}分位数离散化</span> -->
        <el-form label-position="left" label-width="100px" v-model="quantileDiscTable">
          <el-form-item label="操作名称" style="font-weight:bold;">
            {{currentOperationName}}
          </el-form-item>
          <el-form-item label="请选择输入列">
            <el-select v-model="quantileDiscTable.oldColumnName" style="width:350px;" filterable placeholder="请选择">
              <el-option v-for="item in quantileDiscColumns" :key="item.id" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指定分箱数">
            <el-input-number v-model="quantileDiscTable.numBuckets" :min="1" label="默认值为5"></el-input-number>
          </el-form-item>
          <el-form-item label="请输入新列名">
            <el-input placeholder="请输入" style="width:350px" v-model="quantileDiscTable.newColumnName" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active == '1' && markValue == '1'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}向量索引转换</span> -->
        <el-form label-position="left" label-width="100px" v-model="vectorIndexerTable">
          <el-form-item label="操作名称" style="font-weight:bold;">
            {{currentOperationName}}
          </el-form-item>
          <el-form-item label="请选择输入列">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="vectorHandleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="vectorIndexerTable.columnNames" @change="vectorHandleCheckedColumnChange">
              <el-checkbox v-for="item in vectorIndexerColumns" :label="item.value" :key="item.id">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="最大类别数">
            <el-input-number size="small" v-model="vectorIndexerTable.maxCategories" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="请输入新列名">
            <el-input placeholder="请输入" style="width:350px" v-model="vectorIndexerTable.newColumnName" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active == '1' && markValue == '2'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}标准化（归一化）</span> -->

      </div>
      <div v-if="active == '1' && markValue == '3'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}PCA</span> -->
      </div>
      <div v-if="active == '1' && markValue == '4'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}字符串转标签</span> -->
      </div>
      <div v-if="active == '1' && markValue == '5'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}多项式扩展</span> -->
        <el-form label-position="left" label-width="100px" v-model="polynomialExpansionTable">
          <el-form-item label="操作名称" style="font-weight:bold;">
            {{currentOperationName}}
          </el-form-item>
          <el-form-item label="请选择输入列">
            <el-checkbox :indeterminate="isIndeterminatePE" v-model="checkAllPE" @change="handleCheckAllChangePE">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="polynomialExpansionTable.columnNames" @change="handleCheckedColumnChangePE">
              <el-checkbox v-for="item in polynomialExpansionColumns" :label="item.value" :key="item.id">{{item.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="请输入新列名">
            <el-input placeholder="请输入" style="width:350px" v-model="polynomialExpansionTable.newColumnName" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active == '1' && markValue == '6'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}卡方选择</span> -->
      </div>
      <div v-if="active == '1' && markValue == '7'" style="margin: 20px 60px 0px;">
        <!-- <span class="choseStyle">{{field}}独热编码</span> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="last" v-if="active !='0'">上一步</el-button>
        <el-button size="mini" @click="next" v-if="active !='1'">下一步</el-button>
        <el-button size="mini" type="success" @click="featureJudge()" v-if="active =='1'">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getColumnNames, getColumnNameWithNumberType } from '@/api/dataExploration'
import { quantileDiscretization, vectorIndexer, standardScaler, pca, polynomialExpansion, stringIndexer, chiSqSelector, oneHotEncoder } from '@/api/featureProject'
export default {
  props: ['visible', 'visibleTitle', 'title', 'visibleData', 'listData', 'listDataNumber', 'operate', 'field', 'mainTitle', 'from'],
  data () {
    return {
      visibleCopy: this.visible,
      markValue: 0,
      active: 0,
      currentOperationName: '', // 当前特征工程操作名称
      // 以下为分位数离散化绑定的参数
      quantileDiscColumns: [],
      quantileDiscTable: {
        oldColumnName: '',
        numBuckets: 5,
        newColumnName: ''
      },
      // 以下为向量索引转换绑定的参数
      vectorIndexerColumns: [], // 对象数组
      vectorIndexerColumnsString: [], // 字符串数组
      vectorIndexerTable: {
        columnNames: [],
        maxCategories: 1,
        newColumnName: ''
      },
      checkAll: false,
      isIndeterminate: true,
      // 以下为多项式扩展绑定的参数
      polynomialExpansionColumns: [], // 对象数组
      polynomialExpansionColumnsString: [], // 字符串数组
      polynomialExpansionTable: {
        columnNames: [],
        newColumnName: ''
      },
      checkAllPE: false,
      isIndeterminatePE: true
    }
  },
  computed: {
    operation () {
      const { active, markValue } = this
      return {
        active,
        markValue
      }
    }
  },
  watch: {
    operation: {
      handler: function (newVal, oldVal) {
        // console.log(newVal) // newVal的格式为{active: 1, markValue: 0}
        // console.log(oldVal)
        if (newVal.active === 1) {
          switch (newVal.markValue) {
            case 0:
              this.currentOperationName = '分位数离散化'
              break
            case 1:
              this.currentOperationName = '向量索引转换'
              break
            case 2:
              this.currentOperationName = '标准化'
              break
            case 3:
              this.currentOperationName = 'PCA'
              break
            case 4:
              this.currentOperationName = '字符串转标签'
              break
            case 5:
              this.currentOperationName = '多项式扩展'
              break
            case 6:
              this.currentOperationName = '卡方选择'
              break
            case 7:
              this.currentOperationName = '独热编码'
              break
            default:
              Message.error('currentOperationName出错啦！')
          }
        }
      },
      deep: true
    },
    visible (val) {
      this.visibleCopy = val
      this.active = 0
      this.markValue = 0
    }
  },
  created () {
  },
  mounted () {
    this.getColumnNames() // 获取全部列名和数值型列名
  },
  methods: {
    getColumnNames () {
      this.quantileDiscColumns = [] // 分位数离散化绑定数值型列名
      this.vectorIndexerColumns = []
      this.vectorIndexerColumnsString = []
      this.polynomialExpansionColumns = []
      this.polynomialExpansionColumnsString = []
      getColumnNameWithNumberType({ // 获取数值型列名
        params: {
          projectName: this.mainTitle
        }
      })
        .then(res => res.data)
        .then(res => {
          console.log('输出数值型列名')
          console.log(res) // 以数组的形式返回列名
          this.vectorIndexerColumnsString = res
          this.polynomialExpansionColumnsString = res
          for (var i = 0; i < res.length; i++) {
            let value = { value: res[i], id: i }
            this.quantileDiscColumns.push(value)
            this.vectorIndexerColumns.push(value)
            this.polynomialExpansionColumns.push(value)
          }
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNameWithNumberType接口错误，请重试')
        })
      getColumnNames({ // 获取全部列名
        params: {
          projectName: this.mainTitle
        }
      }).then(res => res.data)
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            // let value = { value: res[i], id: i }
            // this.dataFieldList.push(value) // 全部列名列表的push
          }
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNames接口错误，请重试')
        })
    },
    doClose () {
      this.$emit('keepData', this.visibleTitle, false)
    },
    featureJudge () {
      console.log(this.operation)
      if (this.currentOperationName === '分位数离散化') {
        if (this.quantileDiscTable.oldColumnName !== '' && this.quantileDiscTable.newColumnName !== '') {
          var objQuantileDisc = {
            userId: 1,
            projectName: this.mainTitle,
            columnName: this.quantileDiscTable.oldColumnName,
            newColumnName: this.quantileDiscTable.newColumnName,
            numBuckets: this.quantileDiscTable.numBuckets
          }
          quantileDiscretization({
            requestStr: JSON.stringify(objQuantileDisc)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
              if (res.state === true) {
                if (+this.from === 2) {
                  this.visibleCopy = false
                  this.$emit('filterFeatureProData', res.data)
                  this.quantileDiscTable = {
                    oldColumnName: '',
                    numBuckets: 5,
                    newColumnName: ''
                  }
                  this.currentOperationName = '' // 把当前操作名置空
                } else if (+this.from === 1) {
                  // 从数据对比视图打开特征工程dialog
                }
              } else {
                Message.error('出错啦！' + res.reason)
              }
            })
        } else { // 分位数离散化提交时表单验证不通过
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '向量索引转换') {
        if (this.vectorIndexerTable.columnNames.length > 0 && this.vectorIndexerTable.newColumnName !== '') {
          var objVectorIndexer = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: this.vectorIndexerTable.columnNames,
            newColumnName: this.vectorIndexerTable.newColumnName,
            maxCategories: this.vectorIndexerTable.maxCategories
          }
          // console.log(objVectorIndexer)
          vectorIndexer({
            requestStr: JSON.stringify(objVectorIndexer)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
              if (res.state === true) {
                if (+this.from === 2) {
                  this.visibleCopy = false
                  this.$emit('filterFeatureProData', res.data)
                  this.vectorIndexerTable = {
                    columnNames: [],
                    maxCategories: 1,
                    newColumnName: ''
                  }
                  this.checkAll = false
                  this.isIndeterminate = true
                  this.currentOperationName = '' // 把当前操作名置空
                } else if (+this.from === 1) {
                  // 从数据对比视图打开特征工程dialog
                }
              } else {
                Message.error('出错啦！' + res.reason)
              }
            })
        } else { // 向量索引转换提交时表单验证不通过
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '标准化') {
        if (this.currentOperationName === '标准化') { // 判断弹窗中提供的参数是否存在空值，后续绑定数据后再判空
          var objStandardScaler = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: ['数量', '折扣', '利润'], // 选择的多个列
            newColumnName: '利润(标准化)' // 可能与后端协商修改
          }
          standardScaler({
            requestStr: JSON.stringify(objStandardScaler)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
              if (res.state === true) {
                if (+this.from === 2) {
                  this.visibleCopy = false
                  // 向父组件传回数据
                  // 置空相关数据
                } else if (+this.from === 1) {
                  // 从数据对比视图打开特征工程dialog
                }
              } else {
                Message.error('出错啦！' + res.reason)
              }
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === 'PCA') {
        if (this.currentOperationName === 'PCA') {
          var objPCA = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: ['销售额', '数量', '折扣', '利润', '装运成本'], // 待处理的多个列
            newColumnName: '降维结果', // 新的列名
            k: 4 // 将向量投影到前k个主成分的较低维空间
          }
          pca({
            requestStr: JSON.stringify(objPCA)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '字符串转标签') {
        if (this.currentOperationName === '字符串转标签') { // 弹窗填写内容判空
          var objStringIndexer = {
            userId: 1,
            projectName: this.mainTitle,
            columnName: '客户名称', // 选择的范围是全部字段
            newColumnName: '客户名称(标签化，按频率排序，0为频次最高)' // 新的列名
          }
          stringIndexer({
            requestStr: JSON.stringify(objStringIndexer)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '多项式扩展') {
        if (this.polynomialExpansionTable.columnNames.length > 0 && this.polynomialExpansionTable.newColumnName !== '') {
          var objPolynomialExpansion = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: this.polynomialExpansionTable.columnNames,
            newColumnName: this.polynomialExpansionTable.newColumnName
          }
          polynomialExpansion({
            requestStr: JSON.stringify(objPolynomialExpansion)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
              if (res.state === true) {
                if (+this.from === 2) {
                  this.visibleCopy = false
                  this.$emit('filterFeatureProData', res.data)
                  this.polynomialExpansionTable = {
                    columnNames: [],
                    newColumnName: ''
                  }
                  this.checkAllPE = false
                  this.isIndeterminatePE = true
                  this.currentOperationName = '' // 把当前操作名置空
                } else if (+this.form === 1) {
                  // 从数据对比视图打开特征工程dialog
                }
              } else {
                Message.error('出错啦！' + res.reason)
              }
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '卡方选择') {
        if (this.currentOperationName === '卡方选择') { // 弹窗填写内容判空
          var objChiSqSelector = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: ['折扣', '装运成本'], // 数值型字段选择
            columnName_label: '数量',
            newColumnName: '卡方选择', // 新的列名
            numTopFeatures: 1
          }
          chiSqSelector({
            requestStr: JSON.stringify(objChiSqSelector)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      } else if (this.currentOperationName === '独热编码') {
        if (this.currentOperationName === '独热编码') { // 弹窗填写内容判空
          var objOneHotEncoder = {
            userId: 1,
            projectName: this.mainTitle,
            columnNames: ['折扣'],
            newColumnNames: ['独热编码1'] // 新的列名
          }
          oneHotEncoder({
            requestStr: JSON.stringify(objOneHotEncoder)
          })
            .then(res => res.data)
            .then(res => {
              console.log(res)
            })
        } else {
          Message.error('请填写完整后再提交！')
        }
      }
    },
    next () {
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
    // handleChange (value) { // 分位数离散化指定分箱数，绑定的数字选择器
    //   console.log(value)
    // }
    vectorHandleCheckAllChange (val) {
      console.log(val)
      console.log(this.vectorIndexerColumns)
      this.vectorIndexerTable.columnNames = val ? this.vectorIndexerColumnsString : []
      this.isIndeterminate = false
    },
    vectorHandleCheckedColumnChange (value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.vectorIndexerColumns.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.vectorIndexerColumns.length
    },
    // 以下两个函数用于多项式扩展
    handleCheckAllChangePE (val) {
      this.polynomialExpansionTable.columnNames = val ? this.polynomialExpansionColumnsString : []
      this.isIndeterminatePE = false
    },
    handleCheckedColumnChangePE (value) {
      let checkedCount = value.length
      this.checkAllPE = checkedCount === this.polynomialExpansionColumns.length
      this.isIndeterminatePE = checkedCount > 0 && checkedCount < this.polynomialExpansionColumns.length
    }
  }
}
</script>
<style scoped>
.choseContent {
  display: flex;
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;
  width: 680px;
}
.choseContentShadow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 800px;
}
.chooseStringShadow {
  width: 850px;
}
.el-radio {
  margin-top: 10px;
}
</style>
