<!--
 * @Author: Cxy
 * @Date: 2021-05-19 12:37:46
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-30 17:51:43
 * @FilePath: \blog\blogweb\src\components\Administration\OnlineManagement.vue
-->
<template>
  <div class='oline'>
    <div class='Administration_Right_Lander_Wrap'>
      <div
        v-for='(c, i) in Lander_Data_Copy'
        :key='i'
        class='Administration_Right_Lander_Item width_Big'>
        <div class='Administration_Right_Lander_Bg_Wrap'>
          <i class='fa' :class='c.icon' aria-hidden='true' />
        </div>
        <div class='Administration_Right_Lander_Nm'>
          <p v-if="c.code === 'ON_LINE'">{{ ON_LINE }}+</p>
          <p v-else-if="c.code === 'ARTICLE_COUNT'">{{ ARTICLE_COUNT }}+</p>
          <p v-else>{{ VISITS }}+</p>
          <span>{{ c.code }}</span>
        </div>
      </div>
    </div>
    <div class='Authority'>
      <SHTable :tab_Title='tab_Title' :tab_Data='tab_Data'>
        <template v-slot:thead_Operation>
          <th style='width: 28%'>操作</th>
        </template>
        <template #tbody_Operation='slotProps'>
          <td style='width: 28%'>
            <SHButton
              type='danger'
              :disabled="
                slotProps.row.admin_Code === Users.admin_Code ||
                  !set_Button_Power('forced_Offline')
              "
              icon='fa-user-times'
              @click='forced_Offline(slotProps.row)'>强制下线
            </SHButton>
            <SHButton
              v-if='!(slotProps.row.admin_Code === Users.admin_Code)'
              type='primary'
              :disabled="!set_Button_Power('chat_Person')"
              icon='fa-comments'
              @click='chat_Person(slotProps.row)'>联系</SHButton>
            <SHButton
              type='warn'
              :disabled="!set_Button_Power('frozen_Person')"
              icon='fa-unlock-alt'
              @click='frozen_Person(slotProps.row)'>冻结</SHButton>
          </td>
        </template>
      </SHTable>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { bus } from '@/until'
export default {
  data() {
    return {
      ON_LINE: 0, // 在线人数
      VISITS: 0, // 网站访问量
      ARTICLE_COUNT: 0, // 文章总数
      tab_Title: [
        { title: '账号', prop: 'admin_Code' },
        { title: '昵称', prop: 'nick_Name' },
        { title: '角色', prop: 'role_Name' },
        { title: '登录设备', prop: 'login_Device' },
        { title: '注册时间', prop: 'created_At', width: '200' }
      ],
      tab_Data: [],
      Lander_Data_Copy: [
        { code: 'ON_LINE', icon: 'fa-dribbble' },
        { code: 'ARTICLE_COUNT', icon: 'fa-book' },
        { code: 'VISITS', icon: 'fa-laptop' }
      ]
    }
  },
  computed: {
    ...mapState('admin', ['Lander_Data']),
    ...mapState('login', ['Users']),
    ...mapGetters('login', ['set_Button_Power'])
  },
  methods: {
    // 冻结账户
    frozen_Person(c) {
      this.SK.emit('frozen_Person', c)
    },
    // 强制下线
    forced_Offline(c) {
      this.SK.emit('Forced_Offline', c)
    },
    // 聊天
    chat_Person(c) {
      bus.$emit('send_Chat_Person', c)
    },
    call_Move_Num_Plus(data) {
      this.tab_Data = data[0].Login_Users_Arrangement
      data.forEach((c) => {
        this.Move_Num_Plus(c.countNum, c.code)
      })
    },
    Move_Num_Plus(totle, code) {
      // 清除重复的定时器
      if (this[code + 'timer']) {
        clearInterval(this[code + 'timer'])
      }
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
  }
}
</script>

<style lang="less" scoped>
.oline {
  flex: 1;
  display: flex;
  flex-direction: column;
  .Administration_Right_Lander_Wrap {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 30vh;
    .Administration_Right_Lander_Item {
      width: 30%;
      text-align: center;
      position: relative;
      opacity: 0;
      &::before {
        position: absolute;
        content: "";
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
          transition: all 600ms ease;
          color: #979797;
        }
        &:hover i {
          transform: scale(-1) rotate(180deg);
        }
      }
      .Administration_Right_Lander_Nm {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-weight: 500;
        color: #32297b;
        font-family: "Lucida Console", "Courier New", monospace;
        p {
          line-height: 1em;
          font-size: 64px;
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
  .Authority {
    flex: 1;
    overflow-y: auto;
    margin: 20px;
    .SHButton {
      margin-left: 15px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .oline {
    .Administration_Right_Lander_Wrap {
      .Administration_Right_Lander_Item {
        width: 33%;
        &::before {
          right: -1px;
        }
        .Administration_Right_Lander_Bg_Wrap {
          .Administration_Right_Lander_Bg {
            background-size: 52px;
          }
        }
        .Administration_Right_Lander_Nm {
          p {
            font-size: 30px;
          }
          span {
            font-size: 10px;
          }
        }
      }
    }
    .Authority {
      font-size: 10px;
    }
  }
}
</style>
