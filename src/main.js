// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/base.css'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from "echarts"
// element-ui组件
import ElementUI from 'element-ui'
import gojs from 'gojs'
import htmlToPdf from '../static/htmlToPdf.js'


Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(htmlToPdf)
Vue.prototype.go = gojs


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
