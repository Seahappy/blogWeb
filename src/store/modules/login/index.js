/*
 * @Author: Cxy
 * @Date: 2021-05-07 11:38:09
 * @LastEditors: Cxy
 * @LastEditTime: 2022-05-30 19:23:02
 * @FilePath: \blog\blogweb\src\store\modules\login\index.js
 */
import Vue from 'vue'
import { router_Data } from '@/http/model/user.js'
import Vue_Router, { restRouter } from '@/router'

const Users = JSON.parse(sessionStorage.getItem('Users'))
const UsersData = Users || { admin_Code: '', admin_level: '', created_At: '', nick_Name: '', head_Portrait: '', token: '' }
const state = {
  Users: {
    admin_Code: UsersData.admin_Code,
    admin_level: UsersData.admin_level,
    nick_Name: UsersData.nick_Name,
    head_Portrait: UsersData.head_Portrait,
    My_Qq: UsersData.My_Qq,
    My_Wx: UsersData.My_Wx,
    My_Wb: UsersData.My_Wb,
    My_Reward_Wx: UsersData.My_Reward_Wx,
    My_Reward_Zfb: UsersData.My_Reward_Zfb,
    brief_Introduction: UsersData.brief_Introduction,
    created_At: UsersData.created_At,
    token: UsersData.token
  },
  nav_Data: [
    { title: '首页', path: 'Home' },
    { title: '博客', path: 'Blog' },
    { title: '直播', path: 'Live' },
    { title: '时间轴', path: 'TimeLine' },
    { title: '关于', path: 'About' },
    { title: '留言', path: 'Contact' }
  ],
  nav_Data_Rest: [
    { title: '首页', path: 'Home' },
    { title: '博客', path: 'Blog' },
    { title: '直播', path: 'Live' },
    { title: '时间轴', path: 'TimeLine' },
    { title: '关于', path: 'About' },
    { title: '留言', path: 'Contact' }
  ],
  button_Data: []
}

const getters = {
  session_Clear_User: (state) => (massage) => {
    Vue.SK.socket ? Vue.SK.disconnect() : ''
    massage ? Vue.msg_Constructor(massage, 'faild') : ''
    state.Users = { admin_Code: '', created_At: '', token: '' }
    state.nav_Data = state.nav_Data_Rest
    sessionStorage.clear()
    restRouter()
    Vue_Router.push('/Login')
  },
  set_Button_Power: (state) => (buttonCode) => {
    return state.button_Data.some(c => c.path === buttonCode)
  }
}

const mutations = {
  /**
   * @description: 登陆成功后赋值导航栏数据及session storage赋值
   */
  session_Set_User(state, payload) {
    Object.assign(state.Users, payload)
    sessionStorage.setItem('Users', JSON.stringify(Object.assign(state.Users, payload)))
  },
  /**
   * @description: 添加动态路由及NoFound路由添加
   */
  set_Router_Power(state, payload) {
    state.nav_Data = state.nav_Data.concat(payload)
    const routers = arrguments_Router(payload)
    // 每一个路由配置一遍addroute(添加路由)，导致路由分离
    // arrguments_addRoute(routers)
    routers.forEach(c => {
      Vue_Router.addRoute(c)
    })
    Vue_Router.addRoute({
      path: '*',
      redirect: '/NoFound'
    })
  },
  /**
   * @description: 添加动态Button
   */
  storage_Button_Power(state, payload) {
    state.button_Data = payload
  }
}

const actions = {
  /**
   * @description: 获取router权限路由
   */
  get_Router_Data({ commit }, admin_Code) {
    return new Promise((resolve, reject) => {
      router_Data({ admin_Code }).then(res => {
        const { code, routerData, buttonData } = res.data
        if (code === 200) {
          const router_Map_Table = routerData.reduce((prev, cur) => {
            prev[cur['id']] = cur
            return prev
          }, {})
          const router_Power_Data = routerData.reduce((prev, cur) => {
            const father_Id = cur.pid
            const father_Data = router_Map_Table[father_Id]
            if (father_Data) {
              father_Data.children ? father_Data.children.push(cur) : father_Data.children = [cur]
            } else {
              prev.push(cur)
            }
            return prev
          }, [])
          commit('set_Router_Power', router_Power_Data)
          commit('storage_Button_Power', buttonData)
          // sessionStorage.setItem('Router', JSON.stringify(router_Power_Data))
          // sessionStorage.setItem('Button', JSON.stringify(buttonData))
          resolve()
        }
      }).catch(err => {
        reject(err)
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

function arrguments_Router(data, path = '') {
  const arr = []
  data.forEach(c => {
    const o = {
      path: path + '/' + c.path,
      name: c.path,
      component: () => import('../../../' + (path === '' ? 'views' : 'components') + path + '/' + c.path + '.vue'),
      meta: { title: c.title, navShow: c.navShow },
      children: arrguments_Router(c.children || [], path + '/' + c.path),
      redirect: c.children ? '/' + c.path + '/' + c.children[0].path : ''
    }
    if (o.children.length === 0) {
      delete o.children
      delete o.redirect
    }
    arr.push(o)
  })
  return arr
}

// eslint-disable-next-line no-unused-vars
function arrguments_addRoute(data, parentName = '') {
  data.forEach(c => {
    if (c.children) {
      arrguments_addRoute(c.children, c.name)
    }
    Vue_Router.options.routes.push(c)
    delete c.children
    Vue_Router.addRoute(parentName, c)
  })
}

// window.addEventListener('storage', (e) => {
//   if (!e.storageArea.Users) {
//     getters.session_Clear_User(state)('sessionStorage Users数据被清空')
//   }
// });
