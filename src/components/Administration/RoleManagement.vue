<!--
 * @Author: Cxy
 * @Date: 2021-04-26 15:26:55
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-30 18:28:32
 * @FilePath: \blog\blogweb\src\components\Administration\RoleManagement.vue
-->
<template>
  <div class='role'>
    <div
      v-if='treeData.length > 0'
      class='tree_Role_Wrap'
      :style="{
        transform:
          'translate3d(' +
          (remove_Down_Role ? '-50%, -50%' : '-50%, 150%') +
          ', 0) ',
      }">
      <SHToolTip class='SHToolTip' eventType='hover' direction='left-start'>
        <p>
          <i
            class='fa fa-plus-square'
            style='padding-right: 10px'/>操作列有此图标为路由，除外为按钮
        </p>
        <i slot='icon' class='fa fa-question-circle' aria-hidden='true' />
      </SHToolTip>
      <SeaTree
        ref='seaTree'
        class='tree'
        :treeData='treeData'
        :check_Echo_Data='check_Echo_Data'
        @selectData='selectData'
        @add_Tree='add_Tree'
        @edit_Tree='edit_Tree'
        @delete_Tree='delete_Tree'/>
      <div class='tree_Handle'>
        <SHForm ref='form' style='display: flex; width: 60%' :rules='rules'>
          <SHInput v-model='role.name' label='名称' prop='name' />
          <SHInput v-model='role.describe' label='描述' />
        </SHForm>
        <SHButton type='primary' @click='save_Role()'>保存</SHButton>
        <SHButton @click='cancel_Save_Role()'>取消</SHButton>
      </div>
    </div>
    <SHButton v-if="set_Button_Power('add_Role')" type='primary' @click='add_Role()'>{{ remove_Down_Role ? "取消" : "" }}新增角色</SHButton>
    <div class='table_Role_Wrap'>
      <SHTable :tab_Title='tab_Title' :tab_Data='tableData'>
        <template v-slot:thead_Operation>
          <th style='width: 300px'>操作</th>
        </template>
        <template v-slot:tbody_Operation='slotProps'>
          <td style='width: 300px'>
            <SHButton
              v-if="set_Button_Power('edit_Role')"
              type='primary'
              icon='fa-pencil-square'
              @click='edit_Role(slotProps.row)'>编辑</SHButton>
            <SHButton
              v-if="set_Button_Power('delete_Role')"
              type='danger'
              icon='fa-trash'
              @click='delete_Role(slotProps.row)'>删除</SHButton>
          </td>
        </template>
      </SHTable>
      <SHPaging
        config='total, sizes, prev, pager, next, jumper'
        :btnPageNum='5'
        :total='page_Size.total'
        :pageSize='[10, 15, 30]'
        @currentPageOpar='currentPageOpar'/>
    </div>
  </div>
</template>

