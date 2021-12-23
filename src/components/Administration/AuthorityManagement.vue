<!--
 * @Author: Cxy
 * @Date: 2021-04-26 15:26:11
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-20 17:52:42
 * @FilePath: \blog\blogweb\src\components\Administration\AuthorityManagement.vue
-->
<template>
  <div class='Authority'>
    <SHTable :tab_Title='tab_Title' :tab_Data='tableData'>
      <template v-slot:thead_Operation>
        <th style='width: 350px'>操作</th>
      </template>
      <template v-slot:tbody_Operation='slotProps'>
        <td style='width: 350px'>
          <SHToolTip :ref='"SHToolTip" + slotProps.row.i' eventType='hover' direction='left'>
            <ul class='ul'>
              <li
                v-for='c in role_List_Data'
                :key='c._id'
                :style="{
                  cursor:
                    slotProps.row.admin_level === c._id
                      ? 'not-allowed'
                      : 'pointer',
                }"
                @click.stop='choose_Roles(c, slotProps.row)'>
                {{ c.name }}
              </li>
            </ul>
            <SHButton
              slot='icon'
              :class="
                open_Close_id === slotProps.row._id ? 'select_Button_Style' : ''
              "
              type='primary'
              icon='fa-tasks'>
              选择角色
            </SHButton>
          </SHToolTip>
          <SHButton
            v-if='slotProps.row.frozen_State === 1'
            type='warn'
            icon='fa-unlock'
            @click="unfreezing_frozen_Person(slotProps.row, 'unfreezing')">解除冻结</SHButton>
          <SHButton
            v-if='slotProps.row.frozen_State === 0'
            type='danger'
            icon='fa-unlock-alt'
            @click="unfreezing_frozen_Person(slotProps.row, 'frozen')">
            冻结
          </SHButton>
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
</template>

<script>
import {
  get_All_Registered_Users,
  unfreezing_Person
} from '@/http/model/user.js'
import { get_Role_Data, user_Edit_Role } from '@/http/model/role.js'
export default {
  data() {
    return {
      tableData: [], // 人员数据
      tab_Title: [
        { title: '账号', prop: 'admin_Code' },
        { title: '昵称', prop: 'nick_Name' },
        { title: '角色', prop: 'role_Name' },
        { title: '冻结状态', prop: 'frozen' },
        { title: '登录设备', prop: 'Login_Device' },
        { title: '注册时间', prop: 'created_At', width: '200' }
      ],
      open_Close_id: '', // 角色展示隐藏
      role_List_Data: [], // 角色列表
      page_Size: {
        skip: 1,
        limit: 10,
        total: 0
      }
    }
  },
  methods: {
    currentPageOpar(pageSize) {
      const { skip, limit } = pageSize
      this.page_Size.skip = skip
      this.page_Size.limit = limit
      this.get_Person_List()
    },
    choose_Roles(role_Data, admin_Data) {
      if (role_Data._id === admin_Data.admin_level) return false
      this.$refs['SHToolTip' + admin_Data.i].SHOpertion()
      const params = {
        _id: admin_Data._id,
        admin_level: role_Data._id,
        role_Name: role_Data.name
      }
      user_Edit_Role(params).then((res) => {
        const { code, massage } = res.data
        if (code === 200) {
          this.get_Person_List()
          this.open_Close_id = ''
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    },
    // 冻结账户 解除冻结
    unfreezing_frozen_Person(c, state) {
      unfreezing_Person(Object.assign(c, { state })).then((res) => {
        if (res.data.code === 200) {
          this.get_Person_List()
        }
      })
    },
    get_Person_List() {
      const { skip, limit } = this.page_Size
      get_All_Registered_Users({ skip, limit }).then((res) => {
        const { code, data } = res.data
        if (code === 200) {
          data.data?.map((c) => {
            c.frozen = c.frozen_State === 0 ? '未冻结' : '已冻结'
          })
          this.tableData = data.data || []
          this.page_Size.total = data.countNum
        }
      })
    },
    get_Role_List() {
      get_Role_Data().then((res) => {
        const { code, data, massage } = res.data
        if (code === 200) {
          this.role_List_Data = data.data
        } else {
          this.$Msg(massage, 'faild')
        }
      })
    }
  },
  created() {
    this.get_Person_List()
    this.get_Role_List()
  }
}
</script>

<style lang="less" scoped>
.ToolTipUi {
  .SHButton {
    padding: 8px 18px;
  }
  ul{
    li {
      padding: 4px 20px;
      &:hover {
        background: rgb(102, 102, 102);
      }
    }
  }
}
.Authority {
  flex: 1;
  overflow-y: auto;
  position: relative;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .SHButton {
    &:last-child{
      margin-left: 15px;
    }
  }
  .select_Button_Style {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  .SHTable {
    flex: 1;
  }
  .SHPaging {
    margin-right: 45px;
  }
}
</style>
