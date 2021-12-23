<!--
 * @Author: Cxy
 * @Date: 2021-02-27 23:02:14
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-18 20:29:38
 * @FilePath: \blog\blogweb\src\App.vue
-->
<template>
  <div id='app' :style="{backgroundImage: 'url(/home/backGroundImage'+ new Date().getDay() +'.jpg)'}">
    <div id='anchor_Point'/>
    <TopNav />
    <!-- <keep-alive> -->
    <RouterView/>
    <!-- </keep-alive> -->
    <SmallBell />
    <BackToTop />
    <NavBottom />
    <MusicInterface v-if='$store.state.login.Users.admin_Code' />
  </div>
</template>

<script>
import TopNav from 'components/navTopBottom/navTop'
import NavBottom from 'components/navTopBottom/navBottom'
import SmallBell from 'components/smallBell'
import MusicInterface from 'components/musicInterface'
import BackToTop from 'components/backtotop'
export default {
  components: {
    TopNav,
    NavBottom,
    SmallBell,
    MusicInterface,
    BackToTop
  }
}
</script>

<style>
body {
  background-color: #f3f3f3;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
}
#app {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow-y: scroll;
  background-size: cover;
  position: relative;
}

/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 0px; /*对垂直流动条有效*/
  height: 0px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #8c6b07;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #000000;
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  background: #868046;
}

/* placeholder 颜色全局修改 */
input::-webkit-input-placeholder {
  color: #ccc;
  font-size: 12px;
}

/* placeholder 颜色全局修改 */
textarea::-webkit-input-placeholder {
  color: #ccc;
  font-size: 12px;
}

@media screen and (max-width: 750px) {
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
/* 重铸markdown样式 解决全局css覆盖问题 */
.markdown-body ol li {
  list-style-type: decimal;
}

.markdown-body ul li {
  list-style-type: disc;
}

/* 去掉文章内加的封面 */
.markdown-body-none-img p:last-child img:last-child {
  display: none;
}
/*pre定义滚动条的轨道颜色、内阴影及圆角*/
.markdown-body ::-webkit-scrollbar-track {
  background-color: #ffffff;
}
.markdown-body ::-webkit-scrollbar {
  width: 0px;
  height: 5px;
}
/* pre定义滑块颜色、内阴影及圆角 */
.markdown-body ::-webkit-scrollbar-thumb {
  background-color: #000000;
}

pre {
  position: relative;
  font-size: 16px !important;
}

/* 骨架屏 */
.skeleton_Screen {
  background-color: #ededed;
  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    #ededed;
  background-size: 200% !important;
  background-position-x: 180%;
  animation: 1s loading ease-in-out infinite;
}
@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
</style>
