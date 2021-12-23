/*
 * @Author: Cxy
 * @Date: 2021-03-04 15:12:05
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-18 21:23:10
 * @FilePath: \blog\blogweb\src\http\index.js
 */

import Axios from 'axios'
import Vuex from '../store'
import router from '../router'

// 添加请求拦截器
Axios.interceptors.request.use(config => {
  if (config.url === '/api/articleImgUp') {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  const token = Vuex.state.login.Users.token
  // 对每个请求做token验证
  token && (config.headers.common['Authorization'] = token)
  // config.headers['x-real-ip'] = 'jjjjjjjjj'
  // 在发送请求之前做些什么
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
Axios.interceptors.response.use(response => {
  // 与路由跳转token验证重复 提示 因为它可以接到路由跳转响应失效信息
  // 响应数据 token失效 则跳转登录页 删除登录信息
  if (response.config.url !== '/api/checkToken') {
    const { code } = response.data
    if (code === 1) {
      Vuex.getters['login/session_Clear_User']()
    }
  }
  const { remainingTime, massage } = response.data
  if (remainingTime) {
    router.push({ name: 'NoFound', query: { remainingTime, massage }})
  }
  // 对响应数据做点什么
  return response
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default Axios
