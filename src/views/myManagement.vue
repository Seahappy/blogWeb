<!--
 * @Author: Cxy
 * @Date: 2021-06-17 10:03:43
 * @LastEditors: Cxy
 * @LastEditTime: 2022-05-30 19:10:35
 * @FilePath: \blog\blogweb\src\views\myManagement.vue
-->
<template>
  <div class='myManagement'>
    <ul>
      <li
        v-for='c in admin_Router[0].children'
        :key='c.id'
        :class="activeTab === c.path ? 'activeClass' : ''"
        @click='$router.push({ path: c.path }), (activeTab = c.path)'>
        <div class='setting-icon'>
          <i class='fa' :class='c.icon'/>
        </div>
        <span>{{ c.title }}</span>
      </li>
      <li
        style='text-align: center; position: absolute; bottom: 20px; width: 67%'
        @click="$router.push({ name: 'Home' })">
        <div class='setting-icon'>
          <i class='fa fa-reply-all' aria-hidden='true'/>
        </div>
        <span>回首页</span>
      </li>
    </ul>
    <RouterView class='right_My_Management'/>
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
    ...mapState('login', ['nav_Data'])
  },
  created() {
    const iconData = ['fa-star-half-o', 'fa-cogs', 'fa-clipboard', 'fa-video-camera']
    this.admin_Router = this.nav_Data.filter((c) => {
      if (c.path === 'myManagement') {
        c.children.map((c, i) => (c.icon = iconData[i]))
        return c
      }
    })
    this.activeTab = this.$route.name
  }
}
</script>

<style lang="less" scoped>
.myManagement {
  height: calc(~"100vh - 30px");
  padding: 4vh 2%;
  box-sizing: border-box;
  display: flex;
  ul {
    width: 280px;
    padding: 20px;
    box-shadow: 0px 0px 15px 0px #8e8e8e47;
    box-sizing: border-box;
    border-radius: 10px;
    background: #f0f8ff;
    position: relative;
    li {
      padding: 10px 25px;
      font-size: 15px;
      border-radius: 4px;
      transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      .setting-icon {
        margin-right: 15px;
        width: 32px;
        height: 32px;
        text-align: center;
        color: #fff;
        background-color: #000000;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        i {
          margin: 6px 0 0 1px;
          font-size: 18px;
          display: block;
        }
      }
      span {
        vertical-align: middle;
      }
    }
    .activeClass {
      background-color: #d7d7d7;
    }
  }
}
</style>
