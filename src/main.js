/*
 * @Author: Cxy
 * @Date: 2021-02-27 23:02:14
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-20 15:56:40
 * @FilePath: \blog\blogweb\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* 重置全局样式 */
import 'assets/css/reset.css'

/* 引入全局图标字体 */
import 'assets/fonts/css/font-awesome.min.css'

/* axios 注册全局 */
/* 引入axios并改名因为用export default 导出的 */
import * as axios from './http'
/* Vue 实例上也挂在一个Axios 以供封装请求插件使用 base.js 用到 */
Vue.prototype.Axios = Vue.Axios = axios

/* lunar 日历插件挂载 */
import Lunar from 'lunar-javascript'
Vue.prototype.Calendar = Lunar

// /* markDown 全局引用注册 */
// import mavonEditor from 'mavon-editor'
// /* 编辑器样式 */
// import 'mavon-editor/dist/css/index.css'
// /* 文章样式 */
// import 'mavon-editor/dist/markdown/github-markdown.min.css'
// import 'assets/css/vs2015.min.css'

// Vue.use(mavonEditor)

/* 天气图标 */
import 'qweather-icons/font/qweather-icons.css'

/* UI组件整体全局注册 */
import SHUI from 'components/subgroups'
Vue.use(SHUI)

Vue.config.productionTip = false

// /* socketIO 实例挂载 */
import socket from './socket'
Vue.prototype.SK = Vue.SK = socket

// 注册全局日期方法
Vue.filter('dateFilter', (UTCDateString, APM) => {
  function formatFunc(str) {
    return String(str).padStart(2, '0')
  }
  const dt = new Date(UTCDateString)
  const y = dt.getFullYear()
  const m = formatFunc(dt.getMonth() + 1)
  const d = formatFunc(dt.getDate())
  let hh = dt.getHours()
  const mm = formatFunc(dt.getMinutes())
  const ss = formatFunc(dt.getSeconds())
  if (APM !== 'APM') {
    hh = formatFunc(hh)
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  } else {
    const noon = hh >= 12 ? '下午' : '上午' // 判断是上午还是下午
    hh = hh >= 12 ? hh - 12 : hh // 12小时制
    return `${noon} ${hh}:${mm}`
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// Axios.defaults.baseURL = '/api'  // 配置后接口开头可不写/api默认全加 本项目有两个后端地址固不可添加
