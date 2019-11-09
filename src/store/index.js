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
	funcType : 1,//sideBar的type 即数据、项目、算法
	proList :[],//项目list
	dataList : [],//数据list
	algList : {},//算法list
	reportList : [{name : "假报告"}],//报告列表
	dragContent : {},//拖过来的内容
	menuType : {},//右键点击的内容
	menuOp : "",//右键点击的操作
	showDetail : 0,//点击右键知道要展示的数据类型
	configType : "",//点击之后配置的类型
	configData : {},//配置的数据
	relationship : [],//图中连线
	start : [],//开始的数据节点
	runResult : [],//运行的结果
	runList : {},
	configOrder : {},
	clearFlag : 0,
	location : {},
}



const store = new Vuex.Store({
	state,  //全局状态
	getters,  //获取数据并渲染
	actions,  //数据的异步操作
	mutations  // 处理数据的唯一途径，
})

export default store