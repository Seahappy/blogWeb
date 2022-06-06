<!--
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2022-05-30 19:15:40
 * @LastEditors: Cxy
 * @LastEditTime: 2022-06-06 21:51:14
 * @FilePath: \blog\blogweb\src\views\Live.vue
-->
<template>
  <div class='live'>
    <div class='live_Rooms'>
      <div
        v-for='c in live_Data'
        :key='c._id'
        class='live_Rooms_Item'
        @click="$router.push({ path: 'LiveUser/' + c.id })">
        <div
          class='live_Rooms_Item_BG'
          :style="{
            backgroundImage:
              'url(' + (c.live_Image || Article_Default_BG) + ')',
          }"/>
        <div class='live_Rooms_Item_Content'>
          <div class='live_Rooms_Item_Info'>
            <span class='live_Rooms_Item_Title'>{{
              c.room_Title || "没起标题"
            }}</span>
          </div>
          <div class='live_Rooms_Item_Info'>
            <i class='fa fa-user' aria-hidden='true' />
            <span class='live_Rooms_Item_User'>{{
              c.nick_Name || c.admin_Code
            }}</span>
          </div>
          <div class='live_Rooms_Item_InfoMax live_Rooms_Item_Info'>
            <SHImage
              v-if='c.head_Portrait'
              class='live_Rooms_Item_headPortrait'
              :src='c.head_Portrait'/>
            <i v-else class='fa fa-user' aria-hidden='true' />
            <div class='live_Rooms_Item_InfoMax_User'>
              <span class='live_Rooms_Item_User'>{{
                c.nick_Name || c.admin_Code
              }}</span>
              <div class='live_Rooms_Item_InfoMax_Fire'>
                <span
                  style='margin-right: 6px'
                  class='fa fa-fire'
                  aria-hidden='true'/>
                <span>{{ c.room_Heat || 0 }}</span>
              </div>
            </div>
            <SHButton v-if='c.admin_Code === Users.admin_Code' type='primary' @click='chat_Person(c)'>联系</SHButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/until'
import { get_Live_Broadcast } from '@/http/model/live'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      live_Data: []
    }
  },
  computed: {
    ...mapState('article', ['Article_Tag_Total', 'Article_Default_BG']),
    ...mapState('login', ['Users'])
  },
  methods: {
    // 聊天
    chat_Person(c) {
      bus.$emit('send_Chat_Person', c)
    },
    get_Live_Broadcast_Oper() {
      get_Live_Broadcast({ live_Status: 1 }).then(
        ({
          data: {
            data: { data },
            code
          }
        }) => {
          if (code === 200) {
            this.live_Data = data
          }
        }
      )
    }
  },
  created() {
    this.get_Live_Broadcast_Oper()
  }
}
</script>

<style scoped lang="less">
.live {
  width: 84%;
  background: #f5f5f5;
  display: flex;
  padding: 30px 8% 50px 8%;
  min-height: 45vh;
  .live_Rooms {
    width: 100%;
    .live_Rooms_Item {
      display: inline-block;
      width: 30%;
      background: #fff;
      border-radius: 8px;
      color: #aaa;
      position: relative;
      font-size: 12px;
      box-shadow: #0000001a 0px 0px 5px 0;
      transition: transform 0.3s;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
        z-index: 1;
        .live_Rooms_Item_Content {
          .live_Rooms_Item_InfoMax {
            display: inline-block;
          }
        }
      }
      &:nth-child(3n + 2) {
        margin: 10px 5%;
      }
      .live_Rooms_Item_BG {
        width: 100%;
        height: 210px;
        background-size: 101%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 8px 8px 0 0;
      }
      .live_Rooms_Item_Content {
        padding: 7px 10px 11px;
        line-height: 24px;
        .live_Rooms_Item_Info {
          .live_Rooms_Item_Title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 15px;
            color: #333;
          }
          i {
            color: #888;
            font-size: 14px;
            vertical-align: middle;
          }
          .live_Rooms_Item_User {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #888;
            margin-left: 8px;
          }
        }
        .live_Rooms_Item_InfoMax {
          display: none;
          position: absolute;
          left: 0;
          top: 245px;
          background: #fff;
          width: 100%;
          border-radius: 0 0 8px 8px;
          padding: 0 10px 14px 10px;
          box-sizing: border-box;
          line-height: 20px;
          z-index: 10;
          i {
            font-size: 40px;
            vertical-align: bottom;
            margin-right: 12px;
          }
          .live_Rooms_Item_User {
            margin-left: 0;
          }
          .live_Rooms_Item_InfoMax_User {
            display: inline-block;
          }
          .SHButton {
            border-radius: 16px;
            float: right;
            padding: 8px 16px;
            margin-top: 6px;
          }
          .live_Rooms_Item_headPortrait {
            height: 40px;
            width: 40px;
            display: inline-block;
            vertical-align: bottom;
            margin-right: 12px;
            border-radius: 50%;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
