<template>
  <div class="content-wrapper">
    <section class="content">
      <div class="row">
        <div class="col-xs-12">
          <b>数据流程视图</b>
          <br /><br />
          <div class="box-body">

            <!-- 拖拽组件放置区间 -->
            <div class="col-md-6 drop-wrap">
              <!-- 组件区块 -->
              <common-flow ref="diag" v-bind:model-data="diagramData" v-on:frommodel="getmodel" v-on:model-changed="modelChanged" v-on:changed-selection="changedSelection" style="width:100%; height:580px"></common-flow>
              <!-- 流程控制 -->
              <!-- <div class="toolBar">
                <div @click="success">
                  <i class="fa fa-cog"></i>
                  <p>构建</p>
                </div>
                <el-popover placement="top" width="160" v-model="visible2">
                  <p>是否要清空画布？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                    <el-button type="text" size="mini" @click="clear">确定</el-button>
                  </div>
                  <div style="cursor:pointer;" slot="reference">
                    <i class="glyphicon glyphicon-trash" aria-hidden="true"></i>
                    <p>清空</p>
                  </div>
                </el-popover>
                <div @click="start">
                  <i class="glyphicon glyphicon-play-circle" aria-hidden="true"></i>
                  <p>运行</p>
                </div>
              </div> -->
            </div>

            <!-- 组件区块配置区域 -->
            <!-- <div class="col-md-3">
              <div class="setboard">
                <transition-group name="list">
                  <div class="" v-if="clickblock.type=='data'" :key="5">
                    <div style="margin:5px">
                      <h3 style="font-size:14px;">数据设置栏</h3>
                      <h6>（{{clickblock.text}}）</h6>
                    </div>
                    <hr />
                  </div>

                  <div class="" v-else-if="clickblock.type=='service'" :key="5">
                    <div style="margin:5px">
                      <h3 style="font-size:14px;">模型设置栏</h3>
                      <h6>（{{clickblock.text}}）</h6>
                    </div>
                    <hr />
                  </div>

                  <div class="" v-else-if="clickblock.type=='output'" :key="5">
                    <div style="margin:5px">
                      <h3 style="font-size:14px;">图谱设置栏</h3>
                      <h6>（{{clickblock.text}}）</h6>
                    </div>
                    <hr />
                  </div>

                  <div class="" v-else :key="5">
                    <div style="margin:5px">
                      <h3 style="font-size:14px;">设置栏</h3>
                      <h6>（点击画布中的小组件，会有对应的设置项在这里出现～）</h6>
                    </div>
                  </div>

                </transition-group>
              </div>
            </div> -->

          </div>
        </div>
      </div>
    </section>

    <!-- build弹窗 -->
    <el-dialog title="构建结果" :visible.sync="dialogVisible" width="60%">
      <div style="margin-left:40px;margin-right:40px">
        <json-viewer :value="jsonData" :expand-depth=2 boxed></json-viewer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import go from 'gojs'
