/*
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2022-06-02 14:20:17
 * @LastEditors: Cxy
 * @LastEditTime: 2022-06-08 15:13:15
 * @FilePath: \ehomes-admind:\gitHubBlog\blogWeb\src\http\model\live.js
 */
import { get, post } from '../base.js'

export const get_Live_Data = (query) => get({ url: '/api/getLiveData', query: { params: query }})

export const id_Duplicate_Check = (query) => get({ url: '/api/idDuplicateCheck', query: { params: query }})

export const set_Live_Data = (body) => post({ url: '/api/setLiveData', body })

export const get_Live_Broadcast = (query) => get({ url: '/api/getLiveBroadcast', query: { params: query }})

export const set_Live_Heat = (body) => post({ url: '/api/setLiveHeat', body })

export const get_Room_Key = (body) => post({ url: '/api/getRoomKey', body })
