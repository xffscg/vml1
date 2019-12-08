import Vue from 'vue'
import Router from 'vue-router'
import CloudHome from '@/components/page/CloudHome'
import loginPage from '@/components/page/loginPage'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name : 'loginPage',
      component: loginPage
    },{
    path: '/CloudHome',
    name: 'CloudHome',
    component: CloudHome,
  }
  ]
})
