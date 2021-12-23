<!--
 * @Author: Cxy
 * @Date: 2021-02-27 23:04:28
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-16 18:10:19
 * @FilePath: \blog\blogweb\src\views\Home.vue
-->
<template>
  <div class='home_Wrap'>
    <div class='home_Swiper'>
      <div style='
          height: 61px;
          width: 100%;
          backdrop-filter: blur(23px);
          background: #00000052;
        '/>
      <div class='home_Swiper_Label_Wrap'>
        <div class='home_Welcome_Txt'>
          <p>欢迎到来</p>
          <p v-html='home_Poetry'/>
        </div>
        <div class='home_Swiper_Article'>
          <h2>热门文章</h2>
          <ul>
            <li v-for='(c, i) in home_Show_Data' :key='i' @click='jump_info_Blog(c.id_Article)'>
              <div :class="
                c.cover_Article || Article_Default_BG ? '' : 'skeleton_Screen'
              " :style="{
                backgroundImage:
                  'url(' + (c.cover_Article || Article_Default_BG) + ')',
              }"/>
              <div>
                <p :class="c.title_Article ? '' : 'skeleton_Screen'">
                  {{ c.title_Article }}
                </p>
                <p :class="c.id_Article ? '' : 'skeleton_Screen'">
                  {{ c.id_Article | dateFilter }}
                </p>
                <span :class="c.title_type ? '' : 'skeleton_Screen'">{{
                  c.title_type
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p style='text-align: center'>
        <i class='fa fa-angle-double-down' aria-hidden='true' @click='scroll_One_Screen'/>
      </p>
    </div>
    <div class='home_Content_Wrap'>
      <div ref='home_Content_Title' class='home_Content_Title'>
        <h2>网站概览</h2>
        <span>展示网站当前刷新页面时的一些基本的概况，登录成功后会以实时的情景进行展示</span>
      </div>
      <div class='Administration_Right_Lander_Wrap'>
        <div v-for='(c, i) in Lander_Data_Copy' :key='i' class='Administration_Right_Lander_Item width_Big'>
          <div class='Administration_Right_Lander_Bg_Wrap'>
            <i class='fa' :class='c.icon' aria-hidden='true'/>
          </div>
          <div class='Administration_Right_Lander_Nm'>
            <p v-if="c.code === 'ON_LINE'">{{ ON_LINE }}+</p>
            <p v-else-if="c.code === 'ARTICLE_COUNT'">{{ ARTICLE_COUNT }}+</p>
            <p v-else>{{ VISITS }}+</p>
            <span>{{ c.txt }}</span>
          </div>
        </div>
      </div>
      <div class='label_Weather_Title'>
        <div class='home_Content_Title'>
          <h2>标签速览</h2>
          <span>根据标签的囊括文章数量及标签的访问量展示</span>
        </div>
        <div class='home_Content_Title'>
          <h2>本地天气</h2>
          <span>根据定位信息展现本地天气亦可选择其他地区</span>
        </div>
      </div>
      <div class='label_Content'>
        <div ref='label_Content_Left' class='label_Content_Left'/>
        <div v-if='now_Weather' class='home_Weather'>
          <div class='weather_Current_Conditions'>
            <div class='home_Weather_City'>
              <p>
                <span>{{ current_Position }}</span>
                <span>{{ now_Weather.text }}</span>
              </p>
              <i class='fa fa-street-view' aria-hidden='true' @click="window.open('https://www.qweather.com')"/>
            </div>
            <div class='home_Weather_Temp'>
              <s :class="'qi-' + now_Weather.icon + '-fill'" />
              <p>
                <span>{{ now_Weather.temp }}</span>
                <span>℃</span>
              </p>
              <p v-if='FiveDay_Weather[0]'>
                <span>
                  <i class='fa fa-angle-double-up' aria-hidden='true'/>
                  {{ FiveDay_Weather[0].tempMax }}
                </span>
                <span>
                  <i class='fa fa-angle-double-down' aria-hidden='true'/>
                  {{ FiveDay_Weather[0].tempMin }}
                </span>
              </p>
            </div>
            <div class='home_Weather_other'>
              <span>
                <i class='fa fa-tint' aria-hidden='true'/>{{ now_Weather.humidity + "%" }}
              </span>
              <span>
                <i class='fa fa-flag' aria-hidden='true'/>
                {{ now_Weather.windScale + "kmh" }}
              </span>
              <span>
                <i class='fa fa-cloud' aria-hidden='true'/>{{ now_Weather.cloud + "%" }}
              </span>
            </div>
          </div>
          <div class='home_Weather_Summary'>
            <div v-if='FiveDay_Weather[0]' class='sun_Rise_Set'>
              <div class='sun_Rise_Set_Item'>
                <div class='sun_Rise'/>
                <span>{{ FiveDay_Weather[0].sunrise }}</span>
              </div>
              <div class='sun_Rise_Set_Item'>
                <div class='sun_Set'/>
                <span>{{ FiveDay_Weather[0].sunset }}</span>
              </div>
              <div class='sun_Rise_Set_Item'>
                <i class='fa fa-leaf' aria-hidden='true'/>
                <span>{{ now_Weather.category }}</span>
              </div>
              <div class='sun_Rise_Set_Item'>
                <i class='fa fa-umbrella' aria-hidden='true'/>
                <span>{{ FiveDay_Weather[0].uvIndex }}</span>
              </div>
            </div>
            <ul v-if='FiveDay_Weather' class='home_Weather_FiveDay'>
              <li v-for='(c, i) in FiveDay_Weather.filter((c, i) => i !== 0)' :key='i'>
                <span>{{ c.tempMin + "°/" + c.tempMax + "°" }}</span>
                <div class='home_Weather_FiveDay_Icon'>
                  <s :class="'qi-' + c.iconDay + '-fill'" />
                  <s :class="'qi-' + c.iconNight + '-fill'" />
                </div>
                <span>{{ c.fxDate.slice(-5) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class='home_Content_Title'>
        <h2>文章浏览</h2>
        <span>根据可选条件随机展示网站部分文章及内容</span>
      </div>
      <div class='home_Content'>
        <div class='home_Content_Left'>
          <div v-for='c in Article_Data_Total' :key='c._id' class='home_Content_Left_Item'>
            <div class='home_Content_Left_Item_Move_Wrap'>
              <div class='home_Content_Left_Item_Move'>
                <div class='home_Content_Left_Item_BG' :style="{
                  backgroundImage:
                    'url(' + (c.cover_Article || Article_Default_BG) + ')',
                }"/>
                <div class='home_Content_Left_Item_Title'>
                  {{ c.title_Article }}
                </div>
                <div class='home_Swiper_Label_Item_Artical_Tag'>
                  <span v-for='cc in c.label_Article' :key='cc._id' :style='{
                    backgroundColor: set_Tag_Coloring(cc)}'>
                    {{ cc.Tag_Name }}
                  </span>
                </div>
                <div class='home_Content_Left_Item_Content
                markdown-body markdown-body-none-img' @click='jump_info_Blog(c.id_Article)' v-html='c.html_Article'/>
              </div>
              <div class='home_Swiper_Label_Item_Artical_Date'>
                <i class='fa fa-calendar-check-o' aria-hidden='true'/>
                {{ c.created_At | dateFilter }}
                <i class='fa fa-folder-open' aria-hidden='true'/>
                {{ c.Views_Article }}
                <i class='fa fa-star' aria-hidden='true'/>
                {{ c.like_Article }}
              </div>
            </div>
          </div>
          <div class='home_Content_Left_Item_Bottom' @click="$router.push({ name: 'Blog' })">
            更多文章
          </div>
        </div>
        <div class='home_Content_Right'>
          <div class='home_Content_Right_About'>
            <div class='home_Content_Right_About_Font'>
              <p>关于</p>
            </div>
            <div class='home_Content_Right_About_BG_Wrap'>
              <div class='home_Content_Right_About_BG'/>
            </div>
          </div>
          <div class='home_Content_Right_Lable'>
            <div class='home_Content_Right_Lable_Font'>
              <p>文章标签</p>
            </div>
            <div class='home_Swiper_Label_Item_Artical_Tag'>
              <span v-for='c in Article_Tag_Total' :key='c._id' :class="Tag_Flag_Background_id === c.Tag_Name ? '' : 'active_Tag_Name'" :style="'background:' + c.tag_Color" @click='get_Element_Blog_Data(c)'>
                {{ c.Tag_Name }}
                <i>{{ c.sort_ArticelTag }}</i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <SHTab v-model='active_Tab' @tabClick='tabClick'>
        <SHTabPane name='_id'>最新的</SHTabPane>
        <SHTabPane name='Views_Article'>观看最多</SHTabPane>
        <SHTabPane name='like_Article'>喜欢最多</SHTabPane>
      </SHTab>
      <div class='home_Most_Show'>
        <figure v-for='c in article_Like_New_Data' :key='c._id' class='home_Watch_More'>
          <div class='home_Watch_More_BG' :style="{
            backgroundImage:
              'url(' + (c.cover_Article || Article_Default_BG) + ')',
          }"/>
          <figcaption>
            <p class='home_Swiper_Label_Item_Artical_Tag'>
              <span v-for='cc in c.label_Article' :key='cc._id' :style='{
                backgroundColor: set_Tag_Coloring(cc)}'>
                {{ cc.Tag_Name }}
              </span>
            </p>
            <div class='home_Watch_More_Date'>
              <i class='fa fa-calendar-check-o' aria-hidden='true'/>
              {{ c.created_At | dateFilter }}
              <i class='fa fa-folder-open' aria-hidden='true'/>
              {{ c.Views_Article }}
              <i class='fa fa-star' aria-hidden='true'/>
              {{ c.like_Article }}
            </div>
            <div class='home_Watch_More_Html markdown-body markdown-body-none-img' @click='jump_info_Blog(c.id_Article)' v-html='c.html_Article'/>
          </figcaption>
          <h3 class='text-overlay'>{{ c.title_Article }}</h3>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { article_Find_New_Like, home_Page_Statistics, home_Page_Statistics_Num, random_To_Articles } from '@/http/model/article.js'
