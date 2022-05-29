/*
 * @Author: Cxy
 * @Date: 2021-05-07 13:38:55
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-26 15:40:20
 * @FilePath: \blog\blogweb\src\store\modules\admin\index.js
 */
import Vue from 'vue'
import { Login_Device_Code } from '@/until'
import massageRing from 'assets/ringTone/13203.wav'
const state = {
  Lander_Data: {},
  aud: null,
  audIconHD: Login_Device_Code(true)
}

const getters = {
  init_Aud: state => {
    const aud = new Audio()
    aud.muted = !state.audIconHD
    aud.src = massageRing
    state.aud = aud
  },
  mute_Aud: (state) => () => {
    if (state.aud.muted) {
      state.aud.muted = false
    } else {
      state.aud.muted = true
    }
    state.audIconHD = !state.aud.muted
  }
}

const mutations = {
  pass_User_Data(state, payload) {
    state.Lander_Data = payload
    getters.init_Aud(state)
  }
}

const actions = {
  // 登陆时判断登录状态
  get_Login_Admin({ commit }, payload) {
    return new Promise((resolve) => {
      // 普通及以上账号登录后，初始化socket
      Vue.SK.init()
      Vue.SK.connect()
      Vue.SK.emit('Get_Login_Users', { ...payload, login_Device: Login_Device_Code() })
      Vue.SK.socket.on('Login_Users', data => {
        if (data.data) commit('pass_User_Data', data.data)
        resolve(data)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
