<template>
  <div class="cloud-home">
    <div class="layout-header">
      <CloudHeader></CloudHeader>
    </div>
    <div class="layout-container">
      <div class="layout-left">
        <CloudSideBar></CloudSideBar>
      </div>
      <div class="layout-right">
        <CloudContainer>
          <!-- <router-view></router-view> -->
        </CloudContainer>
      </div>
    </div>
  </div>
</template>

<script>
import CloudHeader from '../common/CloudHeader'
import CloudSideBar from '../common/CloudSideBar'
import CloudContainer from '../common/CloudContainer'
export default {
  name: 'CloudHome',
  data () {
    return {}
  },
  components: {
    CloudHeader,
    CloudSideBar,
    CloudContainer
  }
};
</script>

<style lang='scss'>
.cloud-home {
  width: 100%;
  height : 100%;
  display: flex;
  flex-direction: column;
  .layout-header {
    height: 50px;
    width :100%;
    position :fixed;
    z-index : 1;
  }
  .layout-container {
    margin-top: 50px;
    flex: 1;
    display: flex;
    .layout-left {
      width: 6%;
      height : 100%;
      position : fixed;
      z-index : 1;
    }
    .layout-right {
      position: relative;
      flex: 1;
      margin-left : 6%;
    }
  }
}
</style>
