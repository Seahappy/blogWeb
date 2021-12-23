<!--
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2021-09-23 14:45:30
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-20 20:09:45
 * @FilePath: \blog\blogweb\src\components\Administration\systemManagement.vue
-->
<template>
  <div class='sysTem'>
    <div class='seconds_Threshold'>
      <SHButton type='primary' icon='fa fa-spinner fa-pulse' @click='get_System_Opartion'>刷新</SHButton>
      <SHButton v-for='c in secondsTime' :key='c' :type="selectSecondsT === c ? 'primary' : ''" @click='select_Opartion(c)'>{{ c }}S</SHButton>
      <span>cpu：</span>
      <SHInput v-model='threshold.alarmValCpu' min='50' max='100' step='5' type='number' oninput='if(value>100)value=100;if(value.length>4)value=value.slice(0,4);if(value<=50)value=50'
               @input="changeIpt('alarmValCpu')"/>
      <span>内存：</span>
      <SHInput v-model='threshold.alarmValMem' min='50' max='100' step='5' type='number' oninput='if(value>100)value=100;if(value.length>4)value=value.slice(0,4);if(value<=50)value=50'
               @input="changeIpt('alarmValMem')"/>
      <span>磁盘：</span>
      <SHInput v-model='threshold.alarmValDisk' min='50' max='100' step='5' type='number' oninput='if(value>100)value=100;if(value.length>4)value=value.slice(0,4);if(value<=50)value=50'
               @input="changeIpt('alarmValDisk')"/>
      <SHToolTip eventType='hover' direction='right' iconColor='#606266' style='text-indent: 0;'>
        <p>1.阈值可根据实际情况调整大小</p>
        <p>2.阈值不得低于50，不高于100</p>
        <i slot='icon' class='fa fa-question-circle' aria-hidden='true'/>
      </SHToolTip>
    </div>
    <div class='sysTem_Echarts'>
      <div class='item_System' :style="{width: browWidth * 0.21 + 'px'}">
        <p>CPU</p>
        <div class='Echarts_Describe'>
          <div ref='cpu_Echarts' class='cpu_Echarts' />
          <div class='cpu_Mem_Describe'>
            <span><i>满载率：</i><strong>{{ cpuDescribe.fullLoad + '%' }}</strong></span>
            <span><i>用户负载：</i><strong>{{ cpuDescribe.currentLoadUser + '%' }}</strong></span>
            <span><i>系统负载：</i><strong>{{ cpuDescribe.currentLoadSystem + '%' }}</strong></span>
          </div>
        </div>
      </div>
      <div class='item_System' :style="{width: browWidth * 0.21 + 'px'}">
        <p>内存</p>
        <div class='Echarts_Describe'>
          <div ref='mem_Echarts' class='cpu_Echarts' />
          <div class='cpu_Mem_Describe'>
            <span><i>未使用：</i><strong>{{ memDescribe.free + 'GB' }}</strong></span>
            <span><i>已使用：</i><strong>{{ memDescribe.used + 'GB' }}</strong></span>
            <span><i>总容量：</i><strong>{{ memDescribe.total + 'GB' }}</strong></span>
          </div>
        </div>
      </div>
      <div class='item_System'>
        <p>磁盘</p>
        <div class='Echarts_Describe'>
          <div ref='disk_Echarts' class='disk_Echarts' />
        </div>
      </div>
      <div class='item_System'>
        <p>
          网络
          <SHToolTip eventType='hover' direction='top' iconColor='#303133' style='text-indent: 0;'>
            <p>1.由于数据没有入库，网速只显示为当前时间的数值</p>
            <p>2.网速显示为当前调用时间间隔的平均值</p>
            <i slot='icon' class='fa fa-question-circle' aria-hidden='true'/>
          </SHToolTip>
        </p>
        <div class='Echarts_Describe'>
          <div class='net_Describe'>
            <div>发送(总)：<span style='font-weight: bold;'>{{ netDescribe.tx_bytes + 'MB' }}</span></div>
            <div>接收(总)：<span style='font-weight: bold;'>{{ netDescribe.rx_bytes + 'MB' }}</span></div>
          </div>
          <div ref='net_Echarts' class='net_Echarts' />
        </div>
      </div>
      <div class='item_System'>
        <p>服务器时间</p>
        <div ref='clock_Echarts' class='clock_Echarts'/>
      </div>
      <div class='item_System'>
        <p>主机名</p>
        <div class='hostNameLogo_System'>{{ hostNameLogofileDescribe.hostName }}</div>
        <p>操作系统</p>
        <div class='hostNameLogo_System'>{{ hostNameLogofileDescribe.Logofile }}</div>
        <p>程序运行时间</p>
        <div class='node_Serve_Time' :style="{width: browWidth * 0.103 + 'px'}">
          <span>{{ nodeServeUptime.nodeUptime.split(',')[0] }}</span>
          <span>天</span>
        </div>
        <div>
          <span>{{ nodeServeUptime.nodeUptime.split(',')[1] }}</span>
          <span>时</span>
          <span>{{ nodeServeUptime.nodeUptime.split(',')[2] }}</span>
          <span>分</span>
          <span>{{ nodeServeUptime.nodeUptime.split(',')[3] }}</span>
          <span>秒</span>
        </div>
        <p>系统运行时间</p>
        <div class='node_Serve_Time' :style="{width: browWidth * 0.103 + 'px'}">
          <span>{{ nodeServeUptime.systemTime.split(',')[0] }}</span>
          <span>天</span>
        </div>
        <div>
          <span>{{ nodeServeUptime.systemTime.split(',')[1] }}</span>
          <span>时</span>
          <span>{{ nodeServeUptime.systemTime.split(',')[2] }}</span>
          <span>分</span>
          <span>{{ nodeServeUptime.systemTime.split(',')[3] }}</span>
          <span>秒</span>
        </div>
      </div>
      <div class='item_System' style='padding: 1.5% 5px 1.5% 1.5%;display: flex;flex-direction: column;' :style="{width: browWidth * 0.13 + 'px',height: browHeight * 0.39 + 'px'}">
        <p>主要进程</p>
        <ul>
          <li v-if='!processList'>
            <div><span>进程名</span><span>加载中...</span></div>
            <div><span>内存</span><span>加载中...</span></div>
            <div><span>启动时间</span><span>加载中...</span></div>
          </li>
          <li v-for='c in processList' :key='c.pid'>
            <div><span>进程名</span><span>{{ c.name || '加载中...' }}</span></div>
            <div><span>内存</span><span>{{ parseInt(c.memRss/1024) ? parseInt(c.memRss/1024) + 'MB' : '加载中...' }}</span></div>
            <div><span>启动时间</span><span>{{ c.started || '加载中...' }}</span></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart, GaugeChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([
  BarChart,
  LineChart,
  GaugeChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent
])

import { get_System_Data } from '@/http/model/other.js'
export default {
  data() {
    return {
      rxTx_Data: Array.from({ length: 30 }, () => ({ rx_sec: 0, tx_sec: 0, newDate: this.$options.filters.dateFilter(new Date().getTime()).slice(-8) })),
      timer: null,
      sysTimer: null,
      secondsTime: [10, 15, 30, 45],
      selectSecondsT: 15,
      threshold: {
        alarmValCpu: 80,
        alarmValMem: 80,
        alarmValDisk: 80
      },
      thresholdWork: {
        alarmValCpu: 80,
        alarmValMem: 80,
        alarmValDisk: 80
      },
      nodeServeUptime: {
        nodeUptime: '0,00,00,00',
        systemTime: '0,00,00,00'
      },
      processList: [],
      browWidth: 0,
      browHeight: 0,
      systemData: {},
      changeIptTimer: null
    }
  },
  watch: {
    selectSecondsT: function(newV) {
      clearInterval(this.sysTimer)
      this.sysTimer = null
      this.system_Timer(newV)
    }
  },
  methods: {
    select_Opartion(c) {
      this.selectSecondsT = c
      this.get_System_Opartion()
    },
    get_System_Opartion() {
      const { selectSecondsT } = this
      get_System_Data({ selectSecondsT }).then(res => {
        const { code, data } = res.data
        if (code === 200) {
          this.systemData = data
          this.arrangument_Echarts()
        }
      })
    },
    system_Timer() {
      this.sysTimer = setInterval(() => {
        this.get_System_Opartion()
      }, this.selectSecondsT * 1000)
    },
    changeIpt(type) {
      const { threshold, thresholdWork } = this
      if (this.changeIptTimer) (clearTimeout(this.changeIptTimer), this.changeIptTimer = null)
      this.changeIptTimer = setTimeout(() => {
        this.$MsgBox('确定更改当前警报阈值吗', 'wran')
          .then(() => {
            this.thresholdWork[type] = threshold[type]
            this.arrangument_Echarts()
          })
          .catch(() => {
            this.$Msg('已取消')
            this.threshold[type] = thresholdWork[type]
          })
      }, 800)
    },
    arrangument_Echarts() {
      const { currentLoad, mem, fsSize, networkStats, time, nodeUptime, proceList } = this.systemData
      this.cpu_Echarts.setOption(this.option_CpuMen_Echarts(currentLoad?.currentLoad?.toFixed(1) || 0, 'alarmValCpu'))
      this.mem_Echarts.setOption(this.option_CpuMen_Echarts(((mem?.used / mem?.total) * 100).toFixed(1) || 0, 'alarmValMem'))
      this.disk_Echarts.setOption(this.option_Disk_Echarts(fsSize?.reverse()))
      const { rxTx_Data, timer } = this
      if (networkStats) {
        // rx 接收 tx 传输
        const { rx_sec, tx_sec } = networkStats
        const newDate = this.$options.filters.dateFilter(new Date().getTime()).slice(-8)
        rxTx_Data.unshift({ rx_sec, tx_sec, newDate })
        rxTx_Data.pop()
      }
      this.net_Echarts.setOption(this.option_Net_Echarts(rxTx_Data))
      let severTime = time?.current
      let nodeUptimeRest = nodeUptime?.toFixed(0)
      let systemTime = time?.uptime
      if (!timer && severTime) {
        this.timer = setInterval(() => {
          severTime += 1000
          const data = new Date(severTime)
          const second = data.getSeconds()
          const minute = data.getMinutes() + second / 60
          const hour = (data.getHours() % 12) + minute / 60
          this.clock_Echarts.setOption(this.option_Clock_Echarts(hour, minute, second))
          nodeUptimeRest++
          systemTime++
          this.nodeServeUptime = { nodeUptime: this.transformation_Time(nodeUptimeRest), systemTime: this.transformation_Time(systemTime) }
        }, 1000)
      }
      if (!severTime) this.clock_Echarts.setOption(this.option_Clock_Echarts(0, 0, 0))
      this.processList = proceList
    },
    option_CpuMen_Echarts(data, type) {
      const { thresholdWork } = this
      data = isNaN(data) ? 0 : data
      return {
        series: [
          {
            type: 'gauge',
            radius: '85%',
            center: ['50%', '50%'],
            // 进度条
            progress: {
              show: true,
              width: 13,
              itemStyle: {
                color: data < Number(thresholdWork[type]) ? '#6697FA' : '#E86452'
              }
            },
            // 刻度线
            axisLabel: {
              distance: 22,
              color: '#A5ABBB',
              fontSize: 10,
              formatter: '{value}%'
            },
            // 指针
            pointer: {
              show: true,
              width: 8,
              keepAspect: true,
              itemStyle: {
                color: data < Number(thresholdWork[type]) ? '#6697FA' : '#E86452'
              }
            },
            // 刻度盘内圆
            anchor: {
              show: true,
              showAbove: true,
              size: 18,
              itemStyle: {
                borderWidth: 6,
                borderColor: data < Number(thresholdWork[type]) ? '#6697FA' : '#E86452'
              }
            },
            // 标题
            title: {
              show: false
            },
            // 数据
            data: [{ value: data }],
            // 数据展示
            detail: {
              valueAnimation: true,
              fontSize: 16,
              offsetCenter: [0, '95%'],
              formatter: '{value}%',
              fontWeight: 600,
              color: '#464646'
            },
            // 仪表盘轴线
            axisLine: {
              lineStyle: {
                width: 13,
                color: [[1, '#EBEDF3']]
              }
            },
            // 刻度样式
            axisTick: {
              show: false
            },
            // 分隔线样式
            splitLine: {
              distance: -13,
              length: 18,
              lineStyle: {
                width: 3,
                color: 'auto'
              }
            },
            // 刻度线数量
            splitNumber: 2
          }
        ]
      }
    },
    option_Disk_Echarts(data = [{ use: 0, fs: 'C:', size: 0, used: 0 }]) {
      const { thresholdWork: { alarmValDisk }} = this
      const data_Echarts = data.reduce((prev, cur) => {
        prev.push({
          data: cur.use.toFixed(1),
          dataString: JSON.stringify({ name: cur.fs.replace(/:/g, ''), dataAll: (cur.size / 1024 / 1024 / 1024).toFixed(1), dataUser: (cur.used / 1024 / 1024 / 1024).toFixed(1) })
        })
        return prev
      }, [])
      return {
        grid: {
          left: '3%',
          right: '8%',
          bottom: '1%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          show: false,
          max: 100
        },
        yAxis: {
          data: data_Echarts.map(c => c.dataString),
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
              return [
                '{a|' + dataName.name + '}',
                '{b|' + dataName.dataAll + 'GB}'
              ].join('\n')
            },
            rich: {
              a: {
                color: '#444',
                fontWeight: 'bold',
                lineHeight: 22,
                fontSize: 16
              },
              b: {
                fontSize: 10,
                fontFamily: 'Arial'
              }
            },
            color: '#858DA0' // 文字颜色
          }
        },
        series: [
          {
            type: 'bar',
            data: data_Echarts.map(c => c.data),
            colorBy: 'data',
            showBackground: true,
            backgroundStyle: {
              color: '#EBEDF3',
              borderRadius: 5
            },
            label: {
              show: true,
              position: 'right',
              formatter: function({ name, value }) {
                return [
                  '{a|' + value + '%}',
                  '{b|' + JSON.parse(name).dataUser + 'GB}'
                ].join('\n')
              },
              rich: {
                a: {
                  color: 'inherit',
                  fontWeight: 'bold',
                  lineHeight: 22,
                  fontSize: 14
                },
                b: {
                  color: 'inherit',
                  fontSize: 10,
                  fontFamily: 'Arial'
                }
              }
            },
            barWidth: 36,
            itemStyle: {
              borderRadius: 5,
              color: function({ value, dataIndex }) {
                var colorList = ['#3e7dff', '#4dbb8f', '#F6BD16', '#1E9493', '#6DC8EC']
                return value > Number(alarmValDisk) ? '#E86452' : colorList[dataIndex]
              }
            }
          }
        ]
      }
    },
    option_Net_Echarts(data) {
      return {
        title: [
          {
            top: '7%',
            right: '18',
            textStyle: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#858DA0' // 文字颜色
            },
            text: '上' + '\n' + '行'
          },
          {
            top: '55%',
            right: '18',
            textStyle: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#858DA0' // 文字颜色
            },
            text: '下' + '\n' + '行'
          }
        ],
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 6
          },
          formatter: function(params) {
            const { name, data, seriesName, color } = params[0]
            return name + '</br></br>' + seriesName + ' <span style="font-weight: bold;font-size: 14px;color: ' + color + ';"> ' + (data / 1024 > 1 ? (data / 1024).toFixed(1) + 'MB' : data + 'KB') + '</span>'
          }
        },
        xAxis: [
          {
            show: false,
            data: data.map(c => c.newDate)
          },
          {
            show: false,
            data: data.map(c => c.newDate),
            gridIndex: 1
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false
            },
            splitNumber: 2
          },
          {
            gridIndex: 1,
            splitLine: {
              show: false
            },
            splitNumber: 2
          }
        ],
        grid: [
          {
            width: '80%',
            height: '35%',
            bottom: '9%',
            left: '12%'
          },
          {
            width: '80%',
            height: '35%',
            top: '9%',
            left: '12%'
          }
        ],
        series: [
          {
            name: '接收',
            type: 'line',
            showSymbol: false,
            data: data.map(c => (c.rx_sec / 1024).toFixed(1)),
            areaStyle: {},
            itemStyle: {
              color: 'rgb(83, 90, 46)'
            },
            lineStyle: {
              color: 'rgba(136, 147, 82, 1)'
            }
          },
          {
            name: '发送',
            type: 'line',
            showSymbol: false,
            data: data.map(c => (c.tx_sec / 1024).toFixed(1)),
            xAxisIndex: 1,
            yAxisIndex: 1,
            areaStyle: {},
            itemStyle: {
              color: '#250825'
            },
            lineStyle: {
              color: '#662765'
            }
          }
        ]
      }
    },
    option_Clock_Echarts(hour, minute, second) {
      return {
        animationDurationUpdate: 300,
        series: [
          {
            radius: '90%',
            name: 'hour',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 12,
            splitNumber: 12,
            clockwise: true,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [[1, 'rgba(0,0,0,0.7)']],
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            },
            splitLine: {
              lineStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 3,
                shadowOffsetX: 1,
                shadowOffsetY: 2
              }
            },
            axisLabel: {
              fontSize: 25,
              distance: 15,
              formatter: function(value) {
                if (value === 0) {
                  return ''
                }
                return value + ''
              }
            },
            pointer: {
              icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
              width: 8,
              length: '53%',
              offsetCenter: [0, '8%'],
              itemStyle: {
                color: '#C0911F',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 3
              }
            },
            detail: {
              show: false
            },
            title: {
              offsetCenter: [0, '30%']
            },
            data: [{ value: hour }],
            animation: hour !== 0
          },
          {
            radius: '90%',
            name: 'minute',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 60,
            clockwise: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
              width: 6,
              length: '65%',
              offsetCenter: [0, '8%'],
              itemStyle: {
                color: '#C0911F',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 3
              }
            },
            anchor: {
              show: true,
              size: 15,
              showAbove: false,
              itemStyle: {
                borderWidth: 10,
                borderColor: '#C0911F',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 3
              }
            },
            detail: {
              show: false
            },
            title: {
              offsetCenter: ['0%', '-40%']
            },
            animation: minute !== 0,
            data: [{ value: minute }]
          },
          {
            radius: '90%',
            name: 'second',
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 60,
            animationEasingUpdate: 'bounceOut',
            clockwise: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
              width: 4,
              length: '80%',
              offsetCenter: [0, '8%'],
              itemStyle: {
                color: '#C0911F',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 3
              }
            },
            anchor: {
              show: true,
              size: 10,
              showAbove: true,
              itemStyle: {
                color: '#C0911F',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 3
              }
            },
            detail: {
              show: false
            },
            title: {
              offsetCenter: ['0%', '-40%']
            },
            animation: second !== 0,
            data: [{ value: second }]
          }
        ]
      }
    },
    transformation_Time(second) {
      if (!second) return '0,0,0,0'
      const nodeDays = parseInt(second / 86400)
      const nodeHours = parseInt(second % 86400 / 3600) + ''
      const nodeMinutes = parseInt(second % 86400 % 3600 / 60) + ''
      const nodeSeconds = second % 86400 % 3600 % 60 + ''
      return nodeDays + ',' + nodeHours.padStart(2, '0') + ',' + nodeMinutes.padStart(2, '0') + ',' + nodeSeconds.padStart(2, '0')
    }
  },
  computed: {
    cpuDescribe() {
      const { systemData } = this
      const fullLoad = systemData?.fullLoad?.toFixed(1) || '0.0'
      const currentLoadUser = systemData?.currentLoad?.currentLoadUser?.toFixed(1) || '0.0'
      const currentLoadSystem = systemData?.currentLoad?.currentLoadSystem?.toFixed(1) || '0.0'
      return { fullLoad, currentLoadUser, currentLoadSystem }
    },
    memDescribe() {
      const { systemData } = this
      const free = systemData.mem?.free ? (systemData.mem?.free / 1024 / 1024 / 1024).toFixed(1) : '0.0'
      const total = systemData.mem?.total ? (systemData.mem?.total / 1024 / 1024 / 1024).toFixed(1) : '0.0'
      const used = systemData.mem?.used ? (systemData.mem?.used / 1024 / 1024 / 1024).toFixed(1) : '0.0'
      return { free, total, used }
    },
    netDescribe() {
      const { systemData } = this
      if (!systemData.networkStats) return { tx_bytes: 0, rx_bytes: 0 }
      const rx_bytes = (systemData.networkStats?.rx_bytes / 1024 / 1024 / 10).toFixed(1) || '0.0'
      const tx_bytes = (systemData.networkStats?.tx_bytes / 1024 / 1024 / 10).toFixed(1) || '0.0'
      return { tx_bytes, rx_bytes }
    },
    hostNameLogofileDescribe() {
      const { systemData } = this
      const hostName = systemData?.osInfo?.hostname || '加载中...'
      const Logofile = systemData?.osInfo?.logofile || '加载中...'
      return { hostName, Logofile }
    }
  },
  mounted() {
    const browWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth - 230
    const browHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.browWidth = browWidth
    this.browHeight = browHeight
    this.$refs['cpu_Echarts'].style = `width: ${0.12 * browWidth}px;height: ${browHeight * 0.26}px`
    this.$refs['mem_Echarts'].style = `width: ${0.12 * browWidth}px;height: ${browHeight * 0.26}px`
    this.$refs['disk_Echarts'].style = `width: ${0.316 * browWidth}px;height: ${browHeight * 0.26}px`
    this.$refs['net_Echarts'].style = `width: ${0.267 * browWidth}px;height: ${browHeight * 0.39}px`
    this.$refs['clock_Echarts'].style = `width: ${0.193 * browWidth}px;height: ${browHeight * 0.39}px`
    this.cpu_Echarts = echarts.init(this.$refs['cpu_Echarts'])
    this.mem_Echarts = echarts.init(this.$refs['mem_Echarts'])
    this.disk_Echarts = echarts.init(this.$refs['disk_Echarts'])
    this.net_Echarts = echarts.init(this.$refs['net_Echarts'])
    this.clock_Echarts = echarts.init(this.$refs['clock_Echarts'])
    this.arrangument_Echarts()
    this.get_System_Opartion()
    this.system_Timer()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.sysTimer)
    this.sysTimer = null
  }
}
</script>

