<template>
  <div>
    <el-dialog :title="title" :visible.sync="visibleCopy" width="60%" @close="doClose" :modal-append-to-body="false">
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
        <div v-if="active =='1' && markValue == '0'" style="margin: 20px 60px 0px;">
          <span class="choseStyle">{{field}}过滤数据</span>
          <el-button size="mini" type="primary" plain class="el-icon-plus" style="float:right" @click="addMark"></el-button>
          <div class="choseString">
            <div class="choseContent">
              <el-table :data="dataProcessTable" height="250" border>
                <el-table-column prop="name" label="字段名">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataProcessTable[scope.$index].dataField" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataFieldList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="操作规则">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataProcessTable[scope.$index].dataRule" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataRuleList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="值">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataProcessTable[scope.$index].dataValue" style="width:100%" placeholder="请输入数字～"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="关系">
                  <template slot-scope="scope">
                    <el-select :disabled="dataProcessTable[scope.$index].disabled" size="small" v-model="dataProcessTable[scope.$index].dataSymbol" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataSymbolList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-if="active =='1' && markValue == '1'" style="margin: 20px 60px 0px;">
          <span class="choseStyle">{{field}}填充空值</span>
          <el-button size="mini" type="primary" plain class="el-icon-plus" style="float:right" @click="addKong"></el-button>
          <div class="choseString">
            <div class="choseContent">
              <el-table :data="dataKongTable" height="250" style="width:600px" border>
                <el-table-column prop="name" label="字段名">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataKongTable[scope.$index].dataField" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataKongFieldList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="填充空值方式">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataKongTable[scope.$index].dataRule" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataKongRuleList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-if="active =='1' && markValue == '2'" style="margin: 20px 60px 0px;">
          <!-- <span class="choseStyle">{{field}}拆分数据列</span> -->
          <el-form label-position="right" label-width="100px" v-model="dataDevideTable">
            <el-form-item label="待拆分字段">
              <el-select size="small" v-model="dataDevideTable.dataField" style="width:50%" filterable placeholder="请选择">
                <el-option v-for="item in dataDevideFieldList" :key="item.id" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分隔符">
              <el-input v-model="dataDevideTable.delimiter"></el-input>
            </el-form-item>
            <!-- <el-form-item label="新增列数">
              <el-input v-model="dataDevideTable.newColumnNum"></el-input>
            </el-form-item> -->
            <el-form-item v-for="(item, index) in dataDevideTable.newColumnNames" :label="'新列名' + index" :key="item.key" :prop="'newColumnNames.' + index + '.value'">
              <el-input v-model="item.value"></el-input>
              <el-button @click.prevent="removeItem(item)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click.prevent="addItem()">新增列名</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button size="mini" type="primary" plain class="el-icon-plus" style="float:right" @click="addDevide"></el-button>
          <div class="choseString">
            <div class="choseContent">
              <el-table :data="dataDevideTable" height="250" style="width:600px" border>
                <el-table-column prop="name" label="字段名">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataDevideTable[scope.$index].dataField" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataDevideFieldList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="分隔符">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataDevideTable[scope.$index].delimiter" style="width:100%" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="新列名称">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataDevideTable[scope.$index].dataName" style="width:100%" placeholder="请输入新列名并用“,”隔开"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div> -->
        </div>
        <div v-if="active =='1' && markValue == '3'" style="margin: 20px 60px 0px;">
          <!-- <span class="choseStyle">{{field}}合并数据列</span> -->
          <el-form label-position="right" label-width="100px" v-model="dataMixTable">
            <el-form-item label="待合并字段">
              <el-checkbox-group v-model="dataMixTable.chosenColumns">
                <el-checkbox v-for="item in dataMixFieldList" :label="item.value" :key="item.value">{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="连接符">
              <el-input v-model="dataMixTable.connector"></el-input>
            </el-form-item>
            <el-form-item label="新列名">
              <el-input v-model="dataMixTable.newMixColumnName"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active =='1' && markValue == '4'" style="margin: 20px 60px 0px;">
          <!-- <span class="choseStyle">{{field}}排序</span> -->
          <el-form label-position="right" label-width="100px" v-model="dataSortTable">
            <el-form-item label="参考数据列">
              <el-select size="small" v-model="dataSortTable.dataField" style="width:50%" filterable placeholder="请选择">
                <el-option v-for="item in dataSortFieldList" :key="item.id" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排列顺序">
              <el-radio v-model="dataSortTable.radio" label="1">升序</el-radio>
              <el-radio v-model="dataSortTable.radio" label="2">降序</el-radio>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active =='1' && markValue == '5'" style="margin: 20px 35px 0px;">
          <span class="choseStyle">{{field}}数据列投影</span>
          <el-button size="mini" type="primary" plain class="el-icon-plus" style="float:right" @click="addShadow"></el-button>
          <div class="choseStringShadow">
            <div class="choseContentShadow">
              <el-table :data="dataShadowTable" height="250" style="width:600px" border>
                <el-table-column prop="name" label="字段1">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataShadowTable[scope.$index].dataField1" style="width:100%" filterable placeholder="">
                      <el-option v-for="item in dataShadowFieldList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="运算符1">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataShadowTable[scope.$index].dataRule1" style="width:100%" filterable placeholder="">
                      <el-option v-for="item in dataShadowRuleList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="数值1">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataShadowTable[scope.$index].dataValue1" style="width:100%" placeholder=""></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="运算符">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataShadowTable[scope.$index].dataRuleTop" style="width:100%" filterable placeholder="">
                      <el-option v-for="item in dataShadowRuleList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="字段2">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataShadowTable[scope.$index].dataField2" style="width:100%" filterable placeholder="">
                      <el-option v-for="item in dataShadowFieldList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="运算符2">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataShadowTable[scope.$index].dataRule2" style="width:100%" filterable placeholder="">
                      <el-option v-for="item in dataShadowRuleList" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="数值2">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataShadowTable[scope.$index].dataValue2" style="width:100%" placeholder=""></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="新列名称">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataShadowTable[scope.$index].dataName" style="width:100%" placeholder=""></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-if="active =='1' && markValue == '6'" style="margin: 20px 60px 0px;">
          <span class="choseStyle">{{field}}替换数据列</span>
          <el-button size="mini" type="primary" plain class="el-icon-plus" style="float:right" @click="addReplace"></el-button>
          <div class="choseString">
            <div class="choseContent">
              <el-table :data="dataReplaceTable" height="250" border>
                <el-table-column prop="name" label="字段名">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="dataReplaceTable[scope.$index].dataField" style="width:100%" filterable placeholder="请选择">
                      <el-option v-for="item in dataReplaceList" :key="item.id" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="原值">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataReplaceTable[scope.$index].dataValueOld" style="width:100%" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="替换为">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="dataReplaceTable[scope.$index].dataValueNew" style="width:100%" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="last" v-if="active !='0'">上一步</el-button>
        <el-button size="mini" @click="next" v-if="active !='1'">下一步</el-button>
        <el-button size="mini" type="success" @click="dataProcessJudge()" v-if="active =='1'">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getColumnNames, getColumnNameWithNumberType } from '@/api/dataExploration'