import CommonFlow from './CommonFlow.vue'
export default {
  name: 'GraphMaker',
  components: {
    CommonFlow
  },
  data () {
    return {
      diagramData: {
        class: 'go.GraphLinksModel',
        nodeDataArray: [
          {
            type: 'data',
            text: '企业数据',
            color: '#5fe0a6',
            key: 'a'
          },
          {
            type: 'service',
            text: '实体导入',
            color: '#f0bb66',
            key: 'b'
          }
        ],
        linkDataArray: [
          {
            from: 'a',
            to: 'b'
          }
        ]
      },
      selectItems: [], // 所有在拖拽区内的数据、模型、图谱组件

      currentItem: {}, // 根据当前选中内容，控制右侧setting展示内容
      setting: {
        dataAttr: [],
        modelAttr: {}
      },
      clickblock: {},
      dialogVisible: false,
      jsonData: {}
    }
  },
  mounted () {
    // this.fetch();
  },
  computed: {
    currentNodeText: {
      get: function () {
        var node = this.currentNode
        if (node instanceof go.Node) {
          return node.data.text
        } else {
          return ''
        }
      },
      set: function (val) {
        var node = this.currentNode
        if (node instanceof go.Node) {
          var model = this.model()
          model.startTransaction()
          model.setDataProperty(node.data, 'text', val)
          model.commitTransaction('edited text')
        }
      }
    }
  },
  methods: {
    getmodel: function (data) {
      console.log(data)
      this.clickblock = data
    },
    clear: function () {
      // 清空
      this.visible2 = false
      this.diagramData = {
        nodeDataArray: [],
        linkDataArray: []
      }
    },
    success () {
      // 构建
      this.dialogVisible = true
      var model = this.model()
      this.jsonData = JSON.parse(model.toJson())
      console.log(this.jsonData)
    },
    model: function () {
      return this.$refs.diag.model()
    },

    updateDiagramFromData: function () {
      this.$refs.diag.updateDiagramFromData()
    },

    modelChanged: function (e) {
      if (e.isTransactionFinished) {
        this.savedModelText = e.model.toJson()
      }
    },

    changedSelection: function (e) {
      var node = e.diagram.selection.first()
      // console.log(node.data);
      if (node instanceof go.Node) {
        this.currentNode = node
        this.currentNodeText = node.data.text
      } else {
        this.currentNode = null
        this.currentNodeText = ''
      }
    },
    addNode: function (type, text) {
      var color = ''
      if (type === 'data') {
        color = '#5fe0a6'
      } else if (type === 'service') {
        color = '#f0bb66'
      } else if (type === 'graph') {
        color = '#5eace0'
      } else if (type === 'output') {
        color = '#5eace0'
      }
      // var loc = '0 0'
      var model = this.model()
      model.startTransaction()
      model.setDataProperty(model.findNodeDataForKey(4), 'color', 'purple')
      var data = {
        type,
        text,
        color
      }
      model.addNodeData(data)
      model.commitTransaction('added Node and Link')
      var diagram = this.$refs.diag.diagram
      diagram.select(diagram.findNodeForData(data))
    },
    fetch: function () {
    },
    create: function () {
    },
    delSeletedItems: function (index) {
      this.selectItems.splice(index, 1)
    },
    showSetting: function (element) {
      this.currentItem = element
    },
    changeSetting (setting) {
      this.setting = setting
    },
    run ({ taskId, list }) {
    },
    taskFinish ({ taskId, result }) {
    }
  }
}
</script>
<style lang="scss" scoped>
.content-wrapper {
  margin: 20px;
}
/* 拖拽组件侧边栏样式 */
.component-wrap {
  min-height: 680px;
  overflow-y: scroll;
  /* 组件类目以颜色区分 */
  .active {
    transition: all ease 0.3s;
    &.data {
      background-color: #5fe0a6;
      border: 1px solid #47cf90;
    }
    &.model {
      background-color: #f0bb66;
      border: 1px solid #df9e37;
    }
    &.graph {
      background-color: #5eace0;
      border: 1px solid #4284e7;
    }
  }

  .list-group-item {
    margin-bottom: -2px;
    cursor: pointer;
  }

  /* 组件在拖拽时鼠标样式 */
  .list-group {
    margin-bottom: 0;
    .list-group-item {
      cursor: move;
      font-size: 12px;
      text-overflow: ellipsis;
    }
  }
  /* 组件在拖拽时鼠标样式 */
  .pull-right {
    transition: transform ease-in 0.3s;
    &.turn-down {
      transform: rotate(-90deg);
    }
  }
}

.drop-wrap {
  min-height: 680px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  .drop-container {
    min-height: 640px;
  }
  .toolBar {
    position: absolute;
    bottom: 0;
    width: 100%;
    i {
      font-size: 25px;
      cursor: pointer;
    }
    p {
      font-size: 12px;
    }
    div {
      width: 32%;
      display: inline-block;
      text-align: center;
    }
  }
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.3s;
}
.fade-enter, .fade-leave-to
{
  opacity: 0;
  transform: translateY(-42px);
}
.setboard {
  border: 1px solid #d8dee4;
  height: 680px;
  border-radius: 5px;
  padding: 10px;
}
</style>
