/*
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2021-09-11 19:37:12
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-13 16:25:16
 * @FilePath: \blog\blogweb\src\components\subgroups\tabs\index.js
 */
import tab from './tab.vue'
import tabPane from './tabPane.vue'

tab.install = function(Vue) {
  Vue.component(tab.name, tab)
}

tabPane.install = function(Vue) {
  Vue.component(tabPane.name, tabPane)
}

export { tab, tabPane }
