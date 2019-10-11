/**
 * for vuex
 * @authors Your Name (you@example.org)
 * @date    2019-10-09 20:15:50
 * @version $Id$
 */


import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './action'
import * as getters from './getter'
import * as mutations from './mutation'



// import alg from '@/static/algL.json'


Vue.use(Vuex)

const state = {
	funcType : 1,
	proList :[],
	algList : {}
}



const store = new Vuex.Store({
	state,  //全局状态
	getters,  //获取数据并渲染
	actions,  //数据的异步操作
	mutations  // 处理数据的唯一途径，
})

export default store