/*
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2021-09-11 20:15:58
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-29 15:03:10
 * @FilePath: \blog\blogweb\src\components\subgroups\index.js
 */
import massage from './massage'
import messageBox from './messageBox'
import { tab, tabPane } from './tabs'
import toolTip from './toolTip'
import { table, loading } from './table'
import { image } from './image'
import { paging } from './paging'
import {
  button,
  checkBox,
  form,
  input
} from './from'

const components = [
  massage,
  messageBox,
  tab,
  tabPane,
  toolTip,
  button,
  checkBox,
  form,
  input,
  table,
  loading,
  image,
  paging
]

const install = (Vue) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  /* $MsgBox 弹窗全局注册 */
  Vue.prototype.$MsgBox = messageBox
  /* $Msg 提示信息全局注册 */
  Vue.prototype.$Msg = massage
  /* $Msg Vue实例上添加 */
  Vue.msg_Constructor = massage
}

export default install
