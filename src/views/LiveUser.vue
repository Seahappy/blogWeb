<!--
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2022-06-04 14:02:35
 * @LastEditors: Cxy
 * @LastEditTime: 2022-06-06 23:03:01
 * @FilePath: \blog\blogweb\src\views\LiveUser.vue
-->
<template>
  <div class='live'>
    <div class='live_Left'>
      <div class='live_User'>
        <SHImage
          v-if='live_User.head_Portrait'
          class='live_User_headPortrait'
          :src="'http://localhost:1314' + live_User.head_Portrait"/>
        <i v-else class='fa fa-user' aria-hidden='true' />
        <div class='live_User_Content'>
          <p>{{ live_User.nick_Name || live_User.admin_Code }}</p>
          <p>
            <span class='fa fa-address-card' aria-hidden='true' />{{
              live_User.room_Description || "主播没有写"
            }}
          </p>
        </div>
      </div>
      <video
        ref='live_Video'
        autoplay
        playsinline
        controls
        :poster="'http://localhost:1314' + live_User.live_Image"
        class='live_Video'/>
      <SHLoading v-if='video_Loading' class='live_Video_Mask' />
      <div v-if='video_Offline' class='live_Video_Mask live_Video_Offline'>
        <SHImage
          v-if='live_User.head_Portrait'
          class='live_User_headPortrait'
          :src="'http://localhost:1314' + live_User.head_Portrait"/>
        <i v-else class='fa fa-user' aria-hidden='true' />
        <p>主播暂时不在家哦~~</p>
      </div>
    </div>
    <div class='live_Right'>
      <div class='live_Chat'>
        <div v-for='c in chat_Data' :key='c.time' class='live_Chat_Item'>
          <span v-if='c.send_Person'>{{ c.send_Person }}：</span>
          <span>{{ c.chat_Content }}</span>
        </div>
      </div>
      <div class='live_Btn'>
        <SHInput
          v-if='Users.admin_Code'
          v-model='chat_Content'
          type='textarea'
          @keydown.enter='send_Out'/>
        <div v-else class='live_Send_Login'>
          <span @click="$router.push('/Login')">登录</span> 发弹幕，参与主播互动
        </div>
        <SHButton type='primary' @click='send_Out'>发送</SHButton>
      </div>
    </div>
  </div>
</template>

<script>
import flvjs from 'flv.js'
import { get_Live_Broadcast } from '@/http/model/live'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      live_User: {},
      chat_Content: '',
      chat_Data: [],
      flvPlayer: null,
      video_Loading: true,
      video_Offline: false,
      tourist_Code: (new Date().getTime() + '').slice(-6)
    }
  },
  methods: {
    send_Out() {
      const {
        live_User: { _id: room },
        chat_Content,
        Users: { admin_Code, nick_Name }
      } = this
      this.SK.emit(
        'send_Msg',
        {
          room,
          chat_Content,
          send_Person: nick_Name || admin_Code
        },
        (data) => {
          this.chat_Data.push(data)
        }
      )
      this.chat_Content = ''
    },
    live_Join_Room_Oper() {
      const {
        live_User: { _id: room },
        Users: { admin_Code, nick_Name },
        tourist_Code
      } = this
      this.SK.emit(
        'join_Room',
        {
          room,
          chat_Content:
            '欢迎' +
            (nick_Name || admin_Code || '游客' + tourist_Code) +
            '进入房间'
        },
        (data) => {
          this.chat_Data.push(data)
        }
      )
    },
    get_Live_Broadcast_Oper() {
      get_Live_Broadcast({ id: this.$route.params.Id }).then(
        ({
          data: {
            data: { data },
            code
          }
        }) => {
          if (code === 200) {
            this.live_User = data[0]
            this.get_Live_Video_Oper()
            this.live_Join_Room_Oper()
          }
        }
      )
    },
    get_Live_Video_Oper() {
      this.$nextTick((_) => {
        if (flvjs.isSupported()) {
          const room_Url_Key = this.live_User.room_Key.split('?')
          const live_url = room_Url_Key[0] + '.flv?'
          const live_Video = this.$refs.live_Video
          this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: '/seaLive/' + live_url + room_Url_Key[1]
          })
          this.flvPlayer.attachMediaElement(live_Video)
          this.flvPlayer.load()
          this.flvPlayer.play()
          this.video_AddEventlistner()
        }
      })
    },
    video_AddEventlistner() {
      // this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, (res) => {
      //   console.log('加载完成', res)
      // })
      this.flvPlayer.on(flvjs.Events.MEDIA_INFO, ({ hasVideo }) => {
        if (hasVideo) {
          this.video_Loading = false
        }
      })
      // this.flvPlayer.on(flvjs.Events.METADATA_ARRIVED, (res) => {
      //   console.log('获取元数据', res)
      // })
      // this.flvPlayer.on(flvjs.Events.RECOVERED_EARLY_EOF, (res) => {
      //   console.log('恢复早期EOF', res)
      // })
      // this.flvPlayer.on(flvjs.Events.SCRIPTDATA_ARRIVED, (res) => {
      //   console.log('获取到脚本数据', res)
      // })
      // 加载失败
      this.flvPlayer.on(flvjs.Events.ERROR, (_, __, errorInfo) => {
        this.video_Loading = false
        this.video_Offline = true
        throw errorInfo
      })

      // // 【重要事件监听】http请求建立好后，该事件会一直监听flvjs实例
      // this.flvPlayer.on(flvjs.Events.STATISTICS_INFO, (res) => {
      //   console.log('请求数据信息', res)
      //   console.log('销毁实例')
      //   // // 销毁实例
      //   // flvPlayer.pause()
      //   // flvPlayer.unload()
      //   // flvPlayer.detachMediaElement()
      //   // flvPlayer.destroy()
      //   // flvPlayer = null
      // })
    },
    pause_Video_Oper() {
      if (!this.flvPlayer) return
      this.flvPlayer.pause()
      this.flvPlayer.unload()
      this.flvPlayer.detachMediaElement()
      this.flvPlayer.destroy()
      this.flvPlayer = null
    },
    live_Leave_Room_Oper() {
      const {
        live_User: { _id: room },
        Users: { admin_Code, nick_Name },
        tourist_Code
      } = this
      this.SK.socket &&
        this.SK.emit(
          'leave_Room',
          {
            room,
            chat_Content:
              (nick_Name || admin_Code || '游客' + tourist_Code) + '已离开房间'
          },
          (data) => {
            this.chat_Data.push(data)
          }
        )
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    ...mapGetters('login', ['session_Clear_User'])
  },
  created() {
    this.get_Live_Broadcast_Oper()
    if (!this.Users.admin_Code) {
      this.SK.init()
      this.SK.connect()
    }
    this.SK.socket.on('receive_Msg', (data) => {
      this.chat_Data.push(data)
    })
  },
  beforeDestroy() {
    this.pause_Video_Oper()
    this.live_Leave_Room_Oper()
    if (!this.Users.admin_Code && this.SK.socket) {
      this.SK.disconnect()
    }
  }
}
</script>

