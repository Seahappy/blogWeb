<!--
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2021-11-25 14:41:04
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-20 15:15:52
 * @FilePath: \blog\blogweb\src\components\Administration\networkManagement.vue
-->
<template>
  <div class='network'>
    <div class='echarts'>
      <div class='echarts_liPie'>
        <div class='echarts_InfLiu'>
          <div class='echarts_Inf'>
            <div>
              <p>当前IPV4地址：</p>
              <p style='font-weight: bold'>{{ public_IP }}</p>
            </div>
            <div v-if='select_Public_IP !== public_IP'>
              <p>选中IPV4地址：</p>
              <p style='font-weight: bold'>{{ select_Public_IP }}</p>
            </div>
            <div>
              <p>下次流量重置时间：</p>
              <p style='font-weight: bold'>
                {{ $options.filters.dateFilter(flow_Reset_Time) }}
              </p>
            </div>
          </div>
          <div ref='echarts_Liu' class='echarts_Liu' />
        </div>
        <div ref='echarts_Pie' class='echarts_Pie' />
      </div>
      <div ref='echarts_Map' class='echarts_Map' />
      <div ref='echarts_Bar' class='echarts_Bar' />
    </div>
    <SHTable
      ref='SHTable'
      type
      :tab_Title='tab_Title'
      :tab_Data='table_Data'
      @rowClick='rowClick'>
      <template v-slot:tbody_infor='slotProps'>
        <div class='table_Data_Infor'>
          <p v-for='(c, i) in slotProps.row.users' :key='i'>
            <span>账号：</span><span>{{ c.admin_Code }}</span>
            <span>昵称：</span><span>{{ c.nick_Name || "----" }}</span>
            <span>在线状态：</span><span
              v-if='
                c.online_Offline === 1 &&
                  c.public_IP === slotProps.row.public_IP
              '
              style='color: green'>在线</span><span v-else style='color: red'>离线</span>
            <span>最近访问时间：</span><span>{{
              $options.filters.dateFilter(
                slotProps.row.update_Admin[c.admin_Code]
              )
            }}</span>
          </p>
          <p v-if='!slotProps.row.users.length'>
            <span>游客访问IP，未进行注册</span>
          </p>
        </div>
      </template>
      <template v-slot:thead_Operation>
        <th style='width: 210px'>操作</th>
      </template>
      <template v-slot:tbody_Operation='slotProps'>
        <td style='width: 210px'>
          <SHButton
            v-if='!slotProps.row.edit'
            type='primary'
            icon='fa-pencil-square'
            @click.stop='edit_Network_Opar(slotProps.row)'>编辑</SHButton>
          <SHButton
            v-else
            type='success'
            icon='fa-floppy-o'
            @click.stop='save_Network(slotProps.row)'>保存</SHButton>
          <SHButton
            v-if='slotProps.row.frozen_State === 1'
            type='warn'
            icon='fa-unlock'
            @click.stop='save_Network({...slotProps.row, frozen_State: 0})'>IP解冻</SHButton>
          <SHButton
            v-if='slotProps.row.frozen_State === 0'
            type='danger'
            icon='fa-unlock-alt'
            @click.stop='save_Network({...slotProps.row, frozen_State: 1})'>
            IP冻结
          </SHButton>
        </td>
      </template>
    </SHTable>
    <SHPaging
      config='total, sizes, prev, pager, next, jumper'
      :btnPageNum='5'
      :total='page_Size.total'
      :pageSize='[5, 10, 15]'
      @currentPageOpar='currentPageOpar'/>
  </div>
</template>
<script>
import {
  get_Network_Data,
  set_Network_Data,
  get_Network_Flow_Data,
  get_Network_Point_Data,
  get_Network_Online_Data,
  get_Map_Josn_Data
} from '@/http/model/other.js'
import { deepClone, randomHexColorCode } from '@/until'
import { mapState } from 'vuex'
import echarts from '../../../static/until/echarts.min.js'

