<!--
 * @Author: Cxy
 * @Date: 2021-06-13 15:51:57
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-02 16:02:40
 * @FilePath: \blog\blogweb\src\components\myManagement\myLikeBlog.vue
-->
<template>
  <div class='myLikeBlog'>
    <ul>
      <li v-for='c in like_Data' :key='c._id'>
        <p>
          <SHImage
            v-if='c.users[0].head_Portrait'
            class='head_Portrait_Img'
            :src='c.users[0].head_Portrait'/>
          <i v-else class='fa fa-user-circle' aria-hidden='true' />
          <span style='color: #333; font-size: 16px'>
            {{ c.users[0].nick_Name || c.users[0].admin_Code }}</span>
          <span style='color: #969696; font-size: 12px'>{{
            c.created_At | dateFilter
          }}</span>
        </p>
        <div class='Content'>
          <div class='Content_Right'>
            <div class='Content_Right_Title'>
              {{ c.title_Article }}
            </div>
            <div
              class='Content_Right_Content markdown-body markdown-body-none-img'
              @click='jump_info_Blog(c.id_Article)'
              v-html="c.html_Article.replace(/<(?!\/?br\/?.+?>)[^<>]*>/gm, '')"/>
            <div class='Content_Right_Sundry'>
              <i class='fa fa-eye' aria-hidden='true' />
              <span>{{ c.Views_Article }}</span>
              <i class='fa fa-comments' aria-hidden='true' />
              <span>{{ c.comments[0].comment_Article.length }}</span>
              <i class='fa fa-heart' aria-hidden='true' />
              <span>{{ c.like_Article }}</span>
              <span
                v-if='like_Data.length !== 0'
                class='cancel_Fabulous'
                @click='like_Blog_Operation(c)'>移除列表</span>
            </div>
          </div>
          <a
            :style="{
              backgroundImage:
                'url(' + (c.cover_Article || Article_Default_BG) + ')',
            }"/>
        </div>
      </li>
      <SHLoading v-if='loading_F' />
      <li
        v-if='!loading_F && like_Data.length === 0'
        style='height: 300px; border: 0'
        :style="{
          backgroundImage: 'url(' + require('assets/empty.png') + ')',
        }"/>
    </ul>
    <SHPaging
      config='total, sizes, prev, pager, next, jumper'
      :btnPageNum='7'
      :pageSize='[3, 6, 9]'
      :total='pageSize.total'
      @currentPageOpar='currentPageOpar'/>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { Like_Lready_Article, do_Like_Articles } from '@/http/model/article.js'
export default {
  data() {
    return {
      like_Data: [],
      random_Blog: [],
      loading_F: true,
      pageSize: {
        skip: 1,
        limit: 3,
        total: 0
      }
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    ...mapState('article', ['Article_Default_BG'])
  },
  methods: {
    ...mapMutations(['jump_info_Blog']),
    like_Blog_Operation(c) {
      const params = {
        admin_Code: this.Users.admin_Code,
        article_Id: c._id,
        like_Flag: false
      }
      do_Like_Articles(params).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          this.get_Like_List()
        } else {
          this.$Msg(massage, 'wran')
        }
      })
    },
    currentPageOpar(pageSize) {
      const { skip, limit } = pageSize
      this.pageSize.skip = skip
      this.pageSize.limit = limit
      this.get_Like_List()
    },
    get_Like_List() {
      const {
        Users: { admin_Code },
        pageSize: { skip, limit }
      } = this
      Like_Lready_Article({ admin_Code, skip, limit }).then((res) => {
        this.loading_F = false
        const { code, data, massage } = res.data
        if (code === 200) {
          this.like_Data = data.data || []
          this.pageSize.total = data.countNum
        } else {
          this.$Msg(massage, 'wran')
        }
      })
    }
  },
  created() {
    this.get_Like_List()
  }
}
</script>

<style lang="less" scoped>
.myLikeBlog {
  flex: 1;
  border-width: 20px;
  border-style: solid;
  border-color: #f0f8ff;
  border-bottom-width: 5px;
  margin-left: 20px;
  box-shadow: 0px 0px 15px 0px #8e8e8e47;
  border-radius: 10px;
  background: #f0f8ff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-end;
  ul {
    flex: 1;
    width: 100%;
    overflow: scroll;
    li {
      width: 100%;
      padding: 15px 0;
      border-bottom: 1px solid #dedede;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 30%;
      &:first-child{
        padding-top: 0;
      }
      &:last-child{
        padding-bottom: 0;
        border: none;
      }
      p {
        height: 40px;
        width: 100%;
        .head_Portrait_Img {
          width: 38px;
          height: 38px;
          display: inline-block;
          vertical-align: middle;
          /deep/ .preview_Img {
            border-radius: 50%;
            border: 1px solid #ddd;
          }
        }
        span {
          margin-left: 10px;
        }
        i {
          font-size: 38px;
        }
      }
      .Content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .Content_Right {
          width: calc(~"100% - 220px");
          .Content_Right_Title {
            font-size: 18px;
            font-weight: 700;
            line-height: 1.5;
            color: #6a6a6a;
            margin: 8px 0 4px;
          }
          .Content_Right_Content {
            height: 80px;
            width: 100%;
            margin-bottom: 5px;
            font-size: 13px;
            line-height: 20px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            cursor: pointer;
            /deep/ pre {
              background: rgba(0, 0, 0, 0);
            }
          }
          .Content_Right_Sundry {
            font-size: 12px;
            line-height: 20px;
            color: #b4b4b4;
            span {
              margin-right: 14px;
            }
            .cancel_Fabulous {
              display: none;
              cursor: pointer;
            }
            &:hover {
              .cancel_Fabulous {
                display: inline-block;
              }
            }
            i {
              margin-right: 5px;
            }
          }
        }
        a {
          display: inline-block;
          width: 200px;
          height: 130px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
    }
    .LoadingUi {
      height: 83vh;
    }
  }
  .SHPaging {
    height: 40px;
  }
}
</style>