<style lang="less" scoped>
.live {
  width: 84%;
  background: #f5f5f5;
  display: flex;
  padding: 30px 8%;
  min-height: 78vh;
  .live_Left {
    width: 66%;
    border-radius: 5px;
    background: #fff;
    position: relative;
    .live_User {
      width: 100%;
      height: 104px;
      display: flex;
      align-items: center;
      padding: 12px;
      box-sizing: border-box;
      .live_User_headPortrait {
        width: 80px;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
      }
      i {
        font-size: 80px;
      }
      .live_User_Content {
        width: calc(100% - 100px);
        font-size: 30px;
        color: #000;
        font-weight: 600;
        margin-left: 20px;
        p:last-child {
          color: #888;
          font-size: 14px;
          span {
            margin: 14px 10px 0 0;
          }
        }
        p {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 38px;
        }
      }
    }
    .live_Video {
      width: 100%;
    }
    .live_Video_Mask {
      width: 100%;
      height: calc(100% - 104px);
      background: #000;
      position: absolute;
      top: 102px;
    }
    .live_Video_Offline {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      i {
        font-size: 80px;
      }
      .live_User_headPortrait {
        height: 90px;
        width: 90px;
        overflow: hidden;
        border-radius: 12px;
      }
      p {
        margin-top: 70px;
      }
    }
  }
  .live_Right {
    width: 30%;
    padding: 15px;
    border-radius: 5px;
    background: #fff;
    margin-left: 2%;
    .live_Chat {
      height: calc(100% - 70px);
      width: 100%;
      .live_Chat_Item {
        display: flex;
        font-size: 14px;
        margin-bottom: 10px;
        line-height: 22px;
        span:first-child {
          color: #b1b1b1;
          margin-right: 6px;
        }
      }
    }
    .live_Btn {
      height: 50px;
      width: 100%;
      display: flex;
      margin-top: 20px;
      .live_Send_Login {
        flex: 1;
        border-radius: 4px 0 0 4px;
        border: 1px solid #409eff;
        line-height: 48px;
        text-align: center;
        span {
          color: #409eff;
          cursor: pointer;
        }
      }
      /deep/ .SHInput {
        flex: 1;
        margin-right: 0;
        height: 100%;
        .inputUi_Input {
          font-size: 14px;
          textarea {
            border-radius: 4px 0 0 4px;
            border: 1px solid #409eff;
            background: #fff;
          }
        }
      }
      .SHButton {
        padding: 10px 10px;
        height: 100%;
        border-radius: 0 4px 4px 0;
      }
    }
  }
}
</style>
