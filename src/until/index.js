/*
 * @Author: Cxy
 * @Date: 2021-05-17 17:06:16
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-17 15:46:50
 * @FilePath: \blog\blogweb\src\until\index.js
 */

/**
 * @description: 判断登陆设备类型
 * @param {*} ringFlag true false 判断谷歌
 * @return {*} 登录设备
 */
export const Login_Device_Code = (ringFlag) => {
  const userAgent = navigator.userAgent
  if (ringFlag) {
    if (userAgent.includes('Chrome') && userAgent.includes('Win64; x64') && !userAgent.includes('Edg')) {
      return false
    } else {
      return true
    }
  } else {
    if (userAgent.includes('Android')) {
      return 'Android'
    } else if (userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      return 'Ios'
    } else if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent)) {
      return 'Window'
    }
  }
}

/**
 * @description: 判断两值是否相等
 * @param {*} a
 * @param {*} b
 * @return {*} true || false
 */
export const equals = (a, b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) { return a.getTime() === b.getTime() }
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) { return a === b }
  if (a.prototype !== b.prototype) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((k) => equals(a[k], b[k]))
}

/**
 * @description: 公交车 跨级传递组件值
 */
import Vue from 'vue'
export const bus = new Vue()

/**
 * @description: 深度克隆
 * @param {*} obj
 * @ruturn {*} clone
 */
export const deepClone = obj => {
  if (obj === null) return null
  const clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key =>
      (clone[key] =
      typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  if (Array.isArray(obj)) {
    clone.length = obj.length
    return Array.from(clone)
  }
  return clone
}

/**
 * @description: 随机颜色
 * @param {*} hsla(色值,色域,饱和度,透明度)
 * @return {*} 色值
 */
export const randomHexColorCode = () => {
  const colorAngle = Math.floor(Math.random() * 360)
  return 'hsla(' + colorAngle + ',100%,40%,1)'
}

/**
 * @description: MD5
 * @return {*} 加密后数值
 */
import md5 from './md5'
const key = 'SeaHappy'
export const MD5 = (ran, pwd) => {
  return md5(key + md5(ran + md5(pwd)))
}

/**
 * @description: 计算字符串字符长度
 * @param {*} str
 * @return {*} length
 */
export const getBLen = (str) => {
  if (str == null) return 0
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '00').length
}
