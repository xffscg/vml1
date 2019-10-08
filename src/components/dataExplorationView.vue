<template>
  <div class="cloud-sidebar">
    <div class="mian iconfont" v-if="menuList.length != 0">
      <el-menu unique-opened router>
        <template v-for="item in menuList">
          <el-submenu :index="item.main_memu_id" :key="item.main_memu_id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.menuTitle }}</span>
            </template>
            <div class="allViews" v-if="item.subList.length > 0">
              <template v-for="(subItem,i) in item.subList">
                <el-menu-item :key="i" @click="getViewByName(subItem.subItemTitle,item.viewsName)">
                  <i :class="subItem.icon"></i>
                  <span>{{subItem.subItemTitle}}</span>
                </el-menu-item>
              </template>
            </div>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <div class="left">
      <el-button icon="el-icon-view" style="width:150px" type="success" @click="dataExplorationVisolable = true">数据探索</el-button>
      <el-button icon="el-icon-setting" style="width:150px" type="primary" @click="dataProce()">数据预处理</el-button>
      <el-button icon="el-icon-menu" style="width:150px" type="warning" @click="featureProject()">特征工程</el-button>
      <el-button icon="el-icon-search" style="width:150px" type="primary" plain>数据分析</el-button>
      <el-button icon="el-icon-news" style="width:150px" type="danger">模型</el-button>
    </div>
    <div class="table" v-if="explorationDatas.length > 0">
      <div v-if='flag == 1' class="opeButton">
        <el-button type="success" size="mini" icon="el-icon-check" circle @click="saveTableStaView = true"></el-button>
        <span>保存</span>
        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteTableStaView = true"></el-button>
        <span>删除</span>
      </div>
      <div class="viewTable">
        <el-table border :data="explorationDatas.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" height="600">
          <el-table-column v-for="col in explorationTableCol" :fixed="col.fixed" :prop="col.prop" :label="col.prop" :key="col.prop">
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="frequency" v-if="frequencyDatas.length >0">
      <el-button type="success" size="mini" icon="el-icon-check" circle @click="saveFreStaView = true"></el-button>
      <span>保存</span>
      <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteFreStaView = true"></el-button>
      <span>删除</span>
      <div class='frequencyView'>
        <el-table border :data="frequencyDatas">
          <el-table-column prop="columnName" v-bind:label="freColName+'取值'">
          </el-table-column>
          <el-table-column prop="rate" label="频率">
          </el-table-column>
        </el-table>
        <div id="freChart" style="width:600px; height:300px; float:left; margin-top:15px;"></div>
      </div>
    </div>
    <!-- <div id="freChart"></div> -->
    <div class="correlationCoefficient" v-if="correlationDatas.length >0">
      <el-button type="success" size="mini" icon="el-icon-check" circle @click="saveCorreView = true"></el-button>
      <span>保存</span>
      <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteCorreView = true"></el-button>
      <span>删除</span>
      <div id="corrChart" style="width:900px; height:600px; margin-top:15px"></div>
    </div>
    <!-- <div id="corrChart"></div> -->
    <div class="scatterPlot" v-if="scatterPlotDatas.length >0">
      <el-button type="success" size="mini" icon="el-icon-check" circle @click="savePlotView  = true"></el-button>
      <span>保存</span>
      <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deletePlotView  = true"></el-button>
      <span>删除</span>
      <div id="scatterPlotChart" style="width:750px; height:450px; margin-top:15px"></div>
    </div>
    <!-- <div id="scatterPlotChart"></div> -->
    <el-dialog :title="'保存当前全表统计视图'" :visible=saveTableStaView>
      <span>视图名称：</span>
      <el-input placeholder="请输入内容" style="width:300px" v-model="currentViewName">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="saveTableStaView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveCurrentTableView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'删除当前全表统计视图'" :visible=deleteTableStaView>
      <span>确定要删除当前全表统计视图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteTableStaView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteCurrentTableView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'保存当前频率统计视图'" :visible=saveFreStaView>
      <span>视图名称：</span>
      <el-input placeholder="请输入内容" style="width:300px" v-model="currentViewName">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="saveFreStaView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveCurrentFreView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'删除当前频率统计视图'" :visible=deleteFreStaView>
      <span>确定要删除当前频率统计视图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteFreStaView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteCurrentFreView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'保存当前相关系数视图'" :visible=saveCorreView>
      <span>视图名称：</span>
      <el-input placeholder="请输入内容" style="width:300px" v-model="currentViewName">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="saveCorreView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveCurrentCorreView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'删除当前相关系数视图'" :visible=deleteCorreView>
      <span>确定要删除当前相关系数视图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteCorreView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteCurrentCorreView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'保存当前散点图'" :visible=savePlotView>
      <span>视图名称：</span>
      <el-input placeholder="请输入内容" style="width:300px" v-model="currentViewName">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="savePlotView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveCurrentPlotView()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'删除当前散点图'" :visible=deletePlotView>
      <span>确定要删除当前散点图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deletePlotView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteCurrentPlotView()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数据探索的弹窗 -->
    <Dialog :visible=dataExplorationVisolable :mainTitle=mainTitle :title="'数据探索'" :visibleTitle="'dataExplorationVisolable'" :visibleData=dataExploration :listData=dataExplorationList :listDataNumber=dataExplorationListNumber :from=from :operate="'请选择数据探索操作'" :field="'请选择相应字段'" @keepData="keepData" @explorationData="explorationData" @frequencyData="frequencyData" @correlationData="correlationData" @scatterPlotData="scatterPlotData"></Dialog>
    <!-- 数据处理的弹窗 -->
    <dataProcessDialog :visible=dataProcessVisible :mainTitle=mainTitle :title="'数据预处理'" :visibleTitle="'dataProcessVisible'" :visibleData=dataProcess :listData=dataExplorationList :listDataNumber=dataExplorationListNumber :from=from :operate="'请选择数据处理操作'" :field="'请选择相应操作'" @keepData="keepData" @filterData='filterData'></dataProcessDialog>
    <!-- 特征工程的弹窗 -->
    <featureProjectDialog :visible=featureProVisible :mainTitle=mainTitle :title="'特征工程'" :visibleTitle="'featureProVisible'" :visibleData=featurePro :listData=dataExplorationList :listDataNumber=dataExplorationListNumber :from=from :operate="'请选择特征工程操作'" :field="'请选择相应操作'" @keepData="keepData" @filterFeatureProData='filterFeatureProData'></featureProjectDialog>
  </div>
