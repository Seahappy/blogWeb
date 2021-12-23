<!--
 * @Author: Cxy
 * @Date: 2021-02-27 23:04:28
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-02 16:38:48
 * @FilePath: \blog\blogweb\src\views\Administration.vue
-->
<template>
  <div class='Administration'>
    <div class='Administration_Left'>
      <div class='Administration_Left_Logo'/>
      <div class='Administration_Left_Menu'>
        <ul>
          <li
            v-for='(c, i) in admin_Router[0].children'
            :key='i'
            :class="c.path === activeTab ? 'active_Administration_class' : ''">
            <i class='fa' :class='c.icon' aria-hidden='true'/>
            <span @click='$router.push({ name: c.path })'>
              {{ c.title }}
            </span>
          </li>
        </ul>
      </div>
      <div class='Administration_Left_BackH_Wrap'>
        <h2>{{ Users.nick_Name || Users.admin_Code }}</h2>
        <div class='Administration_Left_BackH'>
          <span @click='$router.go(-1)'>返回</span> |
          <span @click="$router.push({ path: '/Home' })">首页</span>
        </div>
      </div>
    </div>
    <div class='Administration_Right'>
      <RouterView/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      admin_Router: [],
      activeTab: ''
    }
  },
  computed: {
    ...mapState('login', ['nav_Data', 'Users'])
  },
  created() {
    const iconData = ['fa-comments', 'fa-user-secret', 'fa-puzzle-piece', 'fa-cogs', 'fa-rss-square']
    this.admin_Router = this.nav_Data.filter((c) => {
      if (c.path === 'Administration') {
        c.children.map((c, i) => (c.icon = iconData[i]))
        return c
      }
    })
    this.activeTab = this.$route.name
  },
  watch: {
    $route: function(newV) {
      this.activeTab = newV.name
    }
  }
}
</script>

<style lang="less" scoped>
.Administration {
  width: 100%;
  height: calc(~"100vh - 30px");
  background: #fff;
  display: flex;
  .Administration_Left {
    width: 230px;
    background: #000;
    position: relative;
    .Administration_Left_Logo {
      width: 80%;
      height: 15vh;
      margin: 0 10%;
      background-image: url(~assets/logo/logoWhite.png);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .Administration_Left_Menu {
      color: #fff;
      font-size: 18px;
      ul {
        li {
          height: 25px;
          width: 99%;
          display: flex;
          align-items: center;
          padding-left: 15%;
          margin: 10px 0;
          box-sizing: border-box;
          justify-content: space-around;
          i {
            font-size: 20px;
            margin-right: 8px;
            margin-top: 2px;
          }
          span {
            transition: all 0.2s ease-in;
            border-right: 5px solid #ccc;
            width: 75%;
            cursor: pointer;
          }
          &:hover {
            color: #f67b63;
            span {
              border-color: #f67b63;
            }
          }
        }
        .active_Administration_class {
          color: #f67b63bb;
          span {
            border-color: #f67b63bb;
          }
        }
      }
    }
    .Administration_Left_BackH_Wrap {
      width: 100%;
      padding: 30px 18px 5px;
      text-align: center;
      position: absolute;
      box-sizing: border-box;
      bottom: 5%;
      color: #fbece9;
      h2 {
        margin-bottom: 20px;
      }
      .Administration_Left_BackH {
        font-size: 15px;
        padding: 12px 10%;
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 20px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        span {
          transition: all 0.2s ease-in;
        }
        span:hover {
          color: #f67b63;
          transform: scale(1.1) translate3d(0, 2px, 0);
          font-weight: 900;
        }
      }
    }
  }
  .Administration_Right {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 14px;
    display: flex;
    &::before,
    &::after {
      content: "";
      width: 12%;
      position: absolute;
      background-image: url(~assets/Administration/adminBackground.png);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      height: 30%;
      right: 0;
      top: 15%;
    }
    &::after {
      background-image: url(~assets/Administration/adminLRBack.png);
      left: 0;
      top: 0;
      width: 128px;
      height: 132px;
    }
  }
}
@media screen and (max-width: 750px) {
  .Administration_Left {
    display: none;
  }
}
</style>
