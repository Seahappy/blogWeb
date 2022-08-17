/*
 * @Author: Cxy
 * @Date: 2021-02-27 23:02:14
 * @LastEditors: Cxy
 * @LastEditTime: 2022-08-15 01:25:01
 * @FilePath: \blogGitee\blogWeb\src\store\index.js
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
  state: {
    app_Background_Url: 'background-image: url(/homeBG/backGroundImage' + new Date().getDay() + '.png);'
  },
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