import * as echarts from 'echarts/core'
import '@/until/wordcloud.min.js'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TooltipComponent
} from 'echarts/components'
echarts.use([
  GraphChart,
  CanvasRenderer,
  TooltipComponent
])
export default {
  data() {
    return {
      home_Show_Data: [],
      article_Like_New_Data: [],
      Tag_Flag_Background_id: '', // 判断当前点击标签
      Article_Data_Total: [],
      window,
      Lander_Data_Copy: [],
      ON_LINE: 0, // 在线人数
      VISITS: 0, // 网站访问量
      ARTICLE_COUNT: 0, // 文章总数
      active_Tab: '_id',
      myChartGra: null
    }
  },
  methods: {
    ...mapActions('article', ['Article_Tag_Find']),
    ...mapMutations(['jump_info_Blog']),
    scroll_One_Screen() {
      /**
       * @description: VUE自带锚点移动方法
       * @param {*} behavior 定义过渡动画
       * @param {*} block  定义垂直对齐
       * @param {*} inline  定义水平对齐方式
       */
      document.querySelector('.home_Content_Title').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      })
    },
    tabClick(name) {
      article_Find_New_Like({ name }).then(res => {
        const { code, massage, data } = res.data
        if (code === 200) {
          this.article_Like_New_Data = data.data
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    article_Find_New_Like_Data() {
      home_Page_Statistics().then((res) => {
        const { code, massage, data } = res.data
        if (code === 200) {
          this.home_Show_Data = data.data
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    home_Page_Statistics_Opar() {
      home_Page_Statistics_Num().then(res => {
        const { code, massage, data } = res.data
        if (code === 200) {
          this.call_Move_Num_Plus(data.data || [])
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    call_Move_Num_Plus(data) {
      const iconData = ['fa-dribbble', 'fa-book', 'fa-laptop']
      const txtData = ['在线人数', '文章总数', '网站浏览量']
      data.forEach((c, i) => {
        c.icon = iconData[i]
        c.txt = txtData[i]
        this.Move_Num_Plus(c.countNum, c.code)
      })
      this.Lander_Data_Copy = data
    },
    Move_Num_Plus(totle, code) {
      this[code + 'timer'] = setInterval(
        () => {
          if (this[code] < totle) {
            this[code] += totle >= 300 ? Math.floor(totle / 300) : 1
          } else {
            this[code] = totle
            clearInterval(this[code + 'timer'])
          }
        },
        totle >= 300 ? 10 : Math.floor(3000 / totle)
      )
    },
    get_Element_Blog_Data(c) {
      if (this.Tag_Flag_Background_id === c.Tag_Name) return false
      this.Tag_Flag_Background_id = c.Tag_Name
      const params = {
        termTag: c.Tag_Name,
        size: 6
      }
      random_To_Articles(JSON.stringify(params)).then((res) => {
        const { code, massage, data } = res.data
        if (code === 200) {
          this.Article_Data_Total = data.data
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    opation_Gra_Echarts() {
      const { myChartGra, Article_Tag_Total } = this
      const optionChart = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(50,50,50,0.7)',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: '文章标签',
          type: 'wordCloud',
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          rotationRange: [0, 0],
          gridSize: 20,
          sizeRange: [16, 90],
          data: Article_Tag_Total.map(c => {
            c.name = c.Tag_Name
            c.value = c.sort_ArticelTag
            return c
          }),
          textStyle: {
            // fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function({ data: { tag_Color }}) {
              return tag_Color
            },
            shadowBlur: 10,
            shadowColor: '#000'
          },
          emphasis: {
            focus: 'self',

            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          }
        }]
      }
      console.log(this.Article_Tag_Total)
      myChartGra.setOption(optionChart)
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    ...mapState('article', ['Article_Tag_Total', 'Article_Default_BG']),
    ...mapState('mixed', [
      'current_Position',
      'FiveDay_Weather',
      'now_Weather_Day_Night',
      'now_Weather',
      'air_Weather',
      'home_Poetry'
    ]),
    ...mapState('admin', ['Lander_Data']),
    set_Tag_Coloring() {
      return (cc) => {
        return this.Article_Tag_Total.find((i) => i.Tag_Name === cc.Tag_Name)?.tag_Color || ''
      }
    }
  },
  watch: {
    Lander_Data: {
      handler(newV) {
        if (newV.length > 0) this.call_Move_Num_Plus(newV)
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    await this.Article_Tag_Find()
    this.get_Element_Blog_Data({})
    this.article_Find_New_Like_Data()
    if (!this.Users.admin_Code) this.home_Page_Statistics_Opar()
    this.myChartGra = echarts.init(this.$refs.label_Content_Left)
    this.opation_Gra_Echarts()
    this.myChartGra.on('click', ({ data: { Tag_Name }}) => {
      this.$router.push({ name: 'Blog', params: { Tag_Name }})
    })
  }
}
</script>

<style lang="less" scoped>
.home_Wrap {
  width: 100%;
  margin-top: -61px;
  .home_Swiper {
    width: 100%;
    height: calc(~'100vh - 30px');
    position: relative;
    color: #fff;
    .home_Swiper_Label_Wrap {
      width: 82%;
      height: calc(100vh - 140px);
      margin: 0 9%;
      padding: 14vh 0 10vh 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      font-size: 14px;
      .home_Welcome_Txt {
        flex: 1;
        margin-right: 180px;
        align-self: flex-end;
        p {
          font-size: 40px;
          line-height: 60px;
        }
      }
      .home_Swiper_Article {
        width: 27%;
        height: 360px;
        backdrop-filter: blur(4px);
        background: rgba(0, 0, 0, 0.13);
        padding: 20px;
        display: flex;
        flex-direction: column;
        h2 {
          margin-bottom: 20px;
        }
        ul {
          flex: 1;
          display: flex;
          flex-direction: column;
          li {
            display: flex;
            flex: 1;
            margin-bottom: 20px;
            background: #0000004d;
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            &:hover {
              transform: scale(1.1);
            }
            div:first-child {
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              width: 35%;
              height: 100%;
              margin-right: 20px;
            }
            div:last-child {
              flex: 1;
              position: relative;
              padding: 10px 0;
              p:first-child {
                line-height: 1.4;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                width: 97%;
                height: 40px;
                & + p {
                  font-size: 10px;
                  position: absolute;
                  bottom: 10px;
                  height: 12px;
                }
              }
              span {
                font-size: 10px;
                position: absolute;
                right: 0;
                bottom: 0;
                background: #b8986549;
                padding: 2px 5px;
                border-radius: 5px 0 0 0;
              }
            }
          }
          li:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    i {
      font-size: 40px;
      animation-name: home_Swiper_i;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
      cursor: pointer;
      @keyframes home_Swiper_i {
        0% {
          transform: translateY(0) scaleX(1.2);
        }
        100% {
          transform: translateY(8px) scaleX(1.5);
        }
      }
    }
  }
  .home_Content_Wrap {
    width: 100%;
    .home_Content_Title {
      padding: 70px 0 30px 0;
      letter-spacing: 2px;
      font-weight: 500;
      color: #595959;
      text-align: center;
      font-size: 22px;
      span {
        font-size: 12px;
        padding-top: 15px;
        display: inline-block;
        margin-top: 15px;
      }
    }
    .Administration_Right_Lander_Wrap {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 160px;
      padding: 0 2%;
      box-sizing: border-box;
      .Administration_Right_Lander_Item {
        width: 30%;
        text-align: center;
        position: relative;
        opacity: 0;
        &::before {
          position: absolute;
          content: '';
          right: -25px;
          top: 0px;
          width: 1px;
          height: 100%;
          border-right: 1px dashed rgba(64, 64, 64, 0.5);
        }
        .Administration_Right_Lander_Bg_Wrap {
          height: 64px;
          width: 100%;
          margin-bottom: 25px;
          i {
            font-size: 84px;
            color: #979797;
          }
        }
        .Administration_Right_Lander_Nm {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-weight: 500;
          color: #32297b;
          font-family: 'Lucida Console', 'Courier New', monospace;
          p {
            line-height: 1em;
            font-size: 45px;
          }
          span {
            color: #222222;
            font-size: 18px;
            font-weight: 500;
            margin-top: 5px;
            text-transform: uppercase;
          }
        }
      }
      div:last-child {
        &::before {
          border: 0;
        }
      }
      .width_Big {
        animation-duration: 3s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
        animation-name: width_Big_An;
      }
      @keyframes width_Big_An {
        0% {
          opacity: 0;
          transform: translateX(-30px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
    .home_Swiper_Label_Item_Artical_Tag {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      span {
        display: inline-block;
        color: #fff;
        padding: 4px 12px;
        text-align: center;
        font-size: 12px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      }
      .active_Tag_Name {
        background: #ecf5ff !important;
        color: #409eff;
      }
    }
    .home_Swiper_Label_Item_Artical_Date {
      position: absolute;
      bottom: 10px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #676767;
      .fa {
        margin-left: 10px;
      }
      .fa:first-child {
        margin-left: 0;
      }
    }
    .label_Weather_Title {
      display: flex;
      padding: 0 10%;
      justify-content: space-between;
      .home_Content_Title:first-child{
        width: 60%;
      }
      .home_Content_Title:last-child{
        width: 36%;
      }
    }
    .label_Content {
      width: 100%;
      height: 35vh;
      padding: 0 10%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .label_Content_Left {
        width: 60%;
        height: 100%;
        background-color: #fff;
        border-radius: 10px;
      }
      .home_Weather {
        color: #606060;
        height: 100%;
        width: 36%;
        overflow: hidden;
        position: relative;
        background: rgb(255, 255, 255);
        border-radius: 10px;
        font-size: 14px;
        .weather_Current_Conditions {
          width: 100%;
          height: 100%;
          padding: 25px;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          animation: Current_Conditions 8s cubic-bezier(0.9, 0.01, 0.01, 0.9)
            infinite;
          @keyframes Current_Conditions {
            0% {
              top: 0;
            }
            12.5% {
              top: -100%;
              opacity: 1;
            }
            13.5% {
              top: -100%;
              opacity: 0;
            }
            14.5% {
              top: 100%;
              opacity: 0;
            }
            50% {
              top: 100%;
              opacity: 1;
            }
            62.5% {
              top: 0;
            }
            100% {
              top: 0;
            }
          }
          .home_Weather_City {
            display: flex;
            justify-content: space-between;
            p {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              span:first-child {
                font-size: 22px;
                font-weight: bold;
                color: rgb(0, 0, 0);
              }
              span:last-child {
                margin-top: 6px;
                font-size: 14px;
              }
            }
            i {
              font-size: 16px;
              cursor: pointer;
            }
          }
          .home_Weather_Temp {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: solid 1px rgba(121, 121, 121, 0.416);
            padding-bottom: 18px;
            s {
              font-size: 60px;
              color: #ffd371;
            }
            s + p {
              display: flex;
              align-items: center;
              height: 40px;
              span:first-child {
                font-size: 60px;
                color: #000;
                font-weight: bold;
              }
              span:last-child {
                align-self: flex-start;
                font-size: 16px;
              }
            }
            p:last-child {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              height: 100%;
              font-size: 16px;
            }
          }
          .home_Weather_other {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            i {
              margin-right: 10px;
            }
          }
        }
        .home_Weather_Summary {
          width: 100%;
          height: 100%;
          padding: 25px;
          box-sizing: border-box;
          position: absolute;
          top: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          animation: Weather_FiveDay 8s cubic-bezier(0.9, 0.01, 0.01, 0.9)
            infinite;
          @keyframes Weather_FiveDay {
            0% {
              top: 100%;
            }
            12.5% {
              top: 0;
            }
            50% {
              top: 0;
            }
            62.5% {
              top: -100%;
              opacity: 1;
            }
            63.5% {
              top: -100%;
              opacity: 0;
            }
            100% {
              top: 100%;
              opacity: 0;
            }
          }
          .sun_Rise_Set {
            display: flex;
            justify-content: space-around;
            padding-bottom: 40px;
            border-bottom: solid 1px rgba(121, 121, 121, 0.416);
            margin: 0 10px 0px;
            .sun_Rise_Set_Item {
              display: flex;
              align-items: center;
              .sun_Rise,
              .sun_Set {
                width: 26px;
                height: 26px;
                background-size: cover;
                background-repeat: no-repeat;
                margin-right: 10px;
              }
              .sun_Rise {
                background-image: url(~assets/css/sunrise.svg);
              }
              .sun_Set {
                background-image: url(~assets/css/sunset.svg);
              }
              i {
                margin-right: 10px;
                font-size: 20px;
              }
            }
          }
          .home_Weather_FiveDay {
            display: flex;
            justify-content: space-between;
            text-align: center;
            align-items: center;
            margin: 0 10px;
            .home_Weather_FiveDay_Icon {
              s {
                font-size: 12px;
                margin: 10px 4px;
                color: #ffd371;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .home_Content {
      width: 100%;
      padding: 0 10%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .home_Content_Left {
        width: 72%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        min-height: 580px;
        .home_Content_Left_Item {
          width: 48%;
          height: 325px;
          background: #ffffff;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 15px;
          position: relative;
          box-shadow: 1px 1px 7px 0px #00000014;
          margin-bottom: 35px;
          .home_Content_Left_Item_Move_Wrap {
            width: 100%;
            height: 94%;
            overflow: hidden;
            .home_Content_Left_Item_Move {
              width: 100%;
              height: 100%;
              transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s;
              .home_Content_Left_Item_BG {
                width: 100%;
                height: 60%;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                border-radius: 10px;
                transition: all 0.5s;
                transform: scale3d(1, 1, 1);
              }
              .home_Content_Left_Item_Title {
                font-weight: bold;
                background-clip: text;
                font-size: 18px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-top: 10px;
                font-family: 'Roboto Slab', serif;
                color: #000000;
              }
              .home_Swiper_Label_Item_Artical_Tag {
                span {
                  margin: 5px 5px 5px 0;
                }
              }
              .home_Content_Left_Item_Content {
                color: #5a5a5a;
                font-size: 12px;
                cursor: pointer;
                overflow: auto;
                height: 72%;
                /deep/ pre {
                  background: rgba(0, 0, 0, 0);
                  .hljs {
                    background: rgba(0, 0, 0, 0);
                    color: #252525;
                  }
                }
              }
            }
          }
          &:hover .home_Content_Left_Item_Move {
            transform: translate3d(0, -55%, 0);
            .home_Content_Left_Item_BG {
              transform: scale3d(1, 0, 0) translate3d(-110%, 0, 0);
            }
          }
        }
        .home_Content_Left_Item_Bottom {
          width: 100%;
          height: 25px;
          line-height: 25px;
          text-align: center;
          color: #595959;
          background: #ffffff;
          border-radius: 10px;
          padding: 1% 0;
          cursor: pointer;
          box-shadow: 1px 1px 7px 0px #00000014;
          font-weight: bold;
        }
      }
      .home_Content_Right {
        height: 695px;
        width: 25%;
        box-sizing: border-box;
        position: sticky;
        top: 60px;
        box-shadow: 1px 1px 7px 0px #00000014;
        background: #fff;
        padding: 10px 20px;
        .home_Content_Right_About {
          width: 100%;
          height: 235px;
          border-radius: 10px;
          .home_Content_Right_About_Font {
            height: 55px;
            font-size: 24px;
            color: #6c4200;
            display: flex;
            align-items: center;
            font-weight: 900;
            letter-spacing: 2px;
          }
          .home_Content_Right_About_BG_Wrap {
            width: 100%;
            height: 165px;
            background: #241600e8;
            margin-top: 0;
            .home_Content_Right_About_BG {
              height: 100%;
              width: 100%;
              background: url(~assets/logo/businessCard.png) no-repeat center;
              background-size: 100%;
            }
          }
        }
        .home_Content_Right_Lable {
          width: 100%;
          height: 280px;
          border-radius: 10px;
          .home_Content_Right_Lable_Font {
            height: 50px;
            font-size: 24px;
            color: #6c4200;
            display: flex;
            align-items: center;
            font-weight: 900;
            letter-spacing: 2px;
          }
          .home_Swiper_Label_Item_Artical_Tag {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            overflow-y: scroll;
            max-height: 75%;
            &::-webkit-scrollbar {
              width: 5px; /*对垂直流动条有效*/
              height: 0px; /*对水平流动条有效*/
            }
            span {
              margin: 8px 15px 4px 0;
              padding: 6px 18px;
              font-size: 12px;
              position: relative;
              i {
                background: #000000;
                position: absolute;
                right: -8px;
                top: -6px;
                border-radius: 20% 20% 50% 50%;
                font-size: 12px;
                width: 20px;
                text-align: center;
                font-style: inherit;
                line-height: 18px;
                height: 20px;
                color: #fff;
              }
            }
          }
        }
      }
    }
    .TabsUi {
      width: 80%;
      margin: 20px 10% 0px 10%;
    }
    .home_Most_Show {
      width: 80%;
      margin: 20px 10% 0px 10%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .home_Watch_More {
        background-color: #000;
        color: #fff;
        display: inline-block;
        overflow: hidden;
        position: relative;
        width: 31.5%;
        height: 255px;
        border-radius: 10px;
        margin: 0;
        margin-bottom: 30px;
        * {
          box-sizing: border-box;
          transition: all 0.45s ease;
        }
        &:before,
        &:after {
          background-color: rgba(0, 0, 0, 0.4);
          border-top: 35px solid rgba(0, 0, 0, 0.599);
          border-bottom: 35px solid rgba(0, 0, 0, 0.599);
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          content: '';
          transition: all 0.3s ease;
          z-index: 1;
          opacity: 0;
          transform: scaleY(2);
        }
        &:hover:before,
        &:hover:after {
          transform: scale(1);
          opacity: 1;
        }
        .home_Watch_More_BG {
          vertical-align: top;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        figcaption {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          align-items: center;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0;
          z-index: 2;
          transition-delay: 0.1s;
          padding: 40px 10px;
          p {
            justify-content: center;
            margin-bottom: 5px;
            span {
              text-transform: uppercase;
              transition: all 500ms ease;
              margin: 0 5px 5px 0;
              font-weight: 500;
              padding: 2px 10px;
            }
          }
          h3 {
            font-size: 26px;
            font-family: sans-serif;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 18px 0;
          }
          .home_Watch_More_Date {
            font-size: 12px;
            i {
              margin-left: 20px;
            }
          }
          .home_Watch_More_Html {
            color: #fff;
            margin-top: 10px;
            overflow: auto;
            cursor: pointer;
            font-size: 14px;
            flex: 1;
            width: 100%;
            /deep/ pre {
              background: rgba(0, 0, 0, 0);
              .hljs {
                background: rgba(0, 0, 0, 0);
              }
            }
            /*pre定义滚动条的轨道颜色、内阴影及圆角*/
            ::-webkit-scrollbar-track {
              box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
              background-color: #ffffff;
            }
            /* pre定义滑块颜色、内阴影及圆角 */
            ::-webkit-scrollbar-thumb {
              background-color: #000000;
            }
          }
        }
        &:hover {
          img {
            opacity: 0.7;
          }
          figcaption {
            opacity: 1;
          }
        }
        .text-overlay {
          position: absolute;
          top: 5%;
          left: 0;
          padding: 15px;
          font-size: 16px;
          font-weight: 500;
          color: white;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(14px) brightness(80%);
          letter-spacing: 1px;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .home_Wrap {
    .home_Swiper {
      .home_Swiper_Label_Wrap {
        width: 90%;
        margin: 0 5%;
        .home_Welcome_Txt {
          display: none;
        }
        .home_Swiper_Article {
          width: 100%;
        }
      }
    }
    .home_Content_Wrap {
      .Administration_Right_Lander_Wrap {
        height: 100px;
        width: 100%;
        .Administration_Right_Lander_Item {
          width: 33%;
          &::before {
            right: 0;
          }
          .Administration_Right_Lander_Bg_Wrap {
            height: 40px;
            i {
              font-size: 50px;
            }
          }
          .Administration_Right_Lander_Nm {
            p {
              font-size: 26px;
            }
          }
        }
      }
      .home_Content {
        flex-direction: column;
        padding: 0 5%;
        .home_Content_Left {
          width: 100%;
          flex-direction: column;
          .home_Content_Left_Item {
            width: 100%;
          }
        }
        .home_Content_Right {
          width: 100%;
          margin-top: 30px;
        }
      }
      .home_Most_Show {
        width: 90%;
        margin: 20px 5% 0px 5%;
        .home_Watch_More {
          width: 100%;
          height: 20 0px;
        }
      }
    }
  }
}
</style>