<script>
import SeaTree from 'components/tree.vue'
import {
  get_Power_Tree_Data,
  edit_Power_Tree,
  delete_Power_Tree,
  get_Role_Data,
  edit_Role_Data,
  delete_Role_Data
} from '@/http/model/role.js'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      treeData: [],
      tableData: [],
      page_Size: {
        skip: 1,
        limit: 10,
        total: 0
      },
      tab_Title: [
        { title: '角色名称', prop: 'name' },
        { title: '描述', prop: 'describe', width: '200' },
        { title: '创建者', prop: 'founder', width: '200' },
        { title: '创建时间', prop: 'created_At' }
      ],
      remove_Down_Role: false,
      role: {
        name: '',
        describe: ''
      },
      select_Tree_Data: {},
      check_Echo_Data: {}, // 选中数据回显
      select_Role_Data: {}, // 修改的数据信息
      rules: {
        name: { require: { massage: '请输入角色名称' }}
      }
    }
  },
  components: { SeaTree },
  computed: {
    ...mapState('login', ['Users']),
    ...mapGetters('login', ['set_Button_Power'])
  },
  methods: {
    currentPageOpar(pageSize) {
      const { skip, limit } = pageSize
      this.page_Size.skip = skip
      this.page_Size.limit = limit
      this.get_Role_List()
    },
    save_Role() {
      this.$refs.form.validate((c) => {
        if (!c) return
        const params = {
          founder: this.Users.admin_Code,
          ...this.role
        }
        if (this.select_Role_Data._id) {
          params._id = this.select_Role_Data._id
          params.powerData =
            Object.keys(this.select_Tree_Data).length === 0
              ? this.select_Role_Data.powerData
              : this.select_Tree_Data
        } else {
          params.powerData = this.select_Tree_Data
        }
        if (Object.values(params.powerData).length === 0) {
          return this.$Msg('路由数据不为空', 'wran')
        }
        edit_Role_Data(params).then((res) => {
          const { code, massage } = res.data
          if (code === 200) {
            this.get_Role_List()
            this.cancel_Save_Role()
          } else {
            this.$Msg(massage, 'faild')
          }
        })
      })
    },
    edit_Role(c) {
      if (!this.remove_Down_Role) this.remove_Down_Role = true
      this.select_Role_Data = c
      this.check_Echo_Data = c.powerData
      this.role.name = c.name
      this.role.describe = c.describe
    },
    delete_Role(c) {
      const { _id } = c
      this.$MsgBox('是否删除', 'wran')
        .then(() => {
          delete_Role_Data({ _id }).then((res) => {
            const { code, massage } = res.data
            if (code === 200) {
              this.get_Role_List()
            } else {
              this.$Msg(massage, 'faild')
            }
          })
        })
        .catch(() => this.$Msg('删除已取消'))
    },
    get_Role_List() {
      const { skip, limit } = this.page_Size
      get_Role_Data({ skip, limit }).then((res) => {
        const { code, data, massage } = res.data
        if (code === 200) {
          this.tableData = data.data || []
          this.page_Size.total = data.countNum
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    // 添加树
    add_Tree(data, callback) {
      edit_Power_Tree(data).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          callback()
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    // 修改树
    edit_Tree(data, callback) {
      edit_Power_Tree(data).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          callback()
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    // 删除树
    delete_Tree(data, callback) {
      delete_Power_Tree(data).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          callback()
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    // 获取权限树
    get_power_Tree_List() {
      return new Promise((resolve) => {
        get_Power_Tree_Data().then((res) => {
          const { code, data } = res.data
          if (code === 200) {
            this.treeData = data.data || []
            resolve()
          }
        })
      })
    },
    // 树权限选中的数据
    selectData(data) {
      this.select_Tree_Data = data
    },
    add_Role() {
      this.remove_Down_Role = !this.remove_Down_Role
    },
    cancel_Save_Role() {
      this.check_Echo_Data = { checked: [], checkSemi: [] }
      this.role.name = ''
      this.role.describe = ''
      this.select_Tree_Data = {}
      this.select_Role_Data = {}
      this.remove_Down_Role = false
      this.$refs.form.resetFields()
    }
  },
  async created() {
    this.get_Role_List()
    await this.get_power_Tree_List()
  }
}
</script>

<style lang="less" scoped>
.SHToolTip {
  position: absolute;
  right: 60px;
}
.role {
  flex: 1;
  margin: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  .tree_Role_Wrap {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.14);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid 1px #ccc6;
    padding: 20px 20px 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    top: 50%;
    left: 50%;
    width: 85%;
    height: 75%;
    background: #fff;
    z-index: 1;
    .tree {
      width: 85%;
      overflow-y: scroll;
      height: 90%;
    }
    .tree_Handle {
      width: 85%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 30px;
      .SHInput {
        width: 45%;
      }
      input {
        margin-right: 15px;
      }
      .SHButton {
        padding: 8px 14px;
        &:nth-child(3) {
          margin-left: 15px;
        }
        &:nth-child(4) {
          margin-left: 15px;
        }
      }
    }
  }
  .table_Role_Wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 20px;
    .SHButton {
      &:last-child {
        margin-left: 15px;
      }
    }
    .SHPaging {
      margin-right: 45px;
    }
  }
}
</style>
