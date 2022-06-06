<!--
 * @Author: Cxy
 * @Date: 2021-06-17 16:16:55
 * @LastEditors: Cxy
 * @LastEditTime: 2022-06-03 18:51:23
 * @FilePath: \ehomes-admind:\blog\blogWeb\src\components\myManagement\basicSettings.vue
-->
<template>
  <div class='basicSettings'>
    <div class='head_Portrait'>
      <SHImage v-if="form.head_Portrait !== ''" class='head_Portrait_Img' :src='form.head_Portrait' />
      <i v-else class='fa fa-user-circle' aria-hidden='true'/>
      <SHButton type='primary' icon='fa-cloud-upload' @click='$refs.head_Portrait.click()'>点击上传</SHButton>
      <SHButton v-if="form.head_Portrait !== ''" type='danger' icon='fa-eraser' @click="form.head_Portrait = ''">删除</SHButton>
      <input ref='head_Portrait' type='file' @change="changeUploadFile('head_Portrait')" >
    </div>
    <SHForm ref='form' :rules='rules'>
      <SHInput v-model='form.nick_Name' label='昵称' placeholder='请新输入昵称' prop='nick_Name' />
      <SHInput v-model='form.original_Password' label='原密码' type='password' placeholder='请原输入密码' autocomplete='off' prop='original_Password' />
      <SHInput v-model='form.pass_Word' label='新密码' type='password' placeholder='请新输入密码' autocomplete='off' prop='pass_Word' />
      <SHInput v-model='form.My_Qq' label='关联QQ' placeholder='请新输入QQ' prop='My_Qq' />
      <SHInput v-model='form.My_Wb' label='关联微博' placeholder='请新输入微博地址' prop='My_Wb' />
      <SHInput class='upload_Custom' label='关联微信图片' value='上传' type='button' @click='$refs.My_Wx.click()' />
      <input ref='My_Wx' style='display: none;' type='file' @change="changeUploadFile('My_Wx')" >
      <SHImage class='wx_Bg' title='关联微信' :src='form.My_Wx' />
      <SHInput class='upload_Custom' label='打赏二维码(微信)' value='上传' type='button' @click='$refs.My_Reward_Wx.click()' />
      <input ref='My_Reward_Wx' style='display: none;' type='file' @change="changeUploadFile('My_Reward_Wx')" >
      <SHImage class='wx_Bg My_Reward_Wx_Bg' title='打赏微信' :src='form.My_Reward_Wx' />
      <SHInput class='upload_Custom' label='打赏二维码(支付宝)' value='上传' type='button' @click='$refs.My_Reward_Zfb.click()' />
      <input ref='My_Reward_Zfb' style='display: none;' type='file' @change="changeUploadFile('My_Reward_Zfb')" >
      <SHImage class='wx_Bg My_Reward_Wx_Bg My_Reward_Zfb_Bg' title='打赏支付宝' :src='form.My_Reward_Zfb' />
      <SHInput v-model='form.brief_Introduction' label='简介' type='textarea' placeholder='请输入简介' prop='brief_Introduction' />
    </SHForm>
    <SHButton v-if='save_Flag' type='primary' icon='fa-floppy-o' @click='save'>保存</SHButton>
    <SHButton v-if='save_Flag' type='warn' icon='fa-repeat' style='margin-left: 20px' @click='reset'>重置</SHButton>
  </div>
</template>

