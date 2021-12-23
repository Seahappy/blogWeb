import Vue from 'vue'
import VueRouter from 'vue-router'
import { check_Token } from '@/http/model/user.js'
import Vuex from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', navShow: true }
  },
  {
    path: '/Blog',
    component: () => import('../views/Blog.vue'),
    name: 'Blog',
    meta: { title: '博客', navShow: true }
  },
  {
    path: '/infoBlog',
    component: () => import('components/infoBlog/infoBlog.vue'),
    name: 'infoBlog',
    meta: { title: '详情', navShow: true }
  },
  {
    path: '/About',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '关于', navShow: true }
  },
  {
    path: '/Contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: { title: '留言', navShow: true }
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/TimeLine',
    name: 'TimeLine',
    component: () => import('../views/TimeLine.vue'),
    meta: { title: '时间轴', navShow: true }
  },
  {
    path: '/NoFound',
    name: 'NoFound',
    meta: { title: '页面不存在', navShow: true },
    component: () => import('../views/NoFound.vue')
  },
  {
    path: '/',
    redirect: '/Home'
  }
]

const createRouter = () => new VueRouter({
  mode: 'history',
  routes
  // 跳转页面获取滚动条 但是在本项目中不会生效因为滚动条不是外部滚动
  /*  scrollBehavior(to, from, savedPosition) {
     return {
       x: 0,
       y: 0,
       behavior: 'smooth',
     }
   } */
})

const router = createRouter()

// 登出重置路由
export function restRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

let path_Name = ''
router.beforeEach((to, from, next) => {
  document.title = to.meta?.title + '-SeaHappy' || 'SeaHappy🚀Blog'
  if (Vuex.state.login.Users.token !== '') {
    if (to.name !== path_Name && to.name !== null) {
      path_Name = to.name
      check_Token({ headers: { token: Vuex.state.login.Users.token }}).then(res => {
        const { code, massage } = res.data
        if (code === 1) {
          Vuex.getters['login/session_Clear_User'](massage)
          next()
        } else {
          next()
        }
      })
    } else {
      next()
    }
  } else if (to.name === null) {
    next('/NoFound')
  } else {
    next()
  }
  document.body.firstElementChild.nextElementSibling.scrollTop = 0
})

// // 配合服务端异步加载动态路由只走一次
// router.onReady(() => {
//   const router_Power = JSON.parse(sessionStorage.getItem('Router'))
//   if (router_Power) {
//     Vuex.commit('login/set_Router_Power', router_Power)
//   }
// })

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