import { filter, fillNullValue, columnMap, columnSplit, columnsMerge, sort, replace } from '@/api/dataProcess'

export default {
  props: ['visible', 'visibleTitle', 'title', 'visibleData', 'listData', 'listDataNumber', 'operate', 'field', 'mainTitle', 'from', 'isReloadCurrentData'],
  data () {
    return {
      visibleCopy: this.visible,
      markValue: 0,
      active: 0,
      // 数据字段选择
      dataFieldList: [],
      dataField: '',
      dataRuleList: [
        {
          id: 0,
          value: '>'
        },
        {
          id: 1,
          value: '<'
        },
        {
          id: 2,
          value: '=='
        },
        {
          id: 3,
          value: '<='
        },
        {
          id: 4,
          value: '>='
        }
      ],
      // 数据符号选择
      dataSymbolList: [
        {
          id: 0,
          value: 'OR'
        },
        {
          id: 1,
          value: 'AND'
        }
      ],
      dataSymbol: '',
      // 数字
      dataValue: '',
      dataProcessTable: [
        {
          id: 0,
          dataField: '',
          dataSymbol: '',
          dataValue: '',
          dataRule: '',
          disabled: true
        }
      ],
      id: 0,
      // 填充空值
      dataKongTable: [
        {
          id: 0,
          dataField: '',
          dataRule: ''
        }
      ],
      dataKongFieldList: [],
      dataKongRuleList: ['均值填充', '最小值填充', '最大值填充', '向前填充', '向后填充'],
      // 数据列投影
      dataShadowTable: [
        {
          id: 0,
          dataField1: '',
          dataRule1: '',
          dataValue1: '',
          dataRuleTop: '',
          dataField2: '',
          dataRule2: '',
          dataValue2: '',
          dataName: ''
        }
      ],
      dataShadowFieldList: [],
      dataShadowRuleList: ['+', '-', '*', '/'],
      dataDevideTable: // 数据列拆分对应的数据
      {
        id: 0,
        dataField: '', // 选中的列名
        delimiter: '', // 分隔符
        // newColumnNum: 1,
        newColumnNames: [
          {
            value: ''
          },
          {
            value: ''
          }
        ]
      },
      dataDevideFieldList: [],
      // 以下为数据列合并
      dataMixTable:
      {
        id: 0,
        chosenColumns: [],
        connector: '',
        newMixColumnName: ''
      },
      dataMixFieldList: [],
      // 以下为排序
      dataSortTable:
      {
        id: 0,
        dataField: '',
        radio: '1'
      },
      dataSortFieldList: [],
      // 以下为替换
      dataReplaceTable: [
        {
          id: 0,
          dataField: '',
          dataValueOld: '',
          dataValueNew: ''
        }
      ]
      // from: this.from
    }
  },
  // created () {
  //   this.getColumnNames()
  // },
  mounted () {
    this.getColumnNames()
  },
  watch: {
    visible (val) {
      this.visibleCopy = val
      this.active = 0
      this.markValue = 0
      this.getColumnNames()
      this.init()
    }
  },
  methods: {
    init () { // 初始化数据
      this.dataSortTable = {
        id: 0,
        dataField: '',
        radio: '1'
      }
      this.dataProcessTable = [
        {
          id: 0,
          dataField: '',
          dataSymbol: '',
          dataValue: '',
          dataRule: '',
          disabled: true
        }
      ]
      this.dataKongTable = [
        {
          id: 0,
          dataField: '',
          dataRule: ''
        }
      ]
      this.dataDevideTable = {
        id: 0,
        dataField: '', // 选中的列名
        delimiter: '', // 分隔符
        // newColumnNum: 1,
        newColumnNames: [
          {
            value: ''
          },
          {
            value: ''
          }
        ]
      }
      this.dataMixTable = {
        id: 0,
        chosenColumns: [],
        connector: '',
        newMixColumnName: ''
      }
      this.dataShadowTable = [
        {
          id: 0,
          dataField1: '',
          dataRule1: '',
          dataValue1: '',
          dataRuleTop: '',
          dataField2: '',
          dataRule2: '',
          dataValue2: '',
          dataName: ''
        }
      ]
      this.dataReplaceTable = [
        {
          id: 0,
          dataField: '',
          dataValueOld: '',
          dataValueNew: ''
        }
      ]
    },
    getColumnNames () {
      this.dataFieldList = []
      this.dataKongFieldList = []
      this.dataShadowFieldList = []
      this.dataDevideFieldList = []
      this.dataMixFieldList = []
      this.dataSortFieldList = []
      this.dataReplaceList = []
      getColumnNames({ // 获取全部列名
        params: {
          projectName: this.mainTitle
        }
      }).then(res => res.data)
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            let value = { value: res[i], id: i }
            this.dataFieldList.push(value)
            this.dataKongFieldList.push(value)
            this.dataDevideFieldList.push(value)
            this.dataMixFieldList.push(value)
            this.dataReplaceList.push(value)
            // console.log(this.dataMixFieldList)
          }
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNames接口错误，请重试')
        })
      getColumnNameWithNumberType({ // 获取数值型列名
        params: {
          projectName: this.mainTitle
        }
      })
        .then(res => res.data)
        .then(res => {
          // console.log(res) // 以数组的形式返回列名
          for (var i = 0; i < res.length; i++) {
            let value = { value: res[i], id: i }
            this.dataShadowFieldList.push(value)
            this.dataSortFieldList.push(value)
          }
        })
        .catch(e => {
          Message.error(e.error || 'getColumnNameWithNumberType接口错误，请重试')
        })
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
      this.dataProcessTable = [
        {
          id: 0,
          dataField: '',
          dataSymbol: '',
          dataValue: '',
          dataRule: '',
          disabled: true
        }
      ]
      this.dataKongTable = [
        {
          id: 0,
          dataField: '',
          dataRule: ''
        }
      ]
      this.dataShadowTable = [
        {
          id: 0,
          dataField: '',
          dataRule: '',
          dataName: '',
          dataValue: ''
        }
      ]
    },
    // 过滤
    addMark () {
      this.id = this.id + 1
      var _data = {
        id: parseInt(this.id),
        dataField: '',
        dataSymbol: '',
        dataValue: '',
        disabled: true
      }
      for (var i = 0; i < this.dataProcessTable.length; i++) {
        this.dataProcessTable[i].disabled = false
      }
      this.dataProcessTable.push(_data)
    },
    // 替换
    addReplace () {
      this.id = this.id + 1
      var _data = {
        id: parseInt(this.id),
        dataField: '',
        dataValueOld: '',
        dataValueNew: ''
      }
      this.dataReplaceTable.push(_data)
    },
    // 填充空值
    addKong () {
      this.id = this.id + 1
      var _data = {
        id: parseInt(this.id),
        dataField: '',
        dataRule: ''
      }
      this.dataKongTable.push(_data)
    },
    // 数据列投影
    addShadow () {
      this.id = this.id + 1
      var _data = {
        id: parseInt(this.id),
        dataField: '',
        dataRule: '',
        dataName: '',
        dataValue: ''
      }
      this.dataShadowTable.push(_data)
    },
    removeItem (item) {
      var index = this.dataDevideTable.newColumnNames.indexOf(item)
      if (index !== -1) {
        this.dataDevideTable.newColumnNames.splice(index, 1)
      }
    },
    addItem () {
      this.dataDevideTable.newColumnNames.push({
        value: '',
        key: Date.now()
      })
    },
    doClose () {
      this.$emit('keepData', this.visibleTitle, false)
    },
    dataProcessJudge () {
      // console.log(this.dataProcessTable)
      console.log('点击完成！')
      var params = []
      if (this.dataProcessTable[0].dataField !== '') {
        for (let i = 0; i < this.dataProcessTable.length; i++) {
          if (this.dataProcessTable[i].dataSymbol !== '') {
            params.push({ colName: this.dataProcessTable[i].dataField, operate: this.dataProcessTable[i].dataRule, value: this.dataProcessTable[i].dataValue, relation: this.dataProcessTable[i].dataSymbol })
          } else {
            params.push({ colName: this.dataProcessTable[i].dataField, operate: this.dataProcessTable[i].dataRule, value: this.dataProcessTable[i].dataValue, relation: '' })
          }
        }
        var filterObj = {
          projectName: this.mainTitle,
          parameter: params,
          userId: 1
        }
        filter({ requestStr: JSON.stringify(filterObj) }).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataProcessTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataSymbol: '',
                    dataValue: '',
                    dataRule: '',
                    disabled: true
                  }
                ]
              } else if (+this.from === 1) {
                // this.$router.push({  //注释的内容——从数据对比视图点击数据处理弹窗，处理成功后跳转到数据探索视图展示出来。(以下七个“判断弹窗来自数据对比视图父组件”，均同样的注释处理)
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataProcessTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataSymbol: '',
                    dataValue: '',
                    dataRule: '',
                    disabled: true
                  }
                ]
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('filter接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'filter接口错误，请重试')
        // })
      } else if (this.dataKongTable[0].dataField !== '') {
        for (let i = 0; i < this.dataKongTable.length; i++) {
          params.push({ colName: this.dataKongTable[i].dataField, operate: this.dataKongTable[i].dataRule })
        }
        var fillNullValueObj = {
          projectName: this.mainTitle,
          parameter: params,
          userId: 1
        }
        fillNullValue({ requestStr: JSON.stringify(fillNullValueObj) }).then(res => res.data)
          .then(res => {
            console.log(res)
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataKongTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataRule: ''
                  }
                ]
              } else if (+this.from === 1) {
                // this.$router.push({
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataKongTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataRule: ''
                  }
                ]
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('fillNullValue接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'fillNullValue接口错误，请重试')
        // })
      } else if (this.dataShadowTable[0].dataField1 !== '' && this.dataShadowTable[0].dataName !== '') {
        for (let i = 0; i < this.dataShadowTable.length; i++) {
          params.push({ colName_1: this.dataShadowTable[i].dataField1, operate_1: this.dataShadowTable[i].dataRule1, value_1: this.dataShadowTable[i].dataValue1, operate: this.dataShadowTable[i].dataRuleTop, colName_2: this.dataShadowTable[i].dataField2, operate_2: this.dataShadowTable[i].dataRule2, value_2: this.dataShadowTable[i].dataValue2, newName: this.dataShadowTable[i].dataName })
        }
        var columnMapObj = {
          projectName: this.mainTitle,
          parameter: params,
          userId: 1
        }
        columnMap({ requestStr: JSON.stringify(columnMapObj) }).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataShadowTable = [
                  {
                    id: 0,
                    dataField1: '',
                    dataRule1: '',
                    dataValue1: '',
                    dataRuleTop: '',
                    dataField2: '',
                    dataRule2: '',
                    dataValue2: '',
                    dataName: ''
                  }
                ]
              } else if (+this.from === 1) {
                // this.$router.push({
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataShadowTable = [
                  {
                    id: 0,
                    dataField1: '',
                    dataRule1: '',
                    dataValue1: '',
                    dataRuleTop: '',
                    dataField2: '',
                    dataRule2: '',
                    dataValue2: '',
                    dataName: ''
                  }
                ]
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('columnMap接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'columnMap接口错误，请重试')
        // })
      } else if (this.dataDevideTable.dataField !== '') {
        var tranNewColumnNames = []
        var obj = {}
        for (var i = 0; i < this.dataDevideTable.newColumnNames.length; i++) {
          tranNewColumnNames.push(this.dataDevideTable.newColumnNames[i].value)
        }
        obj.projectName = this.mainTitle
        obj.userId = 1
        obj.columnName = this.dataDevideTable.dataField
        obj.delimiter = this.dataDevideTable.delimiter
        obj.newColumnNames = tranNewColumnNames
        columnSplit({
          requestStr: JSON.stringify(obj)
        }).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataDevideTable = {
                  id: 0,
                  dataField: '',
                  delimiter: '',
                  newColumnNames: [
                    {
                      value: ''
                    },
                    {
                      value: ''
                    }
                  ]
                }
              } else if (+this.from === 1) {
                // this.$router.push({
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataDevideTable = {
                  id: 0,
                  dataField: '',
                  delimiter: '',
                  newColumnNames: [
                    {
                      value: ''
                    },
                    {
                      value: ''
                    }
                  ]
                }
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('columnSplit接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'columnSplit接口错误，请重试')
        // })
      } else if (this.dataMixTable.chosenColumns !== []) {
        if (this.dataMixTable.chosenColumns.length < 2) {
          // 选择少于两个字段合并
        } else {
          var objMix = {}
          objMix.projectName = this.mainTitle
          objMix.userId = 1
          objMix.columnNames = this.dataMixTable.chosenColumns
          objMix.connector = this.dataMixTable.connector
          objMix.newColumnName = this.dataMixTable.newMixColumnName
          console.log(JSON.stringify(objMix))
          columnsMerge({
            requestStr: JSON.stringify(objMix)
          }).then(res => res.data)
            .then(res => {
              console.log(res)
              if (res.state === true) {
                if (+this.from === 2) {
                  this.visibleCopy = false
                  this.$emit('filterData', res.data)
                  this.dataMixTable = {
                    id: 0,
                    chosenColumns: [],
                    connector: '',
                    newMixColumnName: ''
                  }
                } else if (+this.from === 1) {
                  // this.$router.push({
                  //   path: '/dataExplorationView',
                  //   query: {
                  //     mainTitle: this.mainTitle,
                  //     processData: res.data
                  //   }
                  // })
                  this.dataMixTable = {
                    id: 0,
                    chosenColumns: [],
                    connector: '',
                    newMixColumnName: ''
                  }
                  this.visibleCopy = false
                  this.$emit('reloadCurrentData', 1)
                }
              } else if (res.state === false) {
                Message.error('columnsMerge接口，' + res.reason)
              }
            })
          // .catch(e => {
          //   Message.error(e.error || 'columnsMerge接口错误，请重试')
          // })
        }
      }
      if (this.dataSortTable.dataField !== '') {
        var objSort = {}
        objSort.projectName = this.mainTitle
        objSort.userId = 1
        objSort.columnName = this.dataSortTable.dataField
        if (this.dataSortTable.radio === 1) {
          objSort.sortType = '升序'
        } else {
          objSort.sortType = '降序'
        }
        sort({
          requestStr: JSON.stringify(objSort)
        }).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataSortTable = {
                  id: 0,
                  dataField: '',
                  radio: 1
                }
              } else if (+this.from === 1) {
                // this.$router.push({
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataSortTable = {
                  id: 0,
                  dataField: '',
                  radio: 1
                }
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('sort接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'sort接口错误，请重试')
        // })
      } else if (this.dataReplaceTable[0].dataField !== '' && this.dataReplaceTable[0].dataValueOld !== '' && this.dataReplaceTable[0].dataValueNew !== '') {
        var objReplace = {}
        objReplace.projectName = this.mainTitle
        objReplace.userId = 1
        objReplace.columnNames = []
        objReplace.sourceCharacters = []
        objReplace.targetCharacters = []
        for (var j = 0; j < this.dataReplaceTable.length; j++) {
          objReplace.columnNames.push(this.dataReplaceTable[j].dataField)
          objReplace.sourceCharacters.push(this.dataReplaceTable[j].dataValueOld)
          objReplace.targetCharacters.push(this.dataReplaceTable[j].dataValueNew)
        }
        console.log(JSON.stringify(objReplace))
        replace({
          requestStr: JSON.stringify(objReplace)
        })
          .then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.state === true) {
              if (+this.from === 2) {
                this.visibleCopy = false
                this.$emit('filterData', res.data)
                this.dataReplaceTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataValueOld: '',
                    dataValueNew: ''
                  }
                ]
              } else if (+this.from === 1) {
                // this.$router.push({
                //   path: '/dataExplorationView',
                //   query: {
                //     mainTitle: this.mainTitle,
                //     processData: res.data
                //   }
                // })
                this.dataReplaceTable = [
                  {
                    id: 0,
                    dataField: '',
                    dataValueOld: '',
                    dataValueNew: ''
                  }
                ]
                this.visibleCopy = false
                this.$emit('reloadCurrentData', 1)
              }
            } else if (res.state === false) {
              Message.error('replace接口，' + res.reason)
            }
          })
        // .catch(e => {
        //   Message.error(e.error || 'replace接口错误，请重试')
        // })
      }
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