<style lang="less" scoped>
.sysTem {
  width: 100%;
  padding: 1.5%;
  box-sizing: border-box;
  .seconds_Threshold {
    position: relative;
    z-index: 10;
    margin-bottom: 1.5%;
    .SHButton {
      margin-right: 1%;
      padding: 10px 15px;
    }
    span {
      color: #606266;
      margin-left: 15px;
    }
    .SHInput {
      display: inline-block;
      width: 10%;
      margin-right: 0;
      .inputUi_Input {
        display: inline-block;
      }
    }
  }
  .sysTem_Echarts {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item_System {
      background: aliceblue;
      padding: 1.5% 1.5% 0px 1.5%;
      border-radius: 15px;
      margin-bottom: 2%;
      border: solid 1px rgb(228, 235, 241);
      transition: box-shadow 0.3s;
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      p {
        font-size: 14px;
        color: #303133;
        font-weight: bold;
        line-height: 16px;
        border-left: solid 3px #2d72d3;
        text-indent: 10px;
      }
      .Echarts_Describe {
        display: flex;
        align-items: center;
        position: relative;
        .cpu_Mem_Describe {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #858da1;
          padding: 1.5%;
          span {
            line-height: 26px;
            width: 115px;
            display: flex;
            justify-content: space-between;
            i {
              font-style: inherit;
            }
            strong {
              font-size: 14px;
              color: #717377;
            }
          }
        }
        .net_Describe {
          position: absolute;
          top: -15px;
          right: 22px;
          font-size: 12px;
          color: #717377;
        }
      }
      .node_Serve_Time {
        span:first-child {
          font-size: 50px;
        }
        span:last-child {
          font-size: 12px;
          color: #858da1;
          font-weight: bold;
        }
        & + div {
          margin-bottom: 10px;
          span:nth-child(2n-1) {
            font-size: 16px;
            color: #303133;
            font-weight: bold;
            padding-right: 2px;
          }
          span:nth-child(2n) {
            font-size: 12px;
            color: #717377;
            padding-right: 5px;
            font-weight: bold;
          }
        }
      }
      .hostNameLogo_System {
        margin: 15px 0px 10px;
        color: #727272;
        font-weight: bold;
      }
      ul {
        overflow: scroll;
        flex: 1;
        li {
          margin-right: 10px;
          div {
            font-size: 12px;
            color: #727272;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: 30px;
            span:last-child {
              font-size: 14px;
              color: #303133;
              font-weight: bold;
            }
          }
        }
        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #000000;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0px 0px 20px 0px #0000002b;
          background-color: #ffffff;
        }
      }
    }
  }
}
</style>
