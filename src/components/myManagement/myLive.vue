<!--
 * @Descripttion:
 * @Author: Cxy
 * @Date: 2022-05-30 19:06:36
 * @LastEditors: Cxy
 * @LastEditTime: 2022-06-04 23:41:38
 * @FilePath: \ehomes-admind:\blog\blogWeb\src\components\myManagement\myLive.vue
-->
<template>
  <div class='myLive'>
    <SHForm ref='form' :rules='rules'>
      <SHInput
        v-model='form.id'
        label='房间ID'
        :readonly='updateRoomNumFlg ? false : true'
        prop='id'>
        <SHButton
          type='primary'
          :icon="updateRoomNumFlg ? 'fa-floppy-o' : 'fa-pencil'"
          @click='editRoomNum'>{{ updateRoomNumFlg ? "保存" : "修改" }}</SHButton>
        <SHButton
          v-if='updateRoomNumFlg'
          @click='
            (updateRoomNumFlg = !updateRoomNumFlg), (form.id = formCopy.id)
          '>取消</SHButton>
      </SHInput>
      <SHInput v-model='form.room_Title' label='房间标题' prop='room_Title' />
      <SHInput v-model='room_Address' readonly label='推流地址'>
        <SHButton type='primary' @click='copy_Content(room_Address)'>复制推流地址</SHButton>
      </SHInput>
      <SHInput
        v-model='room_Key'
        readonly
        label='推流密钥'
        title='推流密钥五分钟后自动失效'>
        <SHToolTip eventType='hover' direction='right' iconColor='#000'>
          <p>推流密钥五分钟后自动失效</p>
          <SHButton
            v-if='room_Key'
            slot='icon'
            type='primary'
            @click="copy_Content(room_Key), (room_Key = '')">复制推流地址</SHButton>
          <SHButton v-else slot='icon' type='primary' @click='get_Room_Key_Oper'>获取推流地址</SHButton>
        </SHToolTip>
      </SHInput>
      <SHInput
        class='upload_Custom'
        label='直播封面'
        value='上传'
        type='button'
        @click='$refs.live_Image.click()'/>
      <input
        ref='live_Image'
        style='display: none'
        type='file'
        @change="changeUploadFile('live_Image')">
      <SHImage class='live_Image' :src='form.live_Image' />
      <SHInput
        v-model='form.room_Description'
        label='房间描述'
        type='textarea'
        prop='room_Description'/>
      <SHInput
        v-model='domain_Name'
        readonly
        label='当前域名'
        prop='domain_Name'>
        <SHButton type='primary' @click="$router.push('/LiveUser/' + form.id)">进入直播间</SHButton>
      </SHInput>
    </SHForm>
    <SHButton v-if='save_Flag' type='primary' icon='fa-floppy-o' @click='save'>保存</SHButton>
    <SHButton
      v-if='save_Flag'
      type='warn'
      icon='fa-repeat'
      style='margin-left: 20px'
      @click='reset'>重置</SHButton>
  </div>
</template>