</template>
<script>
import Dialog from './Dialog'
import dataProcessDialog from './dialog/dataProcessDialog'
import featureProjectDialog from './dialog/featureProjectDialog'
import { getColumnNames, getColumnNameWithNumberType, saveCurrentTableView, deleteCurrentTableView, saveCurrentFreView, saveCurrentCorreView, saveCurrentPlotView, getViewByName, getAllViews } from '@/api/dataExploration'
import { Message } from 'element-ui'
import echarts from 'echarts'

export default {
  data () {
    return {
      pathID: this.$route.query.id,
      mainTitle: this.$route.query.mainTitle,
      menuList: [ // 数据探索视图的二级侧边栏
        {
          menuTitle: '全表统计视图',
          viewsName: 'FullTableStatisticsView',
          main_memu_id: '0',
          subList: [
            // subList中的每一个对象，遍历时为subItem
            {
              // subItemTitle: ''
            }
          ]
        },
        {
          menuTitle: '频率视图',
          viewsName: 'FrequencyStatisticsView',
          main_memu_id: '1',
          subList: [
            {
              // subItemTitle: '视图一'
            }
          ]
        },
        {
          menuTitle: '相关系数视图',
          viewsName: 'CorrelationCoefficientView',
          main_memu_id: '2',
          subList: [
            {
              // subItemTitle: '视图一'
            }
          ]
        },
        {
          menuTitle: '散点图',
          viewsName: 'ScatterPlot',
          main_memu_id: '3',
          subList: [
            {
              // subItemTitle: '视图一'
            }
          ]
        }
      ],
      dataExploration: ['全表统计', '频率统计', '相关系数', '散点图'],
      dataProcess: ['过滤', '填充空值', '数据列拆分', '数据列合并', '排序', '数据列投影', '数据列替换'],
      featurePro: ['分位数离散化', '向量索引转换', '标准化', 'PCA', '字符串转标签', '多项式扩展', '卡方选择', '独热编码'],
      dataAnalysis: ['关联分析', '主成分分析', 'K均值聚类'],
      model: ['随机森林', 'SVM', '逻辑回归'],
      dataExplorationVisolable: false,
      dataProcessVisible: false,
      dataAnalysisVisible: false,
      featureProVisible: false, // 控制特征工程的弹窗
      modelVisible: false,
      dataExplorationList: [], // 全部列名
      dataExplorationListNumber: [], // 数值型列名
      dataProcessList: [],
      dataAnalysisList: [],
      modelList: [],
      // 以下为全表统计表格
      explorationDatas: [],
      // 以下为频率统计表格
      frequencyDatas: [
        // {
        //   columnName: 'Date',
        //   rate: '15'
        // }
      ],
      // 以下为相关系数表格
      correlationDatas: [
      ],
      // 以下为散点图数据
      scatterPlotDatas: [
      ],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      freTotal: 0,
      explorationTableCol: [],
      frequencyTableCol: [],
      saveTableStaView: false, // 保存当前全表统计视图的弹窗
      deleteTableStaView: false, // 删除当前全表统计视图的弹窗
      saveFreStaView: false, // 保存当前频率统计视图的弹窗
      deleteFreStaView: false, // 删除当前频率统计视图的弹窗
      saveCorreView: false, // 保存当前相关系数视图的弹窗
      deleteCorreView: false, // 删除当前相关系数视图的弹窗
      savePlotView: false, // 保存当前散点图的弹窗
      deletePlotView: false, // 删除当前散点图的弹窗
      currentViewName: '', // 当前要保存的视图名字
      deleteCurrentViewName: '', // 当前要删除的视图名字
      currentExp: '', // 当前探索类型
      flag: 0,
      freColName: '',
      deleteFileName: '',
      from: 2 // from标志位为2，代表数据探索视图内部打开dialog，不需要转路由
    }
  },
  components: {
    Dialog,
    dataProcessDialog,
    featureProjectDialog
  },
  mounted () {
    this.getColumnNames()
    this.getColumnNamesNumber()
    this.checkRouteData()
    this.getAllViews()
  },
  watch: {
    $route () {
      this.mainTitle = this.$route.query.mainTitle
      this.getColumnNames()
      this.getColumnNamesNumber()
      this.checkRouteData()
      this.getAllViews()
    }
  },
  methods: {
    dataProce () { // 调用数据预处理的弹窗
      this.flag = 0
      this.dataProcessVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    dataExp () {
      this.dataExplorationVisolable = true
      this.flag = 1
    },
    keepData (type, val) {
      this[type] = val
    },
    checkRouteData () { // 判断是否从数据对比视图跳转过来
      if (this.$route.query.explorationData) {
        this.explorationData(this.$route.query.explorationData)
      } else if (this.$route.query.transFre) {
        this.frequencyData(this.$route.query.transFre.temFrequencyTable, this.$route.query.transFre.chosenColumns)
      } else if (this.$route.query.correlationData) {
        this.correlationData(this.$route.query.correlationData)
      } else if (this.$route.query.scatterPlotData) {
        this.scatterPlotData(this.$route.query.scatterPlotData)
      } else if (this.$route.query.processData) {
        console.log(this.$route.query.processData)
        this.filterData(this.$route.query.processData)
      }
    },
    explorationData (val) {
      this.explorationTableCol = []
      this.explorationDatas = val
      this.total = val.length
      for (var key in val[0]) {
        this.explorationTableCol.push({ prop: key })
      }
      this.explorationTableCol[0].fixed = 'left'
    },
    frequencyData (val, val2) {
      // console.log('frequencyData接收子组件传递过来的值')
      // console.log(val2)
      this.freColName = val2[0]
      // console.log(val)
      this.explorationDatas = []
      this.frequencyDatas = []
      this.correlationDatas = []
      this.scatterPlotDatas = []
      this.frequencyDatas = val
      var xName = []
      var yName = []
      for (var i = 0; i < val.length; i++) {
        xName.push(val[i].columnName)
        yName.push(val[i].rate)
      }
      // var temChart = this.$refs.chart
      this.$nextTick(() => {
        var temChart = echarts.init(document.getElementById('freChart'))
        if (temChart) {
          // console.log('temChart不为空')
          var option = {
            title: {
              text: '频率统计视图'
            },
            tooltip: {},
            legend: {
              data: ['频率']
            },
            xAxis: {
              data: xName
            },
            yAxis: {},
            series: [{
              name: '频率',
              type: 'bar',
              data: yName
            }]
          }
          temChart.setOption(option)
        }
      })
      // var temChart = echarts.init(document.getElementById('freChart'))
    },
    correlationData (val) {
      this.explorationDatas = []
      this.frequencyDatas = []
      this.correlationDatas = []
      this.scatterPlotDatas = []
      // console.log(val)
      var xyAxis = []
      var indexX = 0
      var indexY = 0
      var temPlot = []
      var allPlots = []
      Object.keys(val).forEach(function (key1) {
        xyAxis.push(key1)
        Object.keys(val[key1]).forEach(function (key2) {
          temPlot = [indexY, indexX, val[key1][key2]]
          allPlots.push(temPlot)
          indexX++
        })
        indexX = 0
        indexY++
      })
      // console.log(xyAxis)
      // console.log(allPlots)
      this.correlationDatas = xyAxis
      this.$nextTick(() => {
        var temChart = echarts.init(document.getElementById('corrChart'))
        allPlots = allPlots.map(function (item) {
          return [item[1], item[0], item[2] || '-']
        })
        var option = {
          title: {
            text: '相关系数视图'
          },
          tooltip: {
            position: 'top'
          },
          animation: false,
          grid: {
            height: '50%',
            y: '10%'
          },
          xAxis: {
            type: 'category',
            data: xyAxis,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: xyAxis,
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
          },
          series: [{
            name: '相关系数',
            type: 'heatmap',
            data: allPlots,
            label: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }
        temChart.setOption(option)
      })
    },
    scatterPlotData (val) {
      this.explorationDatas = []
      this.frequencyDatas = []
      this.correlationDatas = []
      this.scatterPlotDatas.push('生成散点图')
      // console.log(val)
      this.$nextTick(() => {
        var temChart = echarts.init(document.getElementById('scatterPlotChart'))
        var option = {
          xAxis: {
            name: val.keys[0]
          },
          yAxis: {
            name: val.keys[1]
          },
          series: [{
            symbolSize: 10,
            data: val.values,
            type: 'scatter'
          }]
        }
        temChart.setOption(option)
      })
    },
    filterData (val) {
      this.explorationTableCol = []
      this.explorationDatas = val
      this.total = val.length
      for (var key in val[0]) {
        this.explorationTableCol.push({ prop: key })
      }
      this.explorationTableCol[0].fixed = 'left'
    },
    filterFeatureProData (val) { // 特征工程数据返回展示
      this.explorationTableCol = []
      this.explorationDatas = val
      this.total = val.length
      for (var key in val[0]) {
        this.explorationTableCol.push({ prop: key })
      }
      this.explorationTableCol[0].fixed = 'left'
    },
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
    saveCurrentTableView () {
      saveCurrentTableView({
        viewsName: 'FullTableStatisticsView',
        projectName: this.mainTitle,
        newFileName: this.currentViewName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.length; i++) {
            obj.subItemTitle = res[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[0].subList = temSubList
          console.log(this.menuList[0].subList)
          this.saveTableStaView = false
        })
        .catch(e => {
          Message.error(e.error || 'saveCurrentTableView接口错误，请重试')
        })
    },
    deleteCurrentTableView () {
      console.log('删除全表统计视图')
      this.deleteFileName = sessionStorage.getItem('temporaryViewName')
      deleteCurrentTableView({
        viewsName: 'FullTableStatisticsView',
        projectName: this.mainTitle,
        fileName: this.deleteFileName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.length; i++) {
            obj.subItemTitle = res[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[0].subList = temSubList
          console.log(this.menuList[0].subList)
        })
        .catch(e => {
          Message.error(e.error || 'deleteCurrentTableView接口错误，请重试')
        })
    },
    saveCurrentFreView () {
      // console.log('保存当前频率统计视图')
      saveCurrentFreView({
        viewsName: 'FrequencyStatisticsView',
        projectName: this.mainTitle,
        newFileName: this.currentViewName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.length; i++) {
            obj.subItemTitle = res[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[1].subList = temSubList
          console.log(this.menuList[1].subList)
          this.saveFreStaView = false
        })
        .catch(e => {
          Message.error(e.error || 'saveCurrentFreView接口错误，请重试')
        })
    },
    deleteCurrentFreView () {
      console.log('删除频率统计视图')
      this.deleteFileName = sessionStorage.getItem('temporaryViewName')
      deleteCurrentTableView({
        viewsName: 'FrequencyStatisticsView',
        projectName: this.mainTitle,
        fileName: this.deleteFileName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
        })
        .catch(e => {
          Message.error(e.error || 'deleteCurrentTableView接口错误，请重试')
        })
    },
    saveCurrentCorreView () {
      // console.log('保存当前相关系数视图')
      saveCurrentCorreView({
        viewsName: 'CorrelationCoefficientView',
        projectName: this.mainTitle,
        newFileName: this.currentViewName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.length; i++) {
            obj.subItemTitle = res[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[2].subList = temSubList
          console.log(this.menuList[2].subList)
          this.saveCorreView = false
        })
        .catch(e => {
          Message.error(e.error || 'saveCurrentCorreView接口错误，请重试')
        })
    },
    deleteCurrentCorreView () {
      console.log('删除相关系数视图')
    },
    saveCurrentPlotView () {
      // console.log('保存当前散点图')
      saveCurrentPlotView({
        viewsName: 'ScatterPlot',
        projectName: this.mainTitle,
        newFileName: this.currentViewName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res) // 已保存视图的列表
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.length; i++) {
            obj.subItemTitle = res[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[3].subList = temSubList
          console.log(this.menuList[3].subList)
          this.savePlotView = false
        })
        .catch(e => {
          Message.error(e.error || 'saveCurrentPlotView接口错误，请重试')
        })
    },
    deleteCurrentPlotView () {
      console.log('删除散点图')
    },
    getViewByName (chooseFileName, viewsName) {
      this.flag = 1
      this.explorationTableCol = []
      // 选择要查看的视图
      this.currentViewName = chooseFileName // 当前查看的视图名称
      sessionStorage.setItem('temporaryViewName', chooseFileName) // 即当前要删除的试图名称
      this.currentExp = viewsName // 当前探索
      getViewByName({
        viewsName: viewsName,
        projectName: this.mainTitle,
        viewFileName: chooseFileName
      })
        .then(res => res.data)
        .then(res => {
          console.log(res)
          switch (viewsName) {
            case 'FullTableStatisticsView':
              this.explorationDatas = res
              this.total = res.length
              for (var key in res[0]) {
                this.explorationTableCol.push({ prop: key })
              }
              this.explorationTableCol[0].fixed = 'left'
              console.log(this.explorationDatas)
              break
            case 'FrequencyStatisticsView':
              break
            case 'CorrelationCoefficientView':
              break
            case 'ScatterPlot':
              break
            default:
              console.log('viewsName出错！')
          }
        })
        .catch(e => {
          Message.error(e.error || '点击查看的接口错误，请重试！')
        })
    },
    getAllViews () {
      getAllViews({ projectName: this.mainTitle })
        .then(res => res.data)
        .then(res => {
          console.log(res)
          var obj = {}
          var temSubList = []
          for (var i = 0; i < res.FullTableStatisticsView.length; i++) {
            // 侧边栏的已保存全表统计视图
            obj.subItemTitle = res.FullTableStatisticsView[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[0].subList = temSubList
          temSubList = []
          for (i = 0; i < res.FrequencyStatisticsView.length; i++) {
            // 侧边栏的已保存频率统计视图
            obj.subItemTitle = res.FrequencyStatisticsView[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[1].subList = temSubList
          temSubList = []
          for (i = 0; i < res.CorrelationCoefficientView.length; i++) {
            // 侧边栏的已保存相关系数视图
            obj.subItemTitle = res.CorrelationCoefficientView[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[2].subList = temSubList
          temSubList = []
          for (i = 0; i < res.ScatterPlot.length; i++) {
            // 侧边栏的已保存散点图
            obj.subItemTitle = res.ScatterPlot[i]
            temSubList.push(obj)
            obj = {}
          }
          this.menuList[3].subList = temSubList
          temSubList = []
        })
        .catch(e => {
          Message.error(e.error || 'getAllViews接口错误，请重试')
        })
    },
    featureProject () {
      // 特征工程
      this.flag = 1
      this.featureProVisible = true
    }
  }
}
</script>
<style scoped>
.cloud-sidebar {
  height: 100%;
}
.mian {
  float: left;
  height: 100%;
  width: 17%;
  background: #ccd3da;
  position: absolute;
}
.el-menu {
  border-right: none;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: #ccd3da !important;
}
.left {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  margin-left: 17%;
}
.content {
  padding-right: 20px;
}
.addProject {
  margin-right: 20px;
}
.table {
  margin-left: 17%;
  padding: 25px;
}
.block {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.viewTable {
  margin-top: 10px;
}
.opeButton {
  margin-top: 10px;
  margin-left: 15px;
}
.frequency {
  margin-left: 17%;
  margin-right: 51%;
  padding: 25px;
}
.frequencyView {
  margin-top: 15px;
  float: left;
}
.correlationCoefficient {
  margin-left: 17%;
  padding: 25px;
}
.scatterPlot {
  margin-left: 17%;
  padding: 25px;
}
</style>
