<template>
  <div class="cloud-sidebar">
    <div class="mian-bar iconfont">
      <div class="funcItem" @click="changeType(1)"><span><i class="el-icon-house"></i><br>主页</span></div>
      <div class="funcItem"  @click="changeType(2)"><span><i class="el-icon-document"></i><br>数据源</span></div>
      <div class="funcItem"  @click="changeType(3)"><span><i class="el-icon-folder"></i><br>项目</span></div>
      <div class="funcItem" @click="changeType(4)"><span><i class="el-icon-data-analysis"></i><br>算法</span></div>
      <div class="funcItem"><span><i class="el-icon-magic-stick"></i><br>模型</span></div>
      <div class="funcItem" @click="changeType(6)"><span><i class="el-icon-s-order"></i><br>报告</span></div>
    </div>    
  </div>
</template>

<script>
import { getProject, getDataSource, addProject, goRun } from '@/api/addProject'
import { rawDataPreview, currentDataPreview, getAlgriList } from '@/api/dataSource'
import { Message } from 'element-ui'

export default {
  data () {
    return {
    }
  },
  watch: {

  },
  methods: {
    changeType(n){
      if(n == 3){
        this.getProject();
      }else if(n == 2){
        this.getDataSource();
      }else if(n == 4){
        let alg = this.$store.state.algList;
        console.log(typeof alg)
        if(!alg.length){
          this.getAlgri();
        }
      }
      this.$store.commit('changeType', n);
    },
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
    getProject () {
      getProject().then(res => res.data)
        .then(res => {
          console.log(res);
          this.$store.commit('getPro', res);
        })
        .catch(e => {
          Message.error(e.errors || '接口错误，请重试')
        })
    },
    getAlgri(){
      getAlgriList().then(res => res.data)
      .then(res => {
        console.log(res);
        this.$store.commit('getAlg', res.list);
      })
      .catch(e => {
          Message.error(e.errors || '算法接口错误，请重试')
        })
    },
    getDataSource () {
      this.dataSourceList = []
      getDataSource().then(res => res.data)
        .then(res => {
          console.log(res);
          this.$store.commit('getData', res);
        })
        .catch(e => {
          Message.error(e.errors || '接口错误，请重试')
        })
    },
  },
  mounted () {
    this.getAlgri();
  }
};
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
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: flex-start;  
  padding: 20px 0 10px 0;
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
.funcItem {
  width: 90%;
  height: 80px;
  padding: 5px;
  color: white;
  font-size: 18px;
  /*text-align: center;*/
}
.funcItem:hover {
  background-color: #76766E; 
}
.funcItem:active {
  width: 90%px;
  height: 70px; 
}
</style>
