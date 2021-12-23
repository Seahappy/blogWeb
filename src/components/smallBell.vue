<!--
 * @Author: Cxy
 * @Date: 2021-05-25 17:49:02
 * @LastEditors: Cxy
 * @LastEditTime: 2021-11-15 17:17:31
 * @FilePath: \blog\blogweb\src\components\smallBell.vue
-->
<template>
  <div ref='smallbell'>
    <i v-if='massage_Num > 0 && !chat_ShowH' class='fa fa-bell' width='30px' height='33px' viewBox='0 0 50 54' aria-hidden='true'
       @click='Chat_Box_SH'/>
    <span v-if='massage_Num > 0 && !chat_ShowH' class='massage_Num_Icon'>{{
      massage_Num > 99 ? "..." : massage_Num
    }}</span>
    <div v-if='chat_ShowH' class='chat_Mask'>
      <div class='chat_Wrap'>
        <div class='chat_Content'>
          <div class='chat_People' :style="{
            width: Smallbell_SB ? '20%' : Chact_People_SH ? '50%' : '0',
          }">
            <div class='chat_Oneself'>
              <SHImage v-if='Users.head_Portrait' class='head_Portrait_Img' :src='Users.head_Portrait' />
              <i v-else class='fa fa-user-circle' aria-hidden='true'/>
              <div>
                <p>
                  {{ Users.nick_Name || Users.admin_Code }}
                </p>
                <p>
                  <i class='fa' :class="audIconHD ? 'fa-bell-o' : 'fa-bell-slash-o'" aria-hidden='true' :style="{
                    backgroundColor: audIconHD ? '#005c00' : '#b20000',
                  }" @click='mute_Aud()'/>
                  <i v-if='Login_Device_Code(true)' class='fa' :class="
                    voice_Announcements
                      ? 'fa-microphone'
                      : 'fa-microphone-slash'
                  " aria-hidden='true' :style="{
                    backgroundColor: voice_Announcements
                      ? '#005c00'
                      : '#b20000',
                  }" @click='voice_Announcements = !voice_Announcements'/>
                </p>
              </div>
            </div>
            <div v-show='Chact_People_SH' class='chat_People_List_Wrap'>
              <div v-for='(c, i) in Object.keys(chat_data)' :key='i' class='chat_People_List' :class="
                active_Table_List === c ? 'Active_Chat_People_List' : ''
              " @click='open_Chat_List(c)'>
                <p>
                  <span style='font-size: 16px; color: #000' :style="{
                    color:
                      chat_data[c].online_Offline === 1 ? '#000' : '#767676',
                  }">{{
                    chat_data[c].receive_People_Data.nick_Name || c
                  }}</span>
                  <span style='float: right; line-height: 20px'>{{
                    chat_data[c].chat_Content.length !== 0
                      ? $options.filters.dateFilter(
                        chat_data[c].chat_Content[
                          chat_data[c].chat_Content.length - 1
                        ].Sending_Time,
                        "APM"
                      )
                      : ""
                  }}</span>
                </p>
                <p v-if='chat_data[c].chat_Content.length > 0'>
                  {{
                    chat_data[c].chat_Content[
                      chat_data[c].chat_Content.length - 1
                    ].chat_Content
                  }}
                </p>
                <p v-else/>
              </div>
            </div>
          </div>
          <div class='chat_Massage' :style="{
            width: Smallbell_SB ? '80%' : Chact_People_SH ? '50%' : '100%',
          }">
            <p>
              <span v-if='!Smallbell_SB' style='float: left; position: relative; left: 10px' @click='Chact_People_SH = !Chact_People_SH'>{{ Chact_People_SH ? "⬅" : "➡" }}</span>
              {{
                chat_Content_Data.receive_People_Data.nick_Name ||
                  chat_Content_Data.receive_People_Data.admin_Code
              }}
              <span style='font-size: 12px; color: #7e7e7e'>
                <i v-if='
                  chat_data[chat_Content_Data.receive_People_Data.admin_Code]
                    .online_Offline === 1
                ' class='fa' :class='
                  device_List[
                    chat_data[
                      chat_Content_Data.receive_People_Data.admin_Code
                    ].Login_Device
                  ]
                ' aria-hidden='true'>
                  在线</i>
                <span v-else>离线</span>
              </span>
              <SHButton type='primary' @click.prevent='Close_Chat_Box()'>×</SHButton>
            </p>
            <ul ref='chat'>
              <li v-for='(c, i) in chat_Content_Data.chat_Content' :key='i' :class="c.send_Receive === 2 ? 'even' : 'odd'">
                <SHImage class='head_Portrait_Img' title='头像' :src='(c.send_Receive === 2 ? chat_data[active_Table_List].receive_People_Data.head_Portrait : Users.head_Portrait)' />
                {{ c.chat_Content }}
              </li>
            </ul>
            <p>
              <input v-model='chat_Content' type='text' placeholder='请输入发送的内容' @keydown.enter='chact_Send()' >
              <SHButton type='primary' @click.prevent='chact_Send()'>发送</SHButton>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Login_Device_Code, bus } from '@/until'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      chat_data: {},
      chat_ShowH: false,
      chat_Content: '', // 聊天内容
      chat_Content_Data: [], // 聊天记录展示
      massage_Num: 0,
      active_Table_List: '',
      Chact_People_SH: true,
      Smallbell_SB: true,
      device_List: {
        Android: 'fa-android',
        Ios: 'fa-apple',
        Window: 'fa-windows'
      },
      voice_Announcements: true, // 语音播报开关
      Login_Device_Code
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    ...mapState('admin', [
      'Users_Chat_Content',
      'Lander_Data',
      'aud',
      'audIconHD'
    ]),
    ...mapGetters('admin', ['mute_Aud'])
  },
  methods: {
    // 点击聊天左侧联系人
    open_Chat_List(c) {
      this.chat_Content_Data = this.chat_data[c]
      this.Chat_Window()
      this.active_Table_List = c
    },
    // 发送消息
    chact_Send() {
      const {
        chat_Content_Data: { receive_People_Data },
        chat_Content,
        Users: { admin_Code, nick_Name, head_Portrait }
      } = this
      if (chat_Content === '') return this.$Msg('请输入内容', 'wran')
      const chat_Content_Time = {
        chat_Content,
        Sending_Time: new Date().getTime(),
        send_Receive: 1
      }
      this.chat_data[receive_People_Data.admin_Code].chat_Content.push(
        chat_Content_Time
      )
      this.Chat_Window()
      const send_People_Data = {
        admin_Code,
        Login_Device: Login_Device_Code(),
        nick_Name,
        head_Portrait
      }
      this.SK.emit('send_Message_Data', {
        send_People_Data,
        receive_People_Data,
        chat_Content_Time
      })
      this.chat_Content = ''
    },
    // 接收消息
    receive_Message() {
      this.SK.socket.on('receive_Message_Data', (data) => {
        const {
          send_People_Data,
          receive_People_Data,
          chat_Content_Time,
          receive_People_Data: { admin_Code, nick_Name },
          chat_Content_Time: { chat_Content }
        } = data
        this.latest_News_admin_Code = admin_Code
        this.massage_Num++
        if (this.chat_data[admin_Code] === undefined) {
          this.chat_data[admin_Code] = {
            send_People_Data,
            receive_People_Data,
            chat_Content: [chat_Content_Time]
          }
        } else {
          this.chat_data[admin_Code].send_People_Data = send_People_Data
          this.chat_data[admin_Code].receive_People_Data = receive_People_Data
          this.chat_data[admin_Code].chat_Content.push(chat_Content_Time)
        }
        this.aud.play()
        const msgV = (nick_Name || admin_Code) + '发来消息说' + chat_Content
        this.speech_Synthesis(msgV, 1000)
        this.Chat_Window()
      })
    },
    speech_Synthesis(msgV, tm) {
      let setIn = setTimeout(() => {
        if (this.voice_Announcements && Login_Device_Code(true)) {
          var msg = new SpeechSynthesisUtterance(msgV)
          msg.volume = 100 // 声音的音量
          msg.rate = 1 // 语速，数值，默认值是1，范围是0.1到10
          msg.pitch = 1.5 // 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
          speechSynthesis.speak(msg)
          clearTimeout(setIn)
          setIn = null
        }
      }, tm)
    },
    // 关闭聊天
    Close_Chat_Box() {
      this.massage_Num = 0
      this.chat_ShowH = false
    },
    // 点击铃铛打开聊天窗口
    Chat_Box_SH() {
      this.massage_Num = 0
      this.chat_ShowH = true
      this.active_Table_List = this.latest_News_admin_Code
      this.chat_Content_Data = this.chat_data[this.active_Table_List]
      this.Chat_Window()
    },
    Chat_Window() {
      if (this.chat_ShowH) {
        this.$nextTick(_ => {
          this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
          //   this.$refs.chat.lastElementChild.scrollIntoView();
          if (this.$refs.smallbell.parentElement.clientWidth < 750) {
            this.Smallbell_SB = false
          } else {
            this.Smallbell_SB = true
          }
        })
      }
    }
  },
  mounted() {
    bus.$on('receive_Message', () => {
      this.receive_Message()
    })
    if (this.SK.socket) {
      this.receive_Message()
    }
    bus.$on('send_Chat_Person', (c = {}) => {
      this.chat_ShowH = true
      const { Login_Device, admin_Code = Object.keys(this.chat_data)[0] } = c
      if (this.chat_data[admin_Code] === undefined) {
        this.chat_data[admin_Code] = {
          send_People_Data: {
            admin_Code: this.Users.admin_Code,
            Login_Device: Login_Device_Code()
          },
          receive_People_Data: { admin_Code, Login_Device },
          chat_Content: [],
          online_Offline: 1,
          Login_Device
        }
      }
      this.active_Table_List = admin_Code
      this.chat_Content_Data = this.chat_data[admin_Code]
      this.Chat_Window()
    })
  },
  watch: {
    '$route.name': function(newV) {
      if (newV === 'Login') {
        this.Close_Chat_Box()
      }
    },
    Users_Chat_Content: function(newV) {
      if (newV) {
        this.chat_data = newV
      }
    },
    Lander_Data: {
      handler(newV) {
        const online_Users = newV[0].Login_Users_Arrangement.map((c) => {
          if (Object.keys(this.chat_data).includes(c.admin_Code)) {
            this.$set(
              this.chat_data[c.admin_Code],
              'Login_Device',
              c.Login_Device
            )
          }
          return c.admin_Code
        })
        Object.keys(this.chat_data).forEach((c) => {
          if (online_Users.includes(c)) {
            this.$set(this.chat_data[c], 'online_Offline', 1)
          } else {
            this.$set(this.chat_data[c], 'online_Offline', 2)
          }
        })
      },
      deep: true
    },
    chat_ShowH: function(newV) {
      const body = document.getElementById('app')
      if (newV) {
        body.style.cssText =
          'width: 100%; height: 100%; position: fixed; left: 0; overflow: hidden;'
      } else {
        body.removeAttribute('style')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fa-bell {
  position: fixed;
  bottom: 80px;
  right: 80px;
  color: #b79764;
  animation: shake 2.5s ease infinite;
  cursor: pointer;
  font-size: 26px;
}

.massage_Num_Icon {
  width: 30px;
  height: 16px;
  line-height: 14px;
  position: fixed;
  bottom: 100px;
  right: 60px;
  font-size: 12px;
  background-color: #b79764;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  border: 1px solid #fff;
  box-sizing: border-box;
}

@keyframes shake {
  0%,
  50%,
  100% {
    transform: rotate(0);
  }

  5%,
  10%,
  15%,
  20%,
  25%,
  30%,
  35%,
  40% {
    transform: rotate(6deg);
  }

  45% {
    transform: rotate(4deg);
  }

  7.5%,
  12.5%,
  17.5%,
  22.5%,
  27.5%,
  32.5%,
  37.5%,
  42.5% {
    transform: rotate(-6deg);
  }

  47.5% {
    transform: rotate(-2deg);
  }
}
.chat_Mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.402);
  backdrop-filter: blur(4px);
  z-index: 200;
  .chat_Wrap {
    width: 70%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(255, 255, 255);
    border-radius: 10px;
    .chat_Content {
      width: 100%;
      height: 100%;
      display: flex;
      .chat_People {
        width: 20%;
        min-width: 140px;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        .chat_Oneself {
          font-size: 14px;
          letter-spacing: 1px;
          margin: 15px;
          border-radius: 10px;
          display: flex;
          .fa-user-circle {
            font-size: 45px;
            vertical-align: middle;
            margin-top: 4px;
          }
          .head_Portrait_Img {
            width: 50px;
            height: 50px;
            display: inline-block;
            vertical-align: middle;
            /deep/ .preview_Img {
              border-radius: 50%;
              border: 1px solid rgba(221, 221, 221, 0.545);
            }
          }
          div:last-child {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 3px 0;
            margin-left: 10px;
            p:first-child {
              font-weight: bold;
            }
            p:last-child {
              font-size: 12px;
              i {
                color: #fff;
                margin-right: 5px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                user-select: none;
                border-radius: 4px;
                font-weight: 400;
                line-height: 20px;
                text-align: center;
                transition: transform 0.5s;
                transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
                box-shadow: 0px 0px 0px #000;
                &:hover {
                  transform: translate3d(0, 2px, 0);
                  box-shadow: 1px 1px 3px 1px #00000042;
                }
              }
            }
          }
        }
        .chat_People_List_Wrap {
          overflow-y: scroll;
          flex: 1;
          .chat_People_List {
            padding: 10px;
            font-size: 12px;
            cursor: pointer;
            p {
              color: #767676;
              height: 20px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:first-child {
              padding-bottom: 4px;
            }
            &:hover {
              background: #e4e4e4;
            }
          }
          &::-webkit-scrollbar {
            width: 5px; /*对垂直滚动条有效*/
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: rgb(192 192 192);
          }
          &::-webkit-scrollbar-track {
            box-shadow: 0 0 transparent;
            background-color: #8c6b0700;
          }
          .Active_Chat_People_List {
            background: #eee;
          }
        }
      }
      .chat_Massage {
        width: 80%;
        height: 100%;
        transition: all 0.2s;
        z-index: 1;
        p {
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          border-left: solid 1px #409eff9e;
          background: #fff;
          border-bottom-right-radius: 10px;
          border-top-right-radius: 10px;
          .SHButton {
            width: 40px;
            height: 36px;
            position: absolute;
            right: 0px;
            padding: 0px;
            border-radius: 0;
            border-top-right-radius: 10px;
          }
        }
        p:last-child {
          input {
            width: calc(~'100% - 80px');
            height: 34px;
            border: 0;
            padding: 0;
            text-indent: 15px;
            font-size: 12px;
            outline: none;
          }
          .SHButton {
            width: 80px;
            height: 38px;
            position: relative;
            border-radius: 0;
            border-bottom-right-radius: 10px;
          }
        }
        ul {
          width: 100%;
          height: calc(~'100% - 72px');
          padding: 20px 20px 0 10px;
          list-style: none;
          overflow-y: scroll;
          overflow-x: hidden;
          box-sizing: border-box;
          background: -webkit-linear-gradient(
            -45deg,
            #59574c 0,
            #546f7c 25%,
            #676767 50%,
            #6f6663 75%,
            #456b67 100%
          );
          li {
            position: relative;
            clear: both;
            display: inline-block;
            padding: 12px 16px 12px 24px;
            margin: 0 0 20px 0;
            font: 14px/20px 'Noto Sans', sans-serif;
            border-radius: 10px;
            background-color: rgba(25, 147, 147, 0.2);
            .head_Portrait_Img {
              position: absolute;
              top: 0;
              width: 40px;
              height: 40px;
              border-radius: 6px;
              border: solid 1px #ffffff8c;
            }
          }
          .odd {
            .head_Portrait_Img {
              right: -65px;
            }
          }
          .even {
            .head_Portrait_Img {
              left: -65px;
            }
          }
          .odd:after {
            position: absolute;
            top: 12px;
            content: '';
            width: 0;
            height: 0;
            border-left: 10px solid cadetblue;
            border-top: solid 10px #0000;
            border-bottom: solid 10px #0000;
            right: -7px;
          }
          .even:after {
            position: absolute;
            top: 12px;
            content: '';
            width: 0;
            height: 0;
            border-right: 10px solid #588371;
            border-top: solid 10px #0000;
            border-bottom: solid 10px #0000;
            left: -7px;
          }
          .odd {
            animation: show-chat-odd 0.15s 1 ease-in;
            float: right;
            margin-right: 65px;
            color: #ededed;
            background: cadetblue;
            padding: 12px 24px 12px 16px;
          }
          .even {
            animation: show-chat-even 0.15s 1 ease-in;
            float: left;
            margin-left: 65px;
            color: #ededed;
            background: #588371;
          }
        }
      }
    }
  }
}
::-webkit-scrollbar {
  width: 10px; /*对垂直流动条有效*/
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(0 0 0);
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(25, 147, 147, 0.1);
}
@media screen and (max-width: 750px) {
  .chat_Mask {
    .chat_Wrap {
      width: 95%;
      height: 90%;
      .chat_Content {
        .chat_People {
          min-width: 0px;
        }
      }
    }
  }
}
</style>
