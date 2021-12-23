<!--
 * @Author: Cxy
 * @Date: 2021-07-21 17:32:32
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-19 17:47:19
 * @FilePath: \blog\blogweb\src\components\musicInterface.vue
-->
<template>
  <div v-if="Login_Device_Code() === 'Window'" ref='music' class='music'>
    <div v-if='login_Flog' class='music_Controls' :style="recordBox ? 'backdrop-filter: blur(4px);background: #0000009c;' : ''">
      <div v-if='dailySongs[song_Index]' class='music_BG' :class="recordBox || play_Pause ? '' : 'recordRotate'" :style="{
        backgroundImage: 'url(' + dailySongs[song_Index].al.picUrl + ')',borderRadius: recordBox ? '5px' : '50%'
      }">
        <div v-show='recordBox' class='songAr'>
          <p>
            <span v-for='c in dailySongs[song_Index].ar.map((c) => c.name)' :key='c'>
              {{ c }}
            </span>
          </p>
        </div>
        <div v-show='!recordBox' class='songControl'>
          <span>
            <i v-if='play_Pause' class='fa fa-play' aria-hidden='true' @click='aud.play(), (play_Pause = !play_Pause)'/>
            <i v-else class='fa fa-pause' aria-hidden='true' @click='aud.pause(), (play_Pause = !play_Pause)'/>
          </span>
          <div class='songControl_BG' :style="{ backgroundImage: 'url(' + dailySongs[song_Index].al.picUrl + ')' }"/>
        </div>
      </div>
      <div v-else class='music_BG' :style="{ backgroundImage: 'url(' + music_Cover_NoFound + ')' }"/>
      <div v-show='login_State_Flag && recordBox' class='song_Sheet_List'>
        <span :style="{ color: daily_Push_Personal ? '#9e6835' : '#fff' }" @click='
          get_Recommend_Songs(true),
          (song_Index = 0),
          (daily_Push_Personal = true)
        '>日推</span>
        <span :style="{ color: daily_Push_Personal ? '#fff' : '#9e6835' }" @click='
          get_Personal_Fm(true),
          (song_Index = 0),
          (daily_Push_Personal = false)
        '>私人FM</span>
      </div>
      <ul v-show='recordBox'>
        <li>
          <span v-if='dailySongs[song_Index]' class='song_Name_Class' :title='dailySongs[song_Index].name'>{{ dailySongs[song_Index].name }}</span>
          <span v-else class='song_Name_Class'>加载中。。。</span>
          <i style='float: right' class='fa fa-sign-in' aria-hidden='true' @click='login_Flog = !login_Flog'/>
        </li>
        <li>
          <div>
            <span ref='progress_Bar'/>
            <span ref='progress_Block'/>
          </div>
          <div>
            <span>{{ aud_currentTime }}</span>
            <span>{{ aud_duration }}</span>
          </div>
        </li>
        <li>
          <i v-if='daily_Push_Personal' class='fa fa-backward' aria-hidden='true' @click='
            song_Index === 0
              ? (song_Index = dailySongs.length - 1)
              : song_Index--,
            get_Song_Url()
          '/>
          <i v-else class='fa fa-trash' aria-hidden='true' @click='delete_Fm_Trash'/>
          <i v-if='!daily_Push_Personal && dailySongs[song_Index]' class='fa fa-heart' :style="{
            color: like_Song_Flag ? '#9e6835' : '#fff',
          }" aria-hidden='true' @click='like_Song'/>
          <i v-if='!daily_Push_Personal && !dailySongs[song_Index]' class='fa fa-heart' aria-hidden='true'/>
          <i v-if='play_Pause' class='fa fa-play' aria-hidden='true' @click='aud.play(), (play_Pause = !play_Pause)'/>
          <i v-else class='fa fa-pause' aria-hidden='true' @click='aud.pause(), (play_Pause = !play_Pause)'/>
          <i class='fa fa-forward' aria-hidden='true' @click='next_Song()'/>
        </li>
      </ul>
    </div>
    <div v-else class='music_Login_Wrap' @mousemove.stop>
      <div class='music_Login'>
        <p class='music_Login_Top'>
          <span>{{ pwd_SH ? "注册" : "登录" }}</span>
          <span>
            <i class='fa fa-times' aria-hidden='true' @click='login_Flog = !login_Flog'/>
            <i v-if='login_State_Flag' class='fa fa-power-off' aria-hidden='true' @click='logout_Oper'/>
          </span>
        </p>
        <div v-if='qr_Phone_SH' class='qr_Login'>
          <div class='qr_Login_Main'>
            <div class='qr_BG'/>
            <div class='qr_Opration'>
              <p>扫码登录</p>
              <div class='qr_Wrap'>
                <img :src='qr_Img' alt='' >
                <div v-if='qr_Failure'>
                  <p>二维码已失效</p>
                  <SHButton @click='qr_Sweep_State(), (qr_Failure = false)'>点击刷新</SHButton>
                </div>
                <div v-if='qr_Authorization'>
                  <p>授权中，请在手机上确认</p>
                </div>
              </div>
            </div>
          </div>
          <SHButton style='width: 30%' @click='qr_Phone_SH = !qr_Phone_SH'>手机号登录</SHButton>
        </div>
        <div v-else class='phone_Login'>
          <SHForm ref='form' :rules='rules'>
            <SHInput v-model='music.phone' label='手机号' placeholder='请输入手机号' prop='phone' />
            <SHInput v-model='music.password' :label="'密' + '\xa0\xa0\xa0\xa0' + '码'" placeholder='请输入密码' prop='password' />
            <SHInput v-if='pwd_SH' v-model='music.nickname' :label="'昵' + '\xa0\xa0\xa0\xa0' + '称'" placeholder='请输入昵称' prop='nickname' />
            <div v-if='pwd_SH' class='get_Veri_Code'>
              <SHInput v-model='music.captcha' label='验证码' placeholder='请输入验证码' prop='captcha' />
              <SHButton :disabled='veri_Code_Notallow' @click='get_Veri_Code_Oper'>{{ get_Veri_Code_Massage }}</SHButton>
            </div>
            <SHButton v-if='!pwd_SH' style='width: 270px; padding: 10px 0' type='primary' @click='phone_Login_Oper'>登录</SHButton>
            <SHButton v-else style='width: 270px; padding: 10px 0' type='primary' @click='phone_Reg_Oper'>注册</SHButton>
            <div class='qr_Phone_Taggle' :style="'background-image: url(' + qr_Img + ')'" @click='(qr_Phone_SH = !qr_Phone_SH), (pwd_SH = false)'/>
          </SHForm>
        </div>
        <div v-if='!pwd_SH' class='jump_Reg_Style' @click='(qr_Phone_SH = false), (pwd_SH = true)'>
          没有帐号？免费注册 >
        </div>
        <div v-else class='jump_Reg_Style' @click='(qr_Phone_SH = false), (pwd_SH = false)'>
          手机号登录 >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  recommend_Songs,
  login_Status,
  login_Qr_Key,
  login_Qr_Create,
  captcha_Sent,
  captcha_verify,
  register_Cellphone,
  login_Cellphone,
  logout,
  login_Qr_Check,
  song_Url,
  top_Song,
  personal_Fm,
  fm_Trash,
  like,
  likelist
} from '@/http/model/music.js'
import { Login_Device_Code } from '@/until'
export default {
  data() {
    const checkPhone = (value, calLback) => {
      if (
        !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
          value
        )
      ) {
        calLback('请输入正确的手机号')
      } else {
        calLback()
      }
    }
    const checkPwd = (value, calLback) => {
      if (
        !/(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/.test(
          value
        )
      ) {
        calLback('8-20位,无空格,字母、数字、字符必须包含两种')
      } else {
        calLback()
      }
    }
    return {
      music_Cover_NoFound: require('assets/musicCover.jpg'),
      qr_Img: '', // 二维码数据
      login_State_Flag: false, // 登陆状态
      login_Flog: true, // 登录框显隐
      qr_Failure: false, // 二维码失效
      qr_Authorization: false, // 二维码授权中状态
      timer: null, // 验证二维码计时器
      aud: new Audio(), // 音乐播放器
      play_Pause: true, // 暂停、播放
      qr_Phone_SH: true, // 二维码登录切换
      pwd_SH: false, // 密码框显隐
      song_Index: 0, // 播放歌曲的下标
      dailySongs: [], // 总歌曲数据
      daily_Push_Personal: true, // 日推 私人FM
      aud_currentTime: '00:00', // 当前播放进度
      aud_duration: '00:00', // 总时间
      progress_Block_Down_Up: false, // 拖拽歌曲进度条时与Audio的updateTime隔离
      get_Veri_Code_Massage: '获取验证码',
      user_Like_List: [], // 喜欢歌曲列表
      music: {
        phone: '',
        password: '',
        nickname: '',
        captcha: ''
      },
      veri_Code_Notallow: false,
      rules: {
        phone: {
          require: { massage: '请输入手机号' },
          validator: { meth: checkPhone }
        },
        password: {
          require: { massage: '请输入密码' },
          validator: { meth: checkPwd }
        },
        nickname: {
          require: { massage: '请输入昵称' }
        },
        captcha: {
          require: { massage: '请输入验证码' }
        }
      },
      recordBox: false,
      Login_Device_Code
    }
  },
  methods: {
    /**
     * @description: 手机号注册
     */
    phone_Reg_Oper() {
      this.$refs.form.validate(async(c) => {
        if (!c) return this.$Msg('手机号、密码已更改请重新验证', 'faild')
        const check_Veri = await this.check_Veri_Code_Oper()
        if (!check_Veri) return false
        register_Cellphone({ ...this.music }).then((res) => {
          const { code, message } = res.data
          if (code === 200) {
            this.$Msg('注册成功，请输入账号密码登录', 'success')
            this.pwd_SH = false
          } else {
            this.$Msg(message, 'wran')
          }
        })
      })
    },
    /**
     * @description: 手机号登录
     */
    phone_Login_Oper() {
      this.$refs.form.validate(async(c) => {
        if (!c) return false
        const { phone, password } = this.music
        login_Cellphone({ phone, password }).then(async(res) => {
          const { code, message } = res.data
          if (code === 200) {
            this.song_Index = 0
            this.$Msg('登录成功', 'success')
            this.login_Flog = true
            this.login_State_Flag = true
            await this.get_Login_Status()
            this.daily_Push_Personal
              ? this.get_Recommend_Songs()
              : this.get_Personal_Fm()
          } else {
            this.$Msg(message, 'wran')
          }
        })
      })
    },
    /**
     * @description: 发送验证码
     */
    get_Veri_Code_Oper() {
      this.$refs.form.validate((c) => {
        if (!c) return
        const { phone } = this.music
        captcha_Sent({ phone }).then((res) => {
          const {
            data: { code },
            msg
          } = res
          if (code === 200) {
            this.count_Down()
          } else {
            this.$Msg(msg, 'wran')
          }
        })
      }, 'phone')
    },
    /**
     * @description: 验证验证码
     */
    check_Veri_Code_Oper() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async(c) => {
          if (!c) return
          const { phone, captcha } = this.music
          captcha_verify({ phone, captcha })
            .then((res) => {
              const { code, data, message } = res.data
              if (code === 200) {
                resolve(data)
              } else {
                this.$Msg(message, 'wran')
              }
            })
            .catch((err) => reject(err))
        })
      })
    },
    /**
     * @description: 获取歌曲url
     */
    get_Song_Url() {
      const { dailySongs, song_Index } = this
      song_Url({ id: dailySongs[song_Index].id }).then((res) => {
        const { code, data } = res.data
        if (code === 200) {
          this.$refs.progress_Bar.style.width = '0'
          this.aud.src = data[0].url
          this.aud.load()
        }
      })
    },
    /**
     * @description: 时间格式整理
     */
    arrangument_Time(time) {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return (
        String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0)
      )
    },
    /**
     * @description: 日推歌曲获取
     */
    get_Recommend_Songs(button_Flag) {
      if (this.daily_Push_Personal === true && button_Flag) return
      return new Promise((resolve, reject) => {
        recommend_Songs()
          .then((res) => {
            const {
              code,
              data: { dailySongs }
            } = res.data
            if (code === 200) {
              this.dailySongs = dailySongs
              this.get_Song_Url()
              resolve(true)
            }
          })
          .catch((error) => reject(error))
      })
    },
    /**
     * @description: 私人FM
     */
    get_Personal_Fm(button_Flag) {
      if (this.daily_Push_Personal === false && button_Flag) return
      personal_Fm().then((res) => {
        const { code, data } = res.data
        if (code === 200) {
          this.dailySongs = data.map((c) =>
            Object.assign({}, c, {
              al: { picUrl: c.album.picUrl },
              ar: c.album.artists,
              id: c.id
            })
          )
          this.song_Index = 0
          this.get_Song_Url()
        }
      })
    },
    /**
     * @description: 移除私人FM歌曲
     */
    delete_Fm_Trash() {
      const { dailySongs, song_Index } = this
      fm_Trash({ id: dailySongs[song_Index].id }).then((res) => {
        const { code } = res.data
        if (code === 200) {
          this.$Msg('歌曲已从私人FM中移除', 'success')
          this.next_Song()
        }
      })
    },
    /**
     * @description: 喜欢音乐
     */
    like_Song() {
      const { dailySongs, song_Index, like_Song_Flag } = this
      like({ id: dailySongs[song_Index].id, like: !like_Song_Flag }).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          this.$Msg(
            !like_Song_Flag
              ? '已添加到 我喜欢的音乐列表，登录网易云查看'
              : '已取消喜欢',
            'success'
          )
          this.get_Likelist()
        } else {
          this.$Msg(massage, 'wran')
        }
      })
    },
    /**
     * @description: 喜欢列表
     */
    get_Likelist(uid) {
      return new Promise((resolve, reject) => {
        likelist({ uid })
          .then((res) => {
            const { code, ids, massage } = res.data
            if (code === 200) {
              this.user_Like_List = ids
              resolve()
            } else {
              this.$Msg(massage, 'wran')
              resolve()
            }
          })
          .catch((err) => reject(err))
      })
    },
    /**
     * @description: 请求成功添加歌曲进度块事件
     */
    create_Progress_Block_Event() {
      const that = this
      this.$nextTick(_ => {
        const progress_Block_Dom = this.$refs.progress_Block
        progress_Block_Dom.onmousedown = (ev) => {
          const event = ev || window.event // 兼容IE浏览器
          const progress_Total_Width = event.target.parentNode.clientWidth - 8
          const progress_Bar_Width = event.target.previousSibling.clientWidth
          const progress_Block_ClientX = ev.clientX
          this.progress_Block_Down_Up = true
          document.onmousemove = (ev) => {
            let progress_Bar_List_Width =
              progress_Bar_Width + ev.clientX - progress_Block_ClientX
            if (progress_Bar_List_Width < 0) {
              progress_Bar_List_Width = 0
            }
            if (progress_Bar_List_Width > progress_Total_Width) {
              progress_Bar_List_Width = progress_Total_Width
            }
            this.$refs.progress_Bar.style.width = progress_Bar_List_Width + 'px'
            this.aud_currentTime = this.arrangument_Time(
              Math.floor(
                that.aud.duration *
                (
                  event.target.previousSibling.clientWidth /
                  progress_Total_Width
                ).toFixed(2)
              )
            )
          }
          document.onmouseup = function() {
            that.progress_Block_Down_Up = false
            that.aud.currentTime = Math.floor(
              that.aud.duration *
              (
                event.target.previousSibling.clientWidth /
                progress_Total_Width
              ).toFixed(2)
            )
            this.onmousemove = null
            this.onmouseup = null
            // 修复低版本ie bug
            if (typeof progress_Block_Dom.releaseCapture !== 'undefined') {
              progress_Block_Dom.releaseCapture()
            }
          }
        }
      })
    },
    /**
     * @description: 二维码key生成接口
     */
    get_Login_Qr_Key() {
      return new Promise((resolve, reject) => {
        login_Qr_Key()
          .then((res) => {
            const { code, data, message } = res.data
            if (code === 200) {
              resolve(data.unikey)
            } else {
              this.$Msg(message, 'wran')
            }
          })
          .catch((err) => reject(err))
      })
    },
    /**
     * @description: 二维码生成接口
     */
    async get_Login_Qr_Create() {
      const key = await this.get_Login_Qr_Key()
      return new Promise((resolve, reject) => {
        this.qr_Authorization = false
        login_Qr_Create({ key, qrimg: true })
          .then((res) => {
            const { code, data, message } = res.data
            if (code === 200) {
              this.qr_Img = data.qrimg
              resolve(key)
            } else {
              this.$Msg(message, 'wran')
            }
          })
          .catch((err) => reject(err))
      })
    },
    /**
     * @description: 扫码登录验证
     */
    login_Qr_Check_Oper(key) {
      login_Qr_Check({ key }).then(async(res) => {
        const { code, message } = res.data
        if (code === 800) {
          this.qr_Authorization = false
          this.qr_Failure = true
          clearInterval(this.timer)
          this.timer = null
        } else if (code === 803) {
          // 这一步会返回cookie
          clearInterval(this.timer)
          this.song_Index = 0
          this.timer = null
          this.$Msg('登录成功', 'success')
          this.login_Flog = true
          await this.get_Login_Status()
          this.daily_Push_Personal
            ? this.get_Recommend_Songs()
            : this.get_Personal_Fm()
          this.login_State_Flag = true
        } else if (code === 802) {
          this.qr_Authorization = true
        } else {
          this.$Msg(message, 'wran')
        }
      })
    },
    /**
     * @description: 倒计时验证码
     */
    count_Down() {
      this.veri_Code_Notallow = true
      let time = 600
      let timer = setInterval(() => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        this.get_Veri_Code_Massage =
          String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0)
        time--
        if (time === -2) {
          clearInterval(timer)
          timer = null
          this.veri_Code_Notallow = false
          this.get_Veri_Code_Massage = '获取验证码'
        }
      }, 1000)
    },
    /**
     * @description: 退出登录 长计时 直到token过期
     */
    logout_Oper() {
      logout().then((res) => {
        const { code, message } = res.data
        if (code === 200) {
          this.login_Flog = !this.login_Flog
          this.$Msg('退出登录成功', 'success')
          this.get_New_Song_List()
          this.login_State_Flag = false
        } else {
          this.$Msg(message, 'wran')
        }
      })
    },
    /**
     * @description: 二维码扫描实时刷新状态
     */
    async qr_Sweep_State() {
      this.qr_Failure = false
      const key = await this.get_Login_Qr_Create()
      this.timer = setInterval(() => {
        this.login_Qr_Check_Oper(key)
      }, 3000)
    },
    /**
     * @description: 获取新歌速递列表
     */
    get_New_Song_List() {
      top_Song().then((res) => {
        const { code, data } = res.data
        if (code === 200) {
          this.dailySongs = data.map((c) =>
            Object.assign({}, c, {
              al: { picUrl: c.album.picUrl },
              ar: c.album.artists,
              id: c.id
            })
          )
          this.create_Progress_Block_Event()
          this.get_Song_Url()
        }
      })
    },
    /**
     * @description: 下一曲
     */
    next_Song() {
      const { dailySongs, song_Index, daily_Push_Personal } = this
      if (daily_Push_Personal === false) {
        if (song_Index === dailySongs.length - 1) {
          this.song_Index = dailySongs.length
          this.get_Personal_Fm()
        } else {
          this.song_Index++
          this.get_Song_Url()
        }
        return
      } else {
        this.song_Index === dailySongs.length - 1
          ? (this.song_Index = 0)
          : this.song_Index++
        this.get_Song_Url()
      }
    },
    /**
     * @description: 获取登陆状态
     */
    get_Login_Status() {
      return new Promise((resolve, reject) => {
        login_Status()
          .then(async(res) => {
            const { code, account } = res.data.data
            if (code === 200 && account !== null) {
              await this.get_Likelist(account.id)
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch((err) => reject(err))
      })
    }
  },
  async mounted() {
    this.$nextTick(async _ => {
      const login_Information = await this.get_Login_Status()
      if (login_Information) {
        await this.get_Recommend_Songs()
        this.create_Progress_Block_Event()
        this.login_State_Flag = true
      } else {
        this.get_New_Song_List()
      }
      this.aud.oncanplay = () => {
        this.aud_duration = this.arrangument_Time(this.aud.duration)
        if (!this.play_Pause) {
          this.aud.play()
        }
      }
      this.aud.addEventListener('timeupdate', () => {
        if (this.progress_Block_Down_Up) return
        this.aud_currentTime = this.arrangument_Time(this.aud.currentTime)
        if (!this.login_Flog) return
        if (this.$refs.progress_Bar) {
          this.$refs.progress_Bar.style.width =
          (
            ((this.$refs.progress_Block.parentNode.clientWidth - 8) /
              this.aud.duration) *
            this.aud.currentTime
          ).toFixed(0) + 'px'
        }
      })
      this.aud.addEventListener('ended', () => {
        this.next_Song()
      })
      const music_Dom = this.$refs.music
      // 点击某物体时，用drag对象即可，move和up是全局区域，
      // 也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)
      const that = this
      music_Dom.onmousedown = function(ev) {
      // 为特定元素class名为music_BG可移动
        if (!ev.path.some((c) => c.className === 'music_BG' || c.className === 'music_BG recordRotate')) return
        const event = ev || window.event // 兼容IE浏览器
        //  鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
        const diffX = event.clientX - music_Dom.offsetLeft
        const diffY = event.clientY - music_Dom.offsetTop
        if (typeof music_Dom.setCapture !== 'undefined') {
          music_Dom.setCapture()
        }
        document.onmousemove = function(ev) {
          const event = ev || window.event
          let moveX = event.clientX - diffX
          let moveY = event.clientY - diffY
          if (moveX < 0) {
            that.recordBox = false
            moveX = -40
          } else if (moveX > window.innerWidth - music_Dom.offsetWidth) {
            moveX = window.innerWidth - music_Dom.offsetWidth + 210
            that.recordBox = false
          } else {
            that.recordBox = true
          }
          if (moveY < 0) {
            moveY = 20
          } else if (moveY > window.innerHeight - music_Dom.offsetHeight) {
            moveY = window.innerHeight - music_Dom.offsetHeight
          }
          music_Dom.style.left = moveX + 'px'
          music_Dom.style.top = moveY + 'px'
        }
        document.onmouseup = function() {
          this.onmousemove = null
          this.onmouseup = null
          // 修复低版本ie bug
          if (typeof music_Dom.releaseCapture !== 'undefined') {
            music_Dom.releaseCapture()
          }
        }
      }
    })
  },
  watch: {
    get_Qr_Img: async function(newV) {
      if (newV) {
        this.qr_Sweep_State()
      } else {
        this.create_Progress_Block_Event()
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  computed: {
    get_Qr_Img: function() {
      return this.qr_Phone_SH ? (!this.login_Flog) : false
    },
    like_Song_Flag: function() {
      return this.user_Like_List.some(
        (c) => c === this.dailySongs[this.song_Index].id
      )
    }
  }
}
</script>

<style lang="less" scoped>
.music {
  position: fixed;
  bottom: 0%;
  right: -205px;
  z-index: 101;
  width: 280px;
  height: 90px;
  color: rgb(255, 255, 255);
  font-size: 12px;
  border-radius: 5px;
  user-select: none;
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  .music_Controls {
    display: flex;
    border-radius: 5px;
    .music_BG {
      cursor: move;
      position: relative;
      top: -20px;
      width: 90px;
      height: 90px;
      background-position: center;
      background-size: 100%;
      background-repeat: no-repeat;
      margin-left: 10px;
      animation-fill-mode: forwards;
      .songAr {
        width: 90px;
        height: 91px;
        background-color: rgba(0, 0, 0, 0.538);
        backdrop-filter: blur(2px);
        border-radius: 5px;
        transition: 0.5s opacity;
        opacity: 0;
        font-size: 14px;
        text-align: center;
        overflow: hidden;
        position: relative;
        p {
          position: absolute;
          top: -50%;
          width: 100%;
          left: 0;
          transform: translateY(-50%);
          transition: 1s top cubic-bezier(0.19, 1, 0.22, 1);
          span {
            display: block;
            margin: 3px 0;
          }
        }
      }
      &:hover {
        .songAr {
          opacity: 1;
          p {
            top: 50%;
          }
        }
      }
      .songControl {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        color: #ffffff;
        &::before {
          content: '';
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          width: 95px;
          height: 95px;
          background: repeating-radial-gradient(
            #000000 4px,
            #000000 5px,
            #383838 7px,
            #232323 8px
          );
          border-radius: 50%;
        }
        .songControl_BG {
          width: 50px;
          height: 50px;
          background-size: cover;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
        span {
          width: 18px;
          height: 18px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          font-size: 16px;
          z-index: 1;
        }
      }
    }
    .recordRotate {
      animation: recordRotate 10s linear infinite;
      @keyframes recordRotate {
        to {
          transform: rotate(0);
        }
        from {
          transform: rotate(360deg);
        }
      }
    }
    .song_Sheet_List {
      position: absolute;
      bottom: 0px;
      left: 55px;
      transform: translateX(-50%);
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      span {
        margin: 0 8px;
        cursor: pointer;
      }
    }
    ul {
      flex: 1;
      padding: 4px 10px;
      width: 10px;
      li {
        margin: 3px 0;
        .song_Name_Class {
          display: inline-block;
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        div:first-child {
          height: 8px;
          background: #fff;
          border-radius: 4px;
          margin-bottom: 6px;
          display: flex;
          span:first-child {
            height: 100%;
            border-radius: 4px;
            background: #9e6835;
            position: relative;
            width: 0;
          }
          span:last-child {
            width: 12px;
            height: 12px;
            background: #9e6835;
            border-radius: 50%;
            margin-top: -2px;
            margin-left: -4px;
            cursor: progress;
            z-index: 1;
            transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            &:hover {
              transform: scale(1.5);
            }
          }
        }
        div:last-child {
          display: flex;
          justify-content: space-between;
          padding: 0 2px;
        }
        i {
          cursor: pointer;
          font-size: 14px;
        }
      }
      li:nth-child(2) {
        margin: 10px 0 6px 0;
      }
      li:last-child {
        display: flex;
        justify-content: space-around;
      }
    }
  }
  .music_Login_Wrap {
    position: fixed;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(1px);
    left: 0;
    top: 0;
    z-index: 100;
    .music_Login {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 530px;
      border-radius: 4px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.205);
      background: #fff;
      display: flex;
      flex-direction: column;
      text-align: center;
      .music_Login_Top {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #191919;
        border-radius: 4px 4px 0 0;
        background: #2d2d2d;
        height: 38px;
        line-height: 38px;
        padding: 0 20px;
        border-radius: 3px 3px 0 0;
        font-weight: bold;
        font-size: 14px;
        i {
          cursor: pointer;
          padding: 10px;
          transition: transform 0.2s;
          &:hover {
            transform: translateY(2px) scale(1.2);
          }
        }
      }
      .qr_Login {
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 50px 0;
        .qr_Login_Main {
          padding: 20px 0px;
          display: flex;
          justify-content: space-around;
          width: 75%;
          .qr_BG {
            background-image: url(~assets/qrImg.jpg);
            width: 125px;
            background-size: cover;
            position: relative;
            &::before {
              content: '';
              position: absolute;
              background-image: url(~assets/qrImg.jpg);
              width: 55px;
              height: 55px;
              border: #9e6835 solid 3px;
              background-position: 99.2% 5.5%;
              background-size: 600%;
              border-radius: 50%;
              top: 36px;
              right: -30px;
              background-repeat: no-repeat;
            }
          }
        }
        .qr_Opration {
          display: flex;
          flex-direction: column;
          justify-content: center;
          p:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          .qr_Wrap {
            position: relative;
            img {
              width: 160px;
              height: 160px;
            }
            div {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, 0.885);
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              p {
                width: 100%;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.8);
              }
              .SHButton {
                font-size: 12px;
                padding: 8px 12px;
                margin-top: 10px;
                background: #a08457;
                color: #fff;
              }
            }
          }
        }
      }
      .phone_Login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 50px 0;
        .SHInput {
          margin-bottom: 18px;
          width: 270px;
          margin-right: 0;
        }
        .get_Veri_Code {
          display: flex;
          justify-content: space-between;
          width: 270px;
          .SHInput {
            width: 160px;
          }
          .SHButton {
            width: 92px;
            height: 35px;
            padding: 0 10px;
          }
        }
        .qr_Phone_Taggle {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 52px;
          height: 52px;
          background-size: cover;
          cursor: pointer;
          &::after {
            content: '';
            position: absolute;
            border: solid 26px #fff;
            border-bottom: solid 26px #0000;
            border-right: solid 26px #0000;
            top: 0px;
            left: 0px;
          }
        }
      }
      .jump_Reg_Style {
        position: absolute;
        bottom: 15px;
        left: 15px;
        color: #999;
        cursor: pointer;
      }
    }
  }
}
</style>

