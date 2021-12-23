/*
 * @Author: Cxy
 * @Date: 2021-03-04 15:39:46
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-13 16:15:22
 * @FilePath: \blog\blogweb\src\http\base.js
 */

import Axios from './index'
// @post
export const post = (params, config = {}) => {
  return new Promise((resolve, reject) => {
    Axios.post(params.url, params.body, config).then(res => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject('请求失败')
      }
    }).catch(err => {
      throw err
    })
  })
}
// @get
export const get = (params) => {
  return new Promise((resolve, reject) => {
    Axios.get(params.url, params.query).then(res => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject('请求失败')
      }
    }).catch(err => {
      throw err
    })
  })
}
