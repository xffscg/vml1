import Vue from 'vue'
import Router from 'vue-router'
import CloudHome from '@/components/page/CloudHome'
import loginPage from '@/components/page/loginPage'

import dataSource from '@/components/dataSource'
import dataAnalysisView from '@/components/dataAnalysisView'
import dataExplorationView from '@/components/dataExplorationView'
import dataFlowView from '@/components/dataFlowView'
import modelView from '@/components/modelView'
import predictionView from '@/components/predictionView'

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
    children: [
      {
        path: '/dataSource',
        name: 'dataSource',
        component: dataSource
      },
      {
        path: '/dataAnalysisView',
        name: 'dataAnalysisView',
        component: dataAnalysisView
      },
      {
        path: '/dataExplorationView',
        name: 'dataExplorationView',
        component: dataExplorationView
      },
      {
        path: '/dataFlowView',
        name: 'dataFlowView',
        component: dataFlowView
      },
      {
        path: '/modelView',
        name: 'modelView',
        component: modelView
      },
      {
        path: '/predictionView',
        name: 'predictionView',
        component: predictionView
      }
    ]
  }
  ]
})