import * as echartsNew from 'echarts/core'
import 'echarts-liquidfill'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echartsNew.use([
  BarChart,
  PieChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  ToolboxComponent
])
export default {
  data() {
    return {
      flow_Reset_Time: 0,
      select_Public_IP: '',
      table_Data: [], // 人员数据
      table_Data_Copy: [], // 拷贝人员数据
      tab_Title: [
        { title: '公网IP', prop: 'public_IP', width: 120 },
        { title: '所在省份', prop: 'province_IP', width: 120 },
        { title: '所在城市', prop: 'city_IP', width: 120 },
        { title: '所在区县', prop: 'county_IP', width: 100 },
        { title: '所在地点', prop: 'location_IP', width: 140 },
        { title: '访问次数', prop: 'limit_Number', edit: true, width: 70 },
        { title: '访问时间段(分)', prop: 'limit_Time', edit: true, width: 100 },
        { title: '禁止时间段(分)', prop: 'rest_Time', edit: true, width: 100 }
      ],
      page_Size: {
        skip: 1,
        limit: 5,
        total: 0
      },
      map_History: [],
      myChartMap: null,
      code_Name: '', // 城市code码
      location_Name: '', // 城市名称
      skin_Data: [
        {
          itemBackGround: '#fff',
          itemBorderColor: '#7b7b7b',
          emphColor: '#272727',
          emphAreaColor: '#c8cce7',
          scatterIteamColor: '#007f1f',
          effectScatterRippleEffectColor: '#005c00',
          effectScatterItemColor: '#008000'
        },
        {
          itemBackGround: '#598831',
          itemBorderColor: '#dfdfdf',
          emphColor: '#fff',
          emphAreaColor: '#1258a0',
          scatterIteamColor: '#fff',
          effectScatterRippleEffectColor: '#fff',
          effectScatterItemColor: '#fff'
        }
      ],
      current_Skin: {},
      slow_Skin: 0,
      net_Point_Data: [], // 网络点位
      net_Online_Data: [], // 在线网络点位
      online_Users_Data: [], // 在线用户列表
      active_Point: [], // 选中点位
      firstProvince: [
        '河北省',
        '山西省',
        '内蒙古自治区',
        '辽宁省',
        '吉林省',
        '黑龙江省',
        '江苏省',
        '浙江省',
        '安徽省',
        '福建省',
        '江西省',
        '山东省',
        '河南省',
        '湖北省',
        '湖南省',
        '广东省',
        '广西壮族自治区',
        '海南省',
        '四川省',
        '贵州省',
        '云南省',
        '西藏自治区',
        '陕西省',
        '甘肃省',
        '青海省',
        '宁夏回族自治区',
        '新疆维吾尔自治区',
        '台湾省'
      ],
      firstCity: [
        '北京市',
        '上海市',
        '重庆市',
        '天津市',
        '香港特别行政区',
        '澳门特别行政区'
      ]
    }
  },
  computed: {
    ...mapState('mixed', ['public_IP', 'current_R_Q']),
    ...mapState('admin', ['Lander_Data']),
    ...mapState('login', ['Users'])
  },
  watch: {
    Lander_Data: {
      async handler() {
        this.get_Network_List()
        await this.get_Network_Online_Data_Opar()
        this.get_Network_Point_Data_Opar()
      },
      deep: true
    }
  },
  methods: {
    rowClick(c) {
      if (c.province_IP) {
        c.value = c.long_Lat
        c.name = c.location_IP
        this.active_Point = c
        this.select_Public_IP = c.public_IP
        this.get_Network_Flow_Data_Opar()
        this.opation_Map_Echarts()
      }
    },
    currentPageOpar(pageSize) {
      const { skip, limit } = pageSize
      this.page_Size.skip = skip
      this.page_Size.limit = limit
      this.get_Network_List()
    },
    get_Network_List() {
      const { page_Size: { skip, limit }} = this
      get_Network_Data({ skip, limit }).then((res) => {
        const { code, data, massage } = res.data
        if (code === 200) {
          const list = data.data.map((c) => {
            c.edit = false
            return c
          })
          this.table_Data = list
          this.table_Data_Copy = list
          this.page_Size.total = data.countNum
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    edit_Network_Opar(c) {
      this.table_Data = deepClone(this.table_Data_Copy)
      this.table_Data[c.i].edit = true
    },
    get_Network_Flow_Data_Opar() {
      const { select_Public_IP: public_IP } = this
      get_Network_Flow_Data({ public_IP }).then((res) => {
        const { code, data, massage } = res.data
        if (code === 200) {
          const { limit_Time, access_Time } = data.data
          this.opation_Liu_Echarts(data.data)
          this.flow_Reset_Time = limit_Time * 60 * 1000 + access_Time
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    save_Network(c) {
      const { _id, limit_Number, limit_Time, rest_Time, public_IP, frozen_State } = c
      const {
        limit_Number: limit_NumberC,
        limit_Time: limit_TimeC,
        rest_Time: rest_TimeC,
        frozen_State: frozen_StateC
      } = this.table_Data_Copy[c.i]
      this.table_Data[c.i].edit = false
      if (
        limit_Number === limit_NumberC &&
        limit_Time === limit_TimeC &&
        rest_Time === rest_TimeC &&
        frozen_State === frozen_StateC
      ) {
        return
      }
      set_Network_Data({
        _id,
        limit_Number,
        limit_Time,
        rest_Time,
        public_IP,
        frozen_State
      }).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          this.get_Network_List()
        } else {
          this.table_Data = deepClone(this.table_Data_Copy)
          this.$Msg(massage, 'faild')
        }
      })
    },
    get_Map_Josn_Data_Opar(locationName) {
      get_Map_Josn_Data({ locationName }).then((res) => {
        const { code, data: interFaceData, massage } = res.data
        if (code === 200) {
          const { data, codeName } = interFaceData
          if (codeName) {
            this.code_Name = codeName
            this.location_Name = locationName
            echarts.registerMap(codeName, data)
            this.opation_Map_Echarts(true)
          } else {
            this.map_History.pop()
          }
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    get_Network_Online_Data_Opar() {
      return new Promise((resolve, reject) => {
        get_Network_Online_Data().then((res) => {
          const { data, code, massage } = res.data
          if (code === 200) {
            const long_Lat_Data = []
            const net_Online_Data = []
            data.data.forEach((c) => {
              const str_Value = c.long_Lat.toString()
              const index = long_Lat_Data.indexOf(str_Value)
              if (index === -1) {
                long_Lat_Data.push(str_Value)
                c.name = [c.nick_Name || c.admin_Code]
                c.value = c.long_Lat
                net_Online_Data.push(c)
              } else {
                net_Online_Data[index].name.push(c.nick_Name || c.admin_Code)
              }
            })
            this.net_Online_Data = net_Online_Data
            resolve()
            this.opation_Map_Echarts()
          } else {
            this.$Msg(massage, 'faild')
            reject(massage)
          }
        })
      })
    },
    get_Network_Point_Data_Opar() {
      get_Network_Point_Data().then((res) => {
        const { data, code, massage } = res.data
        if (code === 200) {
          this.net_Point_Data = data.data.filter((c) => {
            c.bgColor = randomHexColorCode()
            if (c.province_IP) return c
          })
          this.opation_Map_Echarts()
          this.opation_Pie_Echarts(data.data)
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    net_Point_Data_Arrangement() {
      const point_Data = []
      const { location_Name, net_Point_Data, firstProvince, firstCity } = this
      let condiVar = ''
      let arrtriVar = ''
      if (location_Name === 'china' || location_Name === 'world') {
        arrtriVar = 'province_IP'
      } else if (firstProvince.includes(location_Name)) {
        condiVar = 'province_IP'
        arrtriVar = 'city_IP'
      } else if (firstCity.includes(location_Name)) {
        condiVar = 'province_IP'
        arrtriVar = 'county_IP'
      } else {
        condiVar = 'city_IP'
        arrtriVar = 'county_IP'
      }
      return net_Point_Data.reduce((prev, c) => {
        if (condiVar === '' || c[condiVar] === location_Name) {
          const isVal = point_Data.indexOf(c[arrtriVar])
          if (isVal > -1) {
            prev[isVal].value++
          } else {
            point_Data.push(c[arrtriVar])
            prev.push({
              name: c[arrtriVar],
              value: 1,
              nameBgColor: JSON.stringify({
                bgColor: c.bgColor,
                name: c[arrtriVar]
              })
            })
          }
        }
        return prev
      }, [])
    },
    opation_Map_Echarts(reloadFlag) {
      const {
        myChartMap,
        current_Skin,
        code_Name,
        location_Name,
        net_Point_Data,
        net_Online_Data,
        active_Point
      } = this
      const net_Static_Data = this.net_Point_Data_Arrangement()
      this.opation_Bar_Echarts()
      const that = this
      const optionChart = {
        borderRadius: 10,
        visualMap: {
          show: true,
          type: 'piecewise',
          left: '2%',
          bottom: '2%',
          splitNumber: 4,
          max: 100,
          min: 0,
          color: ['#fffaa8', '#f8becc', '#fbce93', '#bedca8'],
          inverse: true, // 是否反转
          seriesIndex: 0 // 指定取哪个系列的数据
        },
        title: {
          text: code_Name === 'china' ? '中国' : location_Name,
          left: '2%',
          top: '2%',
          textStyle: {
            color: current_Skin.itemBackGround,
            fontFamily: 'monospace'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function({ seriesType, name, value, data }) {
            let str = ''
            if (seriesType === 'effectScatter') {
              const { location_IP } = data
              for (let index = 0; index < name.length; index++) {
                str +=
                  '<p>昵称：<span style="color: #1258a0;font-weight: bold;font-size: 14px;">' +
                  name[index] +
                  '<span style="font-size: 12px;"> (在线)</span></span></p>'
              }
              str +=
                '<p>所在地：<span style="color: #1258a0;font-weight: bold;font-size: 14px;">' +
                location_IP +
                '</span></p>'
            } else {
              const currentType = seriesType === 'map'
              str =
                (currentType
                  ? ''
                  : '<p>IP：<span style="color: #1258a0;font-weight: bold;font-size: 14px;">' +
                    data.public_IP +
                    '</span></p>') +
                '<p>所在地：<span style="color: #1258a0;font-weight: bold;font-size: 14px;">' +
                name +
                '</span></p>' +
                '<p>' +
                (currentType ? '此区域注册IP数' : '此IP注册人数') +
                '：<span style="color: #1258a0;font-weight: bold;font-size: 14px;">' +
                ((currentType ? value : data.admin_Code?.length) || 0) +
                '</span></p>'
            }
            const tooltipHTML =
              '<div style="border: 1px solid #ebeef5;box-shadow: 0 2px 12px 0 rgb(0, 0, 0, 10%);padding: 5px 15px;background: #fff;border-radius: 5px;font-size: 12px;">' +
              str +
              '</div>'
            return tooltipHTML
          },
          backgroundColor: 'rgba(0,0,0,0)',
          padding: 0,
          textStyle: {
            color: '#303133'
          }
        },
        toolbox: {
          show: true,
          itemSize: 15, // 工具栏 icon 的大小
          itemGap: 10, // 工具栏 icon 每项之间的间隔
          iconStyle: {
            borderColor: current_Skin.itemBackGround,
            borderWidth: 2
          },
          emphasis: {
            iconStyle: {
              borderColor: '#fff',
              textFill: '#000'
            }
          },
          right: '2%',
          top: '2%',
          feature: {
            myBack: {
              show: code_Name !== 'china',
              title: '返回',
              icon: 'path://M674.909091 854.884848c-4.654545 0-7.757576-1.551515-10.860606-4.654545l-325.818182-325.818182c-3.10303-3.10303-4.654545-6.206061-4.654545-10.860606s1.551515-7.757576 4.654545-10.860606l325.818182-325.818182c6.206061-6.206061 15.515152-6.206061 21.721212 0s6.206061 15.515152 0 21.721212L370.812121 513.551515l314.957576 314.957576c6.206061 6.206061 6.206061 15.515152 0 21.721212-3.10303 3.10303-6.206061 4.654545-10.860606 4.654545z',
              onclick: function() {
                that.map_History.pop()
                if (that.map_History.length) {
                  that.get_Map_Josn_Data_Opar(that.map_History.slice(-1)[0])
                } else {
                  that.get_Map_Josn_Data_Opar('china')
                }
              }
            },
            mySwitchSkin: {
              show: true,
              title: '切换主题',
              icon: 'M884.48 116.48L1024 302.72l-46.72 46.08-139.52-185.6zM0 302.72h1024v46.08H0v-46.08z m0 372.48h1024v46.08H0v-46.08z m46.72 0l139.52 185.6-46.72 46.72L0 721.28z',
              onclick: function() {
                if (that.slow_Skin === that.skin_Data.length - 1) {
                  that.slow_Skin = 0
                } else {
                  that.slow_Skin++
                }
                that.current_Skin = that.skin_Data[that.slow_Skin]
                that.opation_Map_Echarts()
              }
            },
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          type: 'map',
          name: 'netLocMap',
          map: code_Name,
          roam: true, // 平移缩放
          // center: this.current_R_Q,
          scaleLimit: {
            // 缩放比例
            min: 1,
            max: 50
          },
          nameMap: {
            // 地图名称映射
            // '内蒙古': '我家'
          },
          selectedMode: 'single', // 单选
          itemStyle: {
            areaColor: current_Skin.itemBackGround,
            borderColor: current_Skin.itemBorderColor,
            borderWidth: 0.3,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 5
          },
          emphasis: {
            // 高亮标签
            label: {
              color: current_Skin.emphColor,
              fontWeight: 'bold',
              fontSize: 14,
              areaColor: 'red'
            },
            itemStyle: {
              color: current_Skin.emphAreaColor
            }
          },
          showLegendSymbol: true
        },
        series: [
          {
            type: 'map',
            name: 'netLocMap',
            map: code_Name,
            geoIndex: 0,
            data: net_Static_Data
          },
          {
            type: 'scatter',
            name: 'netLocDot',
            coordinateSystem: 'geo', // 坐标系
            hoverAnimation: true, // 鼠标划过动画效果
            symbol: 'pin',
            symbolSize: [12, 13], // 宽高
            zlevel: 2,
            itemStyle: {
              color: current_Skin.scatterIteamColor,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 3,
              shadowOffsetX: 3,
              shadowOffsetY: -3
            },
            emphasis: {
              itemStyle: {
                color: '#1258a0'
              }
            },
            data: net_Point_Data.filter((c) => {
              if (
                !net_Online_Data
                  .map((cc) => cc.value.toString())
                  .includes(c.value.toString()) &&
                active_Point?.long_Lat?.toString() !== c.value.toString()
              ) {
                return that.sity_Selection(c, code_Name, location_Name)
              }
            })
          },
          {
            type: 'scatter',
            name: 'activeLocDot',
            coordinateSystem: 'geo', // 坐标系
            symbol: 'pin',
            symbolSize: [16, 18], // 宽高
            zlevel: 2,
            itemStyle: {
              color: '#ee6666'
            },
            data: [active_Point].filter(c => {
              return that.sity_Selection(c, code_Name, location_Name)
            })
          },
          {
            type: 'effectScatter',
            name: 'netOnlin',
            coordinateSystem: 'geo', // 坐标系
            rippleEffect: {
              color: current_Skin.effectScatterRippleEffectColor,
              scale: 4
            },
            symbol: 'circle',
            symbolSize: 8, // 宽高
            zlevel: 2,
            itemStyle: {
              color: current_Skin.effectScatterItemColor,
              shadowBlur: 10,
              shadowColor: current_Skin.effectScatterItemColor
            },
            data: net_Online_Data.filter((c) => {
              if (active_Point?.long_Lat?.toString() !== c.value.toString()) {
                return that.sity_Selection(c, code_Name, location_Name)
              }
            })
          }
        ]
      }
      if (reloadFlag) myChartMap.clear()
      myChartMap.setOption(optionChart)
    },
    sity_Selection(c, code_Name, location_Name) {
      if (code_Name === 'china' || code_Name === 'world') {
        return c
      } else {
        if (/\d/gm.test(code_Name)) {
          return c.city_IP === location_Name
        } else {
          return c.province_IP === location_Name
        }
      }
    },
    opation_Bar_Echarts() {
      const { myChartBar } = this
      const net_Static_Data = this.net_Point_Data_Arrangement()
      const optionChart = {
        title: {
          text: '地区注册量',
          top: 5,
          left: 5,
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '1%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          show: false
        },
        dataZoom: [
          {
            type: 'inside',
            yAxisIndex: 0,
            start: 0
          }
        ],
        yAxis: {
          data: net_Static_Data.map((c) => c.nameBgColor),
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            formatter: function(params) {
              const dataName = JSON.parse(params)
              let str = ''
              for (let i = 0; i < dataName.name.length; i++) {
                str += dataName.name[i]
                if (i % 3 === 0 && i !== 0) {
                  str += '\n'
                }
              }
              return '{a|' + str + '}'
            },
            rich: {
              a: {
                color: '#444',
                fontWeight: 'bold',
                lineHeight: 22,
                fontSize: 14
              }
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: net_Static_Data.map((c) => c.value),
            colorBy: 'data',
            showBackground: true,
            backgroundStyle: {
              color: '#00000000',
              borderRadius: 5
            },
            label: {
              show: true,
              position: 'right',
              formatter: function({ value }) {
                return ['{a|' + value + '}'].join('\n')
              },
              rich: {
                a: {
                  color: 'inherit',
                  fontWeight: 'bold',
                  lineHeight: 22,
                  fontSize: 14
                }
              }
            },
            barWidth: 36,
            itemStyle: {
              borderRadius: 5
              // color: ({ name }) => {
              //   const dataName = JSON.parse(name)
              //   return dataName.bgColor
              // }
            }
          }
        ]
      }
      myChartBar.setOption(optionChart)
    },
    opation_Pie_Echarts(net_Point_Data) {
      const { myChartPie } = this
      const pie_Data = net_Point_Data.reduce(
        (prev, c) => {
          if (c.admin_Code.length) {
            prev[0].value++
          } else {
            prev[1].value++
          }
          return prev
        },
        [
          { value: 0, name: '已注册' },
          { value: 0, name: '未注册' }
        ]
      )
      const optionChart = {
        title: {
          text: 'IP注册量与未注册量',
          top: 5,
          left: 5,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'plain',
          data: pie_Data,
          orient: 'vertical',
          left: '2%',
          bottom: '2%'
        },
        series: [
          {
            type: 'pie',
            radius: [0, '60%'],
            center: ['50%', '55%'],
            data: pie_Data,
            label: {
              show: true,
              position: 'outside',
              color: 'inherit'
            },
            selectedMode: true,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function({ dataIndex }) {
                return ['#23935f', '#fc8452'][dataIndex]
              }
            }
          }
        ]
      }
      myChartPie.setOption(optionChart)
    },
    opation_Liu_Echarts({ limit_Number = 0, visits_Num = 0 }) {
      const { myChartLiu } = this
      const that = this
      const flow_Reckon = (visits_Num / limit_Number).toFixed(3)
      const flow_Num = isNaN(flow_Reckon) ? 0 : flow_Reckon
      const optionChart = {
        toolbox: {
          show: true,
          itemSize: 15, // 工具栏 icon 的大小
          itemGap: 10, // 工具栏 icon 每项之间的间隔
          iconStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            iconStyle: {
              borderColor: '#fff',
              textFill: '#000'
            }
          },
          right: '2%',
          top: '2%',
          feature: {
            myrest: {
              title: '刷新',
              icon: 'M526.628571 1024c-153.6 0-299.885714-65.828571-394.971428-175.542857C29.257143 738.742857-14.628571 599.771429 0 453.485714 29.257143 219.428571 226.742857 29.257143 475.428571 0H533.942857c138.971429 0 270.628571 51.2 365.714286 146.285714l51.2 51.2V21.942857c0-14.628571 7.314286-21.942857 21.942857-21.942857s21.942857 7.314286 21.942857 21.942857v219.428572c0 14.628571-7.314286 21.942857-21.942857 21.942857h-219.428571c-14.628571 0-21.942857-7.314286-21.942858-21.942857-7.314286-14.628571 0-21.942857 14.628572-21.942858h153.6l-65.828572-51.2C746.057143 95.085714 636.342857 51.2 519.314286 51.2c-146.285714 0-277.942857 65.828571-373.028572 175.542857C65.828571 329.142857 29.257143 468.114286 58.514286 607.085714c36.571429 182.857143 182.857143 329.142857 373.028571 365.714286 36.571429 7.314286 65.828571 7.314286 95.085714 7.314286 197.485714 0 380.342857-124.342857 446.171429-314.514286 0-7.314286 7.314286-14.628571 21.942857-14.628571h14.628572c7.314286 0 14.628571 7.314286 14.628571 7.314285s7.314286 7.314286 0 14.628572c-73.142857 212.114286-270.628571 351.085714-497.371429 351.085714z',
              onclick: function() {
                that.get_Network_Flow_Data_Opar()
              }
            }
          }
        },
        title: {
          text: '流量使用',
          top: 5,
          left: 5,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'liquidFill',
            data: [flow_Num, flow_Num < 0.1 ? 0.1 : flow_Num - 0.1],
            outline: {
              show: false
            },
            center: ['50%', '55%'],
            backgroundStyle: {
              color: '#00304d'
            },
            color: ['#25a8f8', '#3eb6ff'],
            radius: '50%',
            z: 3,
            label: {
              show: true,
              color: '#fff',
              insideColor: '#fff',
              fontSize: 16
            }
          },
          {
            type: 'pie',
            radius: ['50%', '55%'],
            center: ['50%', '55%'],
            data: [flow_Num, 1 - flow_Num],
            label: {
              show: false
            },
            clockwise: false, // 饼图的扇区是否是顺时针排布
            selectedMode: false, // 选中样式
            emphasis: {
              scale: false, // 高亮大小
              focus: 'none', // 聚焦
              itemStyle: {
                color: 'inherit' // 取消高亮颜色
              }
            },
            itemStyle: {
              color: function({ dataIndex }) {
                return ['#2974a3', '#9bd9ff'][dataIndex]
              }
            },
            tooltip: {
              show: false
            }
          }
        ]
      }
      myChartLiu.setOption(optionChart)
    }
  },
  async mounted() {
    this.current_Skin = this.skin_Data[0]
    this.myChartMap = echarts.init(this.$refs.echarts_Map)
    this.myChartBar = echartsNew.init(this.$refs.echarts_Bar)
    this.myChartPie = echartsNew.init(this.$refs.echarts_Pie)
    this.myChartLiu = echartsNew.init(this.$refs.echarts_Liu)
    this.opation_Bar_Echarts()
    this.myChartMap.on('click', (data) => {
      if (this.map_History.length < 2) {
        this.map_History.push(data.name)
        this.get_Map_Josn_Data_Opar(data.name)
      }
    })
    this.get_Map_Josn_Data_Opar('china')
    this.get_Network_List()
    await this.get_Network_Online_Data_Opar()
    this.get_Network_Point_Data_Opar()
    this.select_Public_IP = this.public_IP
    this.get_Network_Flow_Data_Opar()
  }
}
</script>
<style lang="less" scoped>
.network {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  margin: 20px;
  .echarts {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    height: 380px;
    justify-content: space-between;
    .echarts_liPie,
    .echarts_Bar,
    .echarts_Map {
      width: 32%;
      height: 100%;
      background: #c9eaff;
      border-radius: 10px;
      z-index: 1;
      border: solid 1px #e0e0e0;
    }
    .echarts_liPie {
      background: rgba(0, 0, 0, 0);
      border: none;
      .echarts_InfLiu {
        height: 50%;
        width: 100%;
        margin-bottom: 4%;
        display: flex;
        justify-content: space-between;
        .echarts_Inf {
          width: 48%;
          height: 100%;
          background: #c9eaff;
          border: solid 1px #e0e0e0;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
          color: #444;
          div {
            margin: 8px 0 8px 15px;
            line-height: 20px;
          }
        }
        .echarts_Liu {
          height: 100%;
          width: 48%;
          background: #c9eaff;
          border: solid 1px #e0e0e0;
          border-radius: 10px;
        }
      }
      .echarts_Pie {
        width: 100%;
        height: 45%;
        background: #c9eaff;
        border-radius: 10px;
        border: solid 1px #e0e0e0;
      }
    }
  }
  .SHTable {
    flex: 1;
    overflow: auto;
    .table_Data_Infor {
      padding-left: 25px;
      p {
        line-height: 24px;
        span {
          display: inline-block;
        }
        span:nth-child(1),
        span:nth-child(3),
        span:nth-child(5),
        span:nth-child(7) {
          color: #99a9bf;
        }
        span:nth-child(2),
        span:nth-child(4),
        span:nth-child(6),
        span:nth-child(8) {
          width: 15%;
          color: #606266;
          font-size: 14px;
        }
      }
    }
    .SHButton {
      &:first-child{
        margin-right: 20px;
      }
    }
  }
  .SHPaging {
    margin-right: 45px;
  }
}
</style>
