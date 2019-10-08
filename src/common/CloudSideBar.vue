<template>
  <div class="cloud-sidebar">
    <div class="mian-bar iconfont">
      <div class="addProject">
        <el-button icon="el-icon-check" style="width:90%" type="primary" @click="create(),addProjectVisible = true">新建项目</el-button>
      </div>
      <el-menu @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" unique-opened active-text-color router>
        <template v-for="(item,i) in menuArr">
          <el-submenu :index="i.toString()" :key="i">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.mainTitle }}</span>
            </template>
            <template v-for="(subItem,i) in item.submenuList">
              <el-menu-item :key="i" @click="know(subItem.path,subItem.submenuTitle,item.mainTitle)">
                <i :class="subItem.icon"></i>
                <span>{{subItem.submenuTitle}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <el-dialog title="新建项目" :visible.sync="addProjectVisible" width="30%" :before-close="dialogClose">
      <div>
        <span>项目名称：</span>
        <el-input placeholder="请输入内容" style="width:300px" v-model="projectName">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div style="margin-top:30px">
        <span>数&nbsp;&nbsp;据&nbsp;&nbsp;源：</span>
        <el-select v-model="dataSource" style="width:300px" filterable placeholder="请选择">
          <el-option v-for="item in dataSourceList" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addProjectVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addProject()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, getDataSource, addProject } from '@/api/addProject'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      menuArr: [
      ],
      submenuList: [
        {
          submenuTitle: '数据对比视图',
          icon: 'icon-shujucaiji',
          path: '/dataSource'
        },
        {
          submenuTitle: '数据探索视图',
          icon: 'icon-tansuo',
          path: '/dataExplorationView'
        },
        {
          submenuTitle: '数据流程视图',
          icon: 'icon-liucheng',
          path: '/dataFlowView'
        },
        {
          submenuTitle: '数据分析视图',
          icon: 'icon-dangqian',
          path: '/currentDataView'
        },
        {
          submenuTitle: '模型&效果',
          icon: 'icon-moxing',
          path: '/modelView'
        },
        {
          submenuTitle: '模型预测',
          icon: 'icon-yucemoxing',
          path: '/predictionView'
        }
      ],
      addProjectVisible: false,
      projectName: '',
      dataSource: '',
      dataSourceList: [
      ]
    }
  },
  watch: {

  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    dialogClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    know (index, i, item) {
      this.item = item
      console.log(index, i, item)
      this.$router.push({
        path: index,
        query: {
          id: i,
          mainTitle: item
        }
      })
    },
    create () {
      this.projectName = ''
      this.dataSource = ''
    },
    getProject () {
      this.menuArr = []
      getProject().then(res => res.data)
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            let mainTitle = { mainTitle: res[i].name, submenuList: this.submenuList }
            this.menuArr.push(mainTitle)
          }
        })
        .catch(e => {
          Message.error(e.errors || '接口错误，请重试')
        })
    },
    getDataSource () {
      this.dataSourceList = []
      getDataSource().then(res => res.data)
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            let value = { value: res[i].name, id: res[i].id }
            this.dataSourceList.push(value)
          }
        })
        .catch(e => {
          Message.error(e.errors || '接口错误，请重试')
        })
    },
    addProject () {
      this.menuArr = []
      addProject({ projectName: this.projectName, dataSourceId: this.dataSource, userId: 1 }).then(res => res.data)
        .then(res => {
          console.log(res)
          for (var i = 0; i < res.length; i++) {
            let mainTitle = { mainTitle: res[i].name, submenuList: this.submenuList }
            this.menuArr.push(mainTitle)
          }
          this.addProjectVisible = false
        })
        .catch(e => {
          Message.error(e.errors || '接口错误，请重试')
        })
    }
  },
  mounted () {
    this.getProject()
    this.getDataSource()
  }
}
</script>

<style>
.cloud-sidebar {
  height: 100%;
  width: 100%;
}
.mian-bar {
  float: left;
  height: 100%;
  width: 100%;
  background: #545c64;
}
.el-menu {
  border-right: none;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: #acb2b9;
}
.addProject {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
