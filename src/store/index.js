/*
 * @Author: Cxy
 * @Date: 2021-02-27 23:02:14
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-18 09:41:05
 * @FilePath: \blog\blogweb\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Vue_Router from '@/router'
import login from './modules/login'
import article from './modules/article'
import admin from './modules/admin'
import mixed from './modules/mixed'
Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    /**
     * @description: 全局跳转详情页
     */
    jump_info_Blog(state, routeData) {
      const { id_Article, currentPageJump } = routeData
      Vue_Router.push({ name: 'infoBlog', query: id_Article ? { id_Article } : { id_Article: routeData }, params: { currentPageJump }})
    }
  },
  modules: {
    login,
    article,
    admin,
    mixed
  }
})
