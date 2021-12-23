/*
 * @Author: Cxy
 * @Date: 2021-05-06 20:59:24
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-22 10:34:59
 * @FilePath: \blog\blogweb\src\store\modules\article\index.js
 */
import { articleTag_Find } from '@/http/model/article.js'
import Vue from 'vue'

const state = {
  Article_Tag_Total: [], // 存放标签数据
  Edit_Blog_Data: [], // 存放编辑博客数据
  Article_Default_BG: require('../../../assets/blogBackGround.jpg')
}

const mutations = {
  /**
   * @description: 标签数据整理赋值
   */
  handle_Article_Tag(state, payload) {
    state.Article_Tag_Total = payload.filter(r => {
      r.tag_Color = r.tag_Color.replace(/hsla\((.*),(.*),(.*),1\)/g, 'hsla($1,40%,40%,1)')
      return r.sort_ArticelTag > 0
    })
  },
  /**
   * @description: 跳转添加博客页面编辑数据存放
   */
  handle_Edit_Blog_Data(state, payload) {
    state.Edit_Blog_Data = payload
  }
}

const actions = {
  /**
   * @description: 获取标签数据
   */
  Article_Tag_Find({ commit }, payload) {
    return new Promise((resolve, reject) => {
      articleTag_Find(payload).then((res) => {
        const { code, massage, data } = res.data
        if (code === 200) {
          commit('handle_Article_Tag', data.data || [])
          resolve(data.data)
        } else {
          Vue.msg_Constructor(massage, 'wran')
        }
      }).then(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