<script>
import { save_Basic_Settings } from '@/http/model/user.js'
import { upload_File } from '@/http/model/article.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { equals, deepClone } from '@/until'
export default {
  data() {
    const checkPwd = (value, calLback) => {
      if (value === this.form.original_Password && value.length !== 0) {
        calLback('原密码与新密码不能相同')
      } else {
        calLback()
      }
    }
    const checkQq = (value, calLback) => {
      if (value === '') {
        calLback()
      } else if (!/^[1-9][0-9]{4,14}$/.test(value)) {
        calLback('请输入正确的QQ号')
      } else {
        calLback()
      }
    }
    const checkWb = (value, calLback) => {
      if (value === '' || value === 'https://weibo.com/u/') {
        calLback()
      } else if (!/^https:\/\/weibo.com\/u\/[1-9]\d{9}$/.test(value)) {
        calLback('请输入正确的网址')
      } else {
        calLback()
      }
    }
    return {
      form: {
        head_Portrait: '',
        nick_Name: '',
        original_Password: '',
        pass_Word: '',
        My_Qq: '',
        My_Wb: 'https://weibo.com/u/',
        My_Wx: '',
        My_Reward_Wx: '',
        My_Reward_Zfb: '',
        brief_Introduction: ''
      },
      rules: {
        nick_Name: {
          minLen: { massage: '昵称不能小于3个字符', numLen: 3 },
          maxLen: { massage: '昵称长度不能大于10字符', numLen: 10 },
          require: { massage: '请输入昵称' }
        },
        original_Password: {
          minLen: { massage: '密码长度不能小于6位', numLen: 6 },
          maxLen: { massage: '密码长度不能大于12位', numLen: 12 }
        },
        pass_Word: {
          minLen: { massage: '密码长度不能小于6位', numLen: 6 },
          maxLen: { massage: '密码长度不能大于12位', numLen: 12 },
          validator: { meth: checkPwd }
        },
        My_Qq: { validator: { meth: checkQq }},
        My_Wb: { validator: { meth: checkWb }},
        brief_Introduction: {
          maxLen: { massage: '不能大于256个字', numLen: 256 }
        }
      },
      save_Flag: false
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    ...mapGetters('login', ['session_Clear_User'])
  },
  methods: {
    ...mapMutations('login', ['session_Set_User']),
    reset() {
      this.clearForm()
      this.$refs.form.resetFields()
    },
    save() {
      this.$refs.form.validate(async(c) => {
        if (!c) return
        if (this.formCopy.head_Portrait && this.form.head_Portrait === '') { return this.$Msg('请上传头像', 'wran') }
        const {
          form: { nick_Name, original_Password, pass_Word, My_Qq, My_Wb, brief_Introduction }
        } = this
        const params = {
          nick_Name,
          admin_Code: this.Users.admin_Code,
          My_Qq,
          My_Wb
        }
        if (this.form.head_Portrait && this['head_Portrait']) {
          const imgUrl = await this.uploadFileInterface('head_Portrait')
          this.form.head_Portrait = imgUrl
          params.head_Portrait = imgUrl
        }
        if (this.form.My_Wx && this['My_Wx']) {
          const imgUrl = await this.uploadFileInterface('My_Wx')
          this.form.My_Wx = imgUrl
          params.My_Wx = imgUrl
        }
        if (this.form.My_Reward_Wx && this['My_Reward_Wx']) {
          const imgUrl = await this.uploadFileInterface('My_Reward_Wx')
          this.form.My_Reward_Wx = imgUrl
          params.My_Reward_Wx = imgUrl
        }
        if (this.form.My_Reward_Zfb && this['My_Reward_Zfb']) {
          const imgUrl = await this.uploadFileInterface('My_Reward_Zfb')
          this.form.My_Reward_Zfb = imgUrl
          params.My_Reward_Zfb = imgUrl
        }
        if (original_Password !== '') {
          params.original_Password = original_Password
          params.pass_Word = pass_Word
        }
        params.brief_Introduction = brief_Introduction
        save_Basic_Settings(params).then((res) => {
          const { code, massage } = res.data
          if (code === 200) {
            this.session_Set_User(params)
            this.formCopy = deepClone(this.form)
            this.save_Flag = false
            this.$Msg(massage, 'success')
          } else {
            this.$Msg(massage, 'wran')
          }
        })
      })
    },
    changeUploadFile(fileName) {
      const typeFileTesting = ['jpeg', 'gif', 'png']
      const uploadData = this.$refs[fileName].files[0]
      if (!typeFileTesting.includes(uploadData.type.replace(/.*\//, ''))) {
        this.$Msg('图片格式错误，请重新上传jpeg、gif、png', 'faild')
      } else {
        this[fileName] = new FormData()
        this[fileName].append('file', uploadData)
        this.form[fileName] = window.webkitURL.createObjectURL(
          this.$refs[fileName].files[0]
        )
      }
    },
    uploadFileInterface(fileName) {
      return new Promise((resolve, reject) => {
        upload_File(this[fileName], 'headPortrait')
          .then((res) => {
            const { code, url, massage } = res.data
            if (code === 200) {
              resolve(url[0].replace(/\s/g, '%20'))
            } else {
              this.$Msg(massage, 'wran')
            }
          })
          .then((err) => reject(err))
      })
    },
    clearForm() {
      this.form.head_Portrait = this.Users.head_Portrait || ''
      this.form.nick_Name = this.Users.nick_Name || ''
      this.form.original_Password = ''
      this.form.pass_Word = ''
      this.form.brief_Introduction = this.Users.brief_Introduction || ''
      this.form.My_Qq = this.Users.My_Qq || ''
      this.form.My_Wb = this.Users.My_Wb || 'https://weibo.com/u/'
      this.form.My_Wx = this.Users.My_Wx || ''
      this.form.My_Reward_Wx = this.Users.My_Reward_Wx || ''
      this.form.My_Reward_Zfb = this.Users.My_Reward_Zfb || ''
    }
  },
  created() {
    this.clearForm()
    this.formCopy = deepClone(this.form)
  },
  mounted() {
    this.$watch(
      'form',
      (newV) => {
        if (equals(this.formCopy, newV)) {
          this.save_Flag = false
        } else {
          this.save_Flag = true
        }
      },
      {
        immediate: false,
        deep: true
      }
    )
  }
}
</script>

<style lang="less" scoped>
.basicSettings {
  flex: 1;
  border: 20px solid #f0f8ff;
  margin-left: 20px;
  box-shadow: 0px 0px 15px 0px #8e8e8e47;
  border-radius: 10px;
  background: #f0f8ff;
  overflow-y: scroll;
  .head_Portrait {
    margin-bottom: 16px;
    i {
      font-size: 100px;
      vertical-align: middle;
      margin-top: 4px;
    }
    .head_Portrait_Img {
      width: 100px;
      height: 100px;
      display: inline-block;
      vertical-align: middle;
      /deep/ .preview_Img {
        border-radius: 50%;
        border: 1px solid #ddd;
      }
    }
    .SHButton {
      margin-left: 30px;
      padding: 10px 10px;
    }
    input {
      display: none;
    }
  }
  .SHForm {
    position: relative;
    .SHInput {
      margin-bottom: 16px;
      width: 350px;
      /deep/ label {
        width: 110px;
      }
    }
    .upload_Custom {
      /deep/ label {
        width: 170px;
      }
      /deep/ .inputUi_Input {
        input {
          background: #409eff;
          color: #fff;
          cursor: pointer;
          &:hover {
            background-color: #6ab4ff;
            color: #fff;
            border-color: #6ab4ff;
          }
        }
      }
    }
    .wx_Bg {
      position: absolute;
      width: 100px;
      height: 100px;
      left: 380px;
      bottom: 165px;
      border: solid 1px #dcdfe6;
      background-size: cover;
      border-radius: 4px;
    }
    .My_Reward_Wx_Bg {
      bottom: 40px;
    }
    .My_Reward_Zfb_Bg {
      left: 505px;
    }
  }
  .SHButton {
    padding: 10px 15px;
  }
}
</style>