<script>
import {
  get_Live_Data,
  set_Live_Data,
  id_Duplicate_Check,
  get_Room_Key
} from '@/http/model/live'
import { upload_File } from '@/http/model/article.js'
import { mapState } from 'vuex'
import { deepClone, equals } from '@/until'
export default {
  data() {
    const letterNum = (value, calLback) => {
      if (/[\W]/g.test(value)) {
        calLback('房间id只能是数字和字母')
      } else {
        calLback()
      }
    }
    return {
      form: {
        id: '',
        room_Title: '',
        room_Description: '',
        live_Image: ''
      },
      rules: {
        id: {
          maxLen: { massage: '房间ID长度不能大于10字符', numLen: 10 },
          require: { massage: '请输入房间ID' },
          validator: { meth: letterNum }
        }
      },
      updateRoomNumFlg: false,
      formCopy: {},
      save_Flag: false,
      room_Address: 'rtmp://seahappy.xyz/seaLive',
      room_Key: ''
    }
  },
  methods: {
    get_Room_Key_Oper() {
      const { id } = this.form
      get_Room_Key({ id }).then(
        ({
          data: {
            code,
            data: { room_Key }
          }
        }) => {
          if (code === 200) {
            this.room_Key = room_Key
          }
        }
      )
    },
    copy_Content(url) {
      const copyEle = document.createElement('input')
      document.body.appendChild(copyEle)
      copyEle.value = url
      copyEle.focus()
      copyEle.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      copyEle.blur()
      this.$Msg('复制成功', 'success')
      document.body.removeChild(copyEle)
    },
    save() {
      if (this.updateRoomNumFlg) {
        return this.$Msg('请输入房间ID或点击取消房间ID设置', 'wran')
      }
      this.$refs.form.validate(async(c) => {
        if (!c) return
        if (this.form.live_Image && this['live_Image']) {
          const imgUrl = await this.uploadFileInterface('live_Image')
          this.form.live_Image = imgUrl
        }
        set_Live_Data(this.form).then(({ data: { code, massage }}) => {
          if (code === 200) {
            this.formCopy = deepClone(this.form)
            this.save_Flag = false
            this.$Msg(massage, 'success')
          } else {
            this.$Msg(massage, 'wran')
          }
        })
      })
    },
    editRoomNum() {
      this.$refs.form.validate((c) => {
        if (!c) return
        const { id } = this.form
        if (this.updateRoomNumFlg && this.formCopy.id !== id) {
          id_Duplicate_Check({ id }).then(
            ({ data: { code, massage, data }}) => {
              if (code === 200 && data.data.length) {
                this.$Msg(massage, 'faild')
              } else {
                this.updateRoomNumFlg = !this.updateRoomNumFlg
              }
            }
          )
        } else {
          this.updateRoomNumFlg = !this.updateRoomNumFlg
        }
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
        console.log(this.form)
      }
    },
    uploadFileInterface(fileName) {
      return new Promise((resolve, reject) => {
        upload_File(this[fileName], 'liveImage')
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
    get_Live_Data_Oper() {
      const {
        Users: { admin_Code }
      } = this
      get_Live_Data({ admin_Code }).then((res) => {
        const {
          code,
          data: { data }
        } = res.data
        if (code === 200) {
          Object.assign(this.form, data[0])
          this.formCopy = deepClone(data[0])
        }
      })
    },
    reset() {
      this.form = deepClone(this.formCopy)
      this.$refs.form.resetFields()
    }
  },
  computed: {
    ...mapState('login', ['Users']),
    domain_Name() {
      return 'https://www.seahappy.xyz/LiveUser/' + this.form.id
    }
  },
  created() {
    this.get_Live_Data_Oper()
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

<style lang='less' scoped>
.myLive {
  flex: 1;
  border: 20px solid #f0f8ff;
  margin-left: 20px;
  box-shadow: 0px 0px 15px 0px #8e8e8e47;
  border-radius: 10px;
  background: #f0f8ff;
  overflow-y: scroll;
  .SHForm {
    margin-bottom: 36px;
    position: relative;
    .SHInput {
      margin-bottom: 16px;
      width: 470px;
      .inputUi_Input {
        .SHButton {
          padding: 0 14px;
          margin-left: 15px;
        }
        .toolTip {
          position: relative;
          bottom: 0px;
          .SHButton {
            padding: 9.5px 14px;
          }
        }
      }
      /deep/ label {
        width: 90px;
      }
    }
    .room_Address {
      /deep/ .inputUi_Input {
        input {
          background: #409eff;
          color: #fff;
          cursor: pointer;
          height: 100%;
          &:hover {
            background-color: #6ab4ff;
            color: #fff;
            border-color: #6ab4ff;
          }
        }
      }
    }
    .upload_Custom {
      /deep/ label {
        width: 390px;
        height: 150px;
        position: relative;
      }
      /deep/ .inputUi_Input {
        input {
          background: #409eff;
          color: #fff;
          cursor: pointer;
          height: 100%;
          &:hover {
            background-color: #6ab4ff;
            color: #fff;
            border-color: #6ab4ff;
          }
        }
      }
    }
    .live_Image {
      position: absolute;
      width: 280px;
      height: 145px;
      top: 206px;
      left: 90px;
      border: solid 1px #dcdfe6;
      background-size: cover;
      border-radius: 4px;
    }
  }
}
</style>
