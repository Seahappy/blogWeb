/*
 * @Author: Cxy
 * @Date: 2021-04-28 19:34:13
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-26 16:56:34
 * @FilePath: \blog\blogweb\src\socket\index.js
 */

import Vuex from '../store'
import io from 'socket.io-client'
import { Login_Device_Code } from '@/until'

class SocketIO {
  serviceIP = '/'
  socket = null
  init() {
    this.socket = io(this.serviceIP, {
      path: '/SeaHappy-Blog', // 路径与后端协商一致即可通信
      transports: ['websocket'],
      autoConnect: false, // 是否自动连接
      auth: {
        token: Vuex.state.login.Users.token
      }
    })
    this.socket.on('connect', () => {
      this.socket.on('checkToken', massage => {
        Vuex.getters['login/session_Clear_User'](massage)
      })
      this.socket.on('Ago_Login_Users', massage => {
        Vuex.getters['login/session_Clear_User'](massage)
      })
    })
    // 报错重连
    this.socket.on('connect_error', err => {
      this.connect()
      throw err
    })
  }
  // 发送广播
  emit(path, data) {
    this.socket.emit(path, data)
  }
  // 手动连接
  connect() {
    this.socket.connect() // 同open()
  }
  // 手动关闭
  disconnect() {
    this.socket.disconnect() // 同close()
    this.socket = null // 重置socket防止重复推送消息
  }
}

const socket = new SocketIO()
// 刷新页面重置socket并发送当前登陆人信息
if (Vuex.state.login.Users.admin_Code !== '') {
  socket.init()
  socket.connect()
  Vuex.dispatch('login/get_Router_Data', Vuex.state.login.Users.admin_Code)
  // 发送当前登陆人信息以重置登陆人socketID
  socket.socket.emit('Refresh_Get_User', { admin_Code: Vuex.state.login.Users.admin_Code, Login_Device: Login_Device_Code() })
  // 接收在线人数信息
  socket.socket.on('Login_Users', data => {
    if (data.data) Vuex.commit('admin/pass_User_Data', data.data)
    if (data.Users_Chat_Content) Vuex.commit('admin/pass_Users_Chat_Content', data.Users_Chat_Content)
  })
}
export default socket
