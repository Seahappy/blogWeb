/*
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2022-05-25 13:46:11
 * @LastEditors: Cxy
 * @LastEditTime: 2022-05-25 13:46:12
 * @FilePath: \ehomes-admind:\blog\blogWeb\src\http\model\chat.js
 */
import { get } from '../base.js'

export const get_Chat_Data = (query) => get({ url: '/api/getChatData', query: { params: query }})
