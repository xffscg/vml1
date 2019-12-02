<template>
  <div class="cloud-header">
    <div class="collapse-btn">
      <i class="iconfont narrow-icon icon-tongji"></i>
    </div>
    <div class="logo">可视化机器学习平台</div>
    <div class="header-right">
      <!-- 全屏显示 -->
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
          <i class="iconfont icon-quanping"></i>
        </el-tooltip>
      </div>
      <!-- 用户头像 -->
      <!-- <div class="user-avator"><img src="static/img/img.jpg"></div> -->
      <!-- 用户名下拉菜单 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="usercenter">用户中心</el-dropdown-item>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fullscreen: false,
      username: 'admin'
    }
  },
  methods: {
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    handleCommand (command) {
      if (command === 'loginout') {
        // localStorage.removeItem("ms_username");
        this.$router.push("/");
        Message.warning('退出登录')
      }
      if (command === 'usercenter') {
        alert('用户中心')
      }
    }
  }
};
</script>

<style>
.cloud-header {
  width: 100%;
  height: 50px;
  background: #373d41;
}
.collapse-btn {
  float: left;
  padding: 7px 21px;
  cursor: pointer;
  color: white;
}
.logo {
  color: white;
  font-size: 23px;
  font-family: sans-serif;
  padding-top: 7.5px;
  float: left;
}
.header-right {
  float: right;
  padding-right: 30px;
}
.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  padding: 7px;
  float: left;
}
.icon-quanping {
  color: white;
  font-size: 18px;
}
.icon-tongji {
  font-size: 28px;
}
.user-avator {
  float: left;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding-top: 5px;
}
.user-name {
  margin-left: 15px;
  margin-top: 10px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
