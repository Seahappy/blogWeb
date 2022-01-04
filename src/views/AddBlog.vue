<!--
 * @Author: Cxy
 * @Date: 2021-03-31 18:10:29
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-30 19:27:57
 * @FilePath: \blog\blogweb\src\views\AddBlog.vue
-->
<template>
  <div class='AddBlog'>
    <div class='AddBlog_Left'>
      <div class='AddBlog_Left_BackH_Wrap'>
        <div class='AddBlog_Left_BackH'>
          <span @click='$router.go(-1)'>返回</span> |
          <span @click="$router.push({ path: '/Home' })">首页</span>
        </div>
      </div>
      <div class='AddBlog_Left_Tag_Article'>
        <p>文章的标签
          <SHToolTip eventType='hover' direction='right' iconColor='#fff'>
            <p>1.单机添加删除文章标签</p>
            <p>2.双击删除个人标签库</p>
            <p>3.用户不同，标签数据库不同</p>
            <p>4.创建文章只能使用自己的标签去创建</p>
            <i slot='icon' class='fa fa-question-circle' aria-hidden='true'/>
          </SHToolTip>
        </p>
        <ul>
          <li v-for='c in label_Article' :key='c.id' @click='Article_Tag_Toggle(c, true)' @dblclick='Article_Tag_Del(c, true)'>
            {{ c.Tag_Name }}
          </li>
        </ul>
      </div>
      <div class='AddBlog_Left_Tag_Wrap'>
        <div class='AddBlog_Left_Tag_From'>
          <input v-if="set_Button_Power('Article_Tag_Add')" v-model='Tag_Name' type='text' placeholder='添加标签' placeholder-color='#fff' @keydown.enter='Article_Tag_Add' >
          <span v-if="set_Button_Power('Article_Tag_Add')" @click='Article_Tag_Add'>+</span>
        </div>
        <p>全部的标签</p>
        <ul>
          <li v-for='c in Article_Tag_Total_Deposit' :key='c.id' @click='Article_Tag_Toggle(c, false)' @dblclick='Article_Tag_Del(c, false)'>
            {{ c.Tag_Name }}
          </li>
        </ul>
      </div>
    </div>
    <div class='AddBlog_Right'>
      <div class='AddBlog_Right_Top'>
        <div class='AddBlog_Right_Top_Title'>
          <div class='AddBlog_Right_Top_Title_left'>
            <span>标题：</span>
            <span style='font-size: 12px'>{{ 50 - title_Article.length }}/50
              <SHToolTip eventType='hover' direction='right' iconColor='#fff'>
                <p>1.编辑博客时，如果上传图片不能展示尝试着换行就可以了</p>
                <p>2.图片另起一行放在最后自动转换成封面,没有图片展示默认</p>
                <i slot='icon' class='fa fa-question-circle' aria-hidden='true'/>
              </SHToolTip>
            </span>
          </div>
          <input v-model='title_Article' type='text' maxlength='50' placeholder='添加文章标题' >
        </div>
        <div class='AddBlog_Right_Top_Send'>
          <span v-if="set_Button_Power('publish_Article')" @click='publish_Article'>发布文章</span>
        </div>
      </div>
      <mavon-editor ref='markDown' v-model='content_Article' class='markDown_Style' placeholder='要写点什么吗？' toolbarsBackground='#987b4e' :externalLink='externalLink'
                    @change='change' @imgAdd='$imgAdd' @imgDel='$imgDel' />
    </div>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/markdown/github-markdown.min.css'
import 'assets/css/vs2015.min.css'
import {
  article_Add,
  upload_File,
  articleTag_Add,
  articleTag_Delete
} from '@/http/model/article.js'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import { randomHexColorCode } from '@/until'
export default {
  data() {
    return {
      externalLink: {
        // 禁止加载代码高亮css本地添加
        hljs_css: false
      },
      content_Article: '', // markrndown 文章内容
      fontNumTotle: 50, // 最大文字数量
      title_Article: '', // 文章题目
      Article_Tag_Total_Deposit: [], // 存放总标签数据
      label_Article: [], // 文章标签数组
      Tag_Name: '', // 添加标签名字
      html_Article: '', // Html 文章内容
      img_Articles: {} // 文章图片
    }
  },
  components: {
    mavonEditor
  },
  methods: {
    ...mapActions('article', ['Article_Tag_Find']),
    ...mapMutations('article', ['handle_Edit_Blog_Data']),
    // 获取 markedown 内容Html
    change(value, render) {
      this.html_Article = render
    },
    // 发布文章
    async publish_Article() {
      const {
        title_Article,
        content_Article,
        label_Article,
        img_Articles,
        Users: { admin_Code },
        Edit_Blog_Data
      } = this
      if (title_Article === '') return this.$Msg('标题不能为空', 'wran')
      if (content_Article === '') return this.$Msg('文章内容不能为空', 'wran')
      if (label_Article.length === 0) return this.$Msg('标签不能为空', 'wran')
      if (Object.keys(img_Articles).length > 0) {
        await this.uploadimg()
      }
      const params = {
        admin_Code,
        title_Article,
        label_Article,
        // 改变图片上传路径后需重新获取 别几把瞎改 下边的html_Article也是
        content_Article: this.content_Article,
        html_Article: this.html_Article,
        // 字数统计
        word_Number: this.$refs.markDown.textarea_selectionEnd
      }
      if (Edit_Blog_Data.id_Article) {
        const OldTag = Edit_Blog_Data.label_Article.map((c) => c.id_ArticleTag)
        const NewTag = label_Article.map((c) => c.id_ArticleTag)
        params.addTagId = NewTag.filter((c) => !OldTag.includes(c))
        params.delTagId = OldTag.filter((c) => !NewTag.includes(c))
        params.id_Article = Edit_Blog_Data.id_Article
      }
      const pattern = /^!\[(.*)\]\((.*)\)$/gmi
      const result = []
      let matcher
      while ((matcher = pattern.exec(this.content_Article)) !== null) {
        result.push({
          alt: matcher[1],
          url: matcher[2]
        })
      }
      const cover = result.length === 1 ? result[0] : result.pop()
      if (cover) params.cover_Article = cover.url
      article_Add(params).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          this.$Msg(massage, 'success')
          this.$router.push({ path: '/Blog' })
        } else if (code === 2) {
          this.$Msg(massage, 'wran')
        }
      })
    },
    // 添加标签
    Article_Tag_Add() {
      const {
        Tag_Name,
        Users: { admin_Code },
        label_Article
      } = this
      if (Tag_Name === '') return this.$Msg('请输入标签名', 'wran')
      const tag_Article_Find_Repeat = this.Article_Tag_Total_Deposit.concat(
        label_Article
      ).filter((c) => c.Tag_Name === Tag_Name)
      if (tag_Article_Find_Repeat.length > 0) { return this.$Msg('标签重复，请重新添加', 'wran') }
      articleTag_Add({ Tag_Name, admin_Code, tag_Color: randomHexColorCode() }).then((res) => {
        const { code, massage, data } = res.data
        if (code === 200) {
          this.label_Article.push(data)
          this.Tag_Name = ''
        } else if (code === 2) {
          this.$Msg(massage, 'wran')
        }
      })
    },
    // 双击 删除标签
    Article_Tag_Del(tag, flag) {
      if (!this.set_Button_Power('Article_Tag_Del')) return
      const {
        timer,
        Users: { admin_Code },
        label_Article,
        Article_Tag_Total_Deposit
      } = this
      clearTimeout(timer)
      if (tag.admin_Code !== admin_Code) { return this.$Msg('他人创建标签不可删除') }
      this.$MsgBox('此操作将连同文章内的标签一并删除，请确认', 'wran')
        .then(() => {
          const { _id } = tag
          articleTag_Delete({ _id }).then((res) => {
            const { code, massage } = res.data
            if (code === 200) {
              const tagData = (
                flag === true ? label_Article : Article_Tag_Total_Deposit
              ).filter((c) => {
                return c._id !== tag._id
              })
              flag === true
                ? (this.label_Article = tagData)
                : (this.Article_Tag_Total_Deposit = tagData)
            } else if (code === 2) {
              this.$Msg(massage, 'wran')
            }
          })
        })
        .catch(() => {
          this.$Msg('已取消删除')
        })
    },
    // 单机 文章添加标签
    Article_Tag_Toggle(tag, flag) {
      const that = this
      clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        const tagData = (
          flag === true ? this.label_Article : this.Article_Tag_Total_Deposit
        ).filter((c) => {
          if (c._id !== tag._id) {
            return c
          } else {
            flag === true
              ? this.Article_Tag_Total_Deposit.push(c)
              : this.label_Article.push(c)
          }
        })
        flag === true
          ? (this.label_Article = tagData)
          : (this.Article_Tag_Total_Deposit = tagData)
      }, 300)
    },
    // 缓存图片信息
    $imgAdd(pos, $file) {
      if ($file.size / 1024 / 1024 > 3) {
        this.$Msg('文章上传图片不应大于3M', 'wran')
        this.$refs.markDown.$refs.toolbar_left.$imgDelByFilename($file.name)
      } else {
        if (new RegExp('[\\u4E00-\\u9FFF]+', 'g').test($file.name)) this.$Msg('图片上传的文件名字尽量不要包含汉字！', 'wran')
        this.img_Articles[pos] = $file
      }
    },
    // 图片删除
    $imgDel(pos) {
      delete this.img_Articles[pos]
    },
    // 图片上传
    uploadimg() {
      const data = new FormData()
      for (const _img in this.img_Articles) {
        data.append('file', this.img_Articles[_img])
      }
      return new Promise((resolve, reject) => {
        upload_File(data, 'articleImg')
          .then((res) => {
            const { code, url, massage } = res.data
            if (code === 200) {
              url.forEach((c, i) => {
                this.$refs.markDown.$img2Url(i + 1, c.replace(/\s/g, '%20'))
              })
              resolve()
            } else if (code === 2) {
              this.$Msg(massage, 'wran')
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  computed: {
    ...mapState('article', ['Article_Tag_Total', 'Edit_Blog_Data']),
    ...mapState('login', ['Users']),
    ...mapGetters('login', ['set_Button_Power'])
  },
  beforeDestroy() {
    this.handle_Edit_Blog_Data([])
  },
  async created() {
    // 获取标签数据
    const Article_Tag = await this.Article_Tag_Find({ admin_Code: this.Users.admin_Code })
    if (this.Edit_Blog_Data.length !== 0) {
      const Edit_Blog_Tag = this.Edit_Blog_Data.label_Article.map(c => c.id_ArticleTag)
      const Tag = Article_Tag.reduce(
        (prev, cur) => {
          if (Edit_Blog_Tag.includes(cur.id_ArticleTag)) {
            prev.selectT.push(cur)
          } else {
            prev.AllT.push(cur)
          }
          return prev
        },
        { selectT: [], AllT: [] }
      )
      this.label_Article = Tag.selectT
      this.Article_Tag_Total_Deposit = Tag.AllT.filter(c => c._id !== '未分类')
      this.content_Article = this.Edit_Blog_Data.content_Article
      this.title_Article = this.Edit_Blog_Data.title_Article
    } else {
      this.Article_Tag_Total_Deposit = Article_Tag?.filter(c => c._id !== '未分类')
    }
  }
}
</script>

<style lang="less" scoped>
.AddBlog {
  width: 100%;
  height: calc(~'100vh - 30px');
  display: flex;
  .AddBlog_Left {
    width: 17%;
    background: #2b2b2bcc;
    backdrop-filter: blur(4px);
    color: white;
    font-size: 12px;
    .AddBlog_Left_BackH_Wrap {
      padding: 30px 18px 5px;
      text-align: center;
      .AddBlog_Left_BackH {
        font-size: 15px;
        padding: 12px 10%;
        color: #ec7259;
        border: 1px solid rgba(236, 114, 89, 0.8);
        border-radius: 20px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        span {
          transition: all 0.2s ease-in;
        }
        span:hover {
          color: #f67b63;
          transform: scale(1.1);
          font-weight: 900;
        }
      }
    }
    .AddBlog_Left_Tag_Article {
      width: 100%;
      margin: 30px 0;
      padding: 0 20px;
      box-sizing: border-box;
      p {
        text-align: center;
        font-size: 18px;
        position: relative;
      }
    }
    .AddBlog_Left_Tag_Wrap {
      width: 100%;
      height: 40%;
      padding: 0 20px;
      box-sizing: border-box;
      .AddBlog_Left_Tag_From {
        width: 100%;
        white-space: nowrap;
        padding: 0 10px;
        box-sizing: border-box;
        input {
          width: 100%;
          outline: none;
          background: rgba(0, 0, 0, 0);
          border: solid 1px #ffffffcc;
          color: white;
          height: 25px;
          text-indent: 8px;
        }
        span {
          font-size: 18px;
          margin-left: -25px;
          cursor: pointer;
        }
      }
      p {
        text-align: center;
        font-size: 18px;
        margin-top: 20px;
      }
    }
  }
  ul {
    width: 100%;
    height: 150px;
    border: 1px solid rgba(236, 114, 89, 0.8);
    padding: 10px;
    margin-top: 20px;
    box-sizing: border-box;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    li {
      padding: 8px 10px;
      background: #ac594ed4;
      border-radius: 10px 3px 10px 10px;
      margin: 5px 3px;
      cursor: pointer;
      position: relative;
      height: 16px;
      &:hover {
        background: #d67264d4;
      }
    }
  }
  .AddBlog_Right {
    width: 83%;
    height: calc(~'100vh - 30px');
    .AddBlog_Right_Top {
      height: 60px;
      background: #987b4e;
      display: flex;
      .AddBlog_Right_Top_Title {
        width: 78%;
        height: 60px;
        color: white;
        font-size: 18px;
        padding-left: 30px;
        display: flex;
        align-items: center;
        .AddBlog_Right_Top_Title_left {
          width: 60px;
          display: flex;
          flex-wrap: wrap;
        }
        input {
          width: calc(~'100% - 70px');
          border: none;
          background: #8f7348;
          outline: none;
          color: white;
          height: 40px;
          cursor: pointer;
          box-shadow: inset rgba(0, 0, 0, 0.2) 0px 0px 7px 0px;
          border-radius: 20px;
          text-indent: 20px;
        }
      }
      .AddBlog_Right_Top_Send {
        line-height: 60px;
        width: 18%;
        text-align: center;
        transition: all 0.2s;
        span {
          color: white;
          padding: 10px 20px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px 2px;
          border-radius: 20px;
          cursor: pointer;
        }
        &:hover {
          transform: translate3d(0, 3%, 0);
          font-size: 16px;
          span {
            box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 10px 2px;
          }
        }
      }
    }
    .markDown_Style {
      height: calc(~'100vh - 90px');
      /deep/ .v-note-op {
        border-radius: 0;
        .v-left-item {
          .op-icon {
            color: #ffffff !important;
            &:hover {
              background: #000;
            }
          }
        }
        .v-right-item {
          .op-icon {
            color: #ffffff !important;
            &:hover {
              background: #000;
            }
          }
          .selected {
            background: #000000;
          }
        }
      }
    }
    .fullscreen {
      height: calc(~'100vh - 30px');
      width: 100%;
      margin-left: 0;
      top: 30px;
    }
  }
}
</style>
