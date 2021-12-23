<!--
 * @Author: Cxy
 * @Date: 2021-05-28 20:33:14
 * @LastEditors: Cxy
 * @LastEditTime: 2021-12-11 16:58:28
 * @FilePath: \blog\blogweb\src\components\tree.vue
-->
<template>
  <div>
    <SeaTreeItem :treeData='treeDataCopy' @selectData='selectData' @handle_Total_Tree='handle_Total_Tree' />
    <SHButton ref='active_Btn' style='padding: 6px 12px; margin-top: 15px' type='primary' @click='add_All_Role'>
      <i style='margin-right: 0' class='fa fa-plus-square'/>
    </SHButton>
    <div ref='active_Dia' :style="{ transform: active_Dia ? 'scale(1)' : 'scale(0)' }" class='dia_Tree' style='bottom: -83px; left: 55px'>
      <div class='dia_Tree_Item'>
        <p>path:</p>
        <input v-model='powerData.path' >
      </div>
      <div class='dia_Tree_Item'>
        <p>title:</p>
        <input v-model='powerData.title' @keydown.enter='add_Batten_Data()' >
      </div>
      <div class='dia_Tree_Item'>
        <p>type:</p>
        <select v-model='powerData.type'>
          <option value='router'>路由</option>
          <option value='button'>按钮</option>
        </select>
        <SHButton style='padding: 6px 12px' type='primary' @click='add_Batten_Data()'>确定</SHButton>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/until'
export default {
  name: 'SeaTree',
  props: {
    treeData: {
      type: Array
    },
    check_Echo_Data: {
      type: Object
    }
  },
  data() {
    return {
      treeDataCopy: [],
      active_Dia: false,
      powerData: {
        path: '',
        title: '',
        type: 'router'
      },
      Id_node_Tree: 0
    }
  },
  created() {
    const map_Table = this.treeData.reduce((prev, cur) => {
      prev[cur['id']] = cur
      return prev
    }, {})
    const arrangements_data = this.treeData.reduce((prev, cur) => {
      const father_Id = cur.pid
      const father_Memo = map_Table[father_Id]
      if (father_Id) {
        father_Memo.child
          ? father_Memo.child.push(cur)
          : (father_Memo.child = [cur])
      } else {
        prev.push(cur)
      }
      return prev
    }, [])
    const arr = (treeData, moveLeft = '') => {
      return treeData.reduce((prev, cur, index) => {
        const _index = moveLeft + (moveLeft === '' ? '' : '-') + index
        this.$set(cur, 'arrow', false)
        this.$set(cur, 'checked', false)
        this.$set(cur, 'seaId', _index)
        this.$set(cur, 'checkSemi', false)
        if (cur.child && cur.child.length) {
          arr(cur.child, _index)
        }
        prev.push(cur)
        return prev
      }, [])
    }
    this.treeDataCopy = arr(arrangements_data)
    bus.$on('remove_Active_Tree', () => {
      this.active_Dia = false
    })
    document.body.addEventListener('click', this.bodyClick, false)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.bodyClick, false)
  },
  components: {
    SeaTreeItem: {
      name: 'SeaTreeItem',
      template: `
        <div class="tree">
          <ul v-for="(c, i) in treeDataCopy" :key="i" class="tree_ul">
            <span
              v-if="c.child && c.child.length > 0"
              class="tree_Arrow"
              :style="{
                transform: c.arrow ? 'rotate(90deg)' : 'rotate(0deg)',
                left: c.seaId.split('-').length * 20 - 18 + 'px',
              }"
              @click="open_Close_Tree(c)"
            ></span>
            <li
              :style="{
                paddingLeft: c.seaId.split('-').length * 23 + 'px',
              }"
              :class="active_tree === c.seaId ? 'tree_Active' : ''"
              class="tree_li"
              @click="open_Close_Tree(c)"
            >
              <SHCheckBox :checkAll="c.checked" :checkSemi="c.checkSemi" @change="changeBox(c)" />
              <span style="vertical-align: top;cursor: pointer;position: relative;top: -1px;">{{ c.title }}</span>
              <div class="edit_Tree" @click.stop>
                <span
                  class="fa"
                  v-for="v in editData"
                  :key="v._c"
                  :style="{
                    display: treeDataCopy.length === 1 || (c.type === 'button' && v._c === 'add') ? 'none' : 'inline-block'
                  }"
                  :class="v.path"
                  @click="handle_Tree(v._c, c)"
                ></span>
                <div :style="{transform: active_Dia === c.seaId ? 'scale(1)' : 'scale(0)'}" class="dia_Tree">
                  <div class="dia_Tree_Item">
                    <p>path:</p>
                    <input v-model="powerData.path"></input>
                  </div>
                  <div class="dia_Tree_Item">
                    <p>title:</p>
                    <input v-model="powerData.title" @keydown.enter="confirm_Operation_Button_Tree(c)"></input>
                  </div>
                  <div class="dia_Tree_Item">
                    <p>type:</p>
                    <select v-model="powerData.type">
                      <option value="router">路由</option>
                      <option value="button">按钮</option>
                    </select>
                    <SHButton
                      @click="confirm_Operation_Button_Tree(c)"
                      style="padding: 6px 12px"
                      type="primary"
                      >确定</SHButton
                    >
                  </div>
                </div>
              </div>
            </li>
            <SeaTreeItem 
              ref="sonTree"
              v-if="c.child && c.child.length && c.arrow" 
              :treeData="c.child" 
              @pass_Father_Checked_Semi="pass_Father_Checked_Semi" 
              @selectData="selectData"
              @handle_Total_Tree="handle_Total_Tree"
              @pass_Father_Delete_Data_Tree="pass_Father_Delete_Data_Tree"
            />
          </ul>
        </div>
      `,
      props: {
        treeData: {
          type: Array
        }
      },
      data() {
        return {
          treeDataCopy: this.treeData,
          // 树背景激活标记
          active_tree: '',
          // 树节点操作组
          editData: [
            { path: 'fa-plus-square', _c: 'add' },
            { path: 'fa-pencil-square', _c: 'edit' },
            { path: 'fa-window-close', _c: 'delete' }
          ],
          // 弹框显隐
          active_Dia: '',
          // 弹框数据
          powerData: {
            path: '',
            title: '',
            type: ''
          },
          // 创建节点数据id
          Id_node_Tree: '',
          // 操作选中子节点数据
          child_Node_Data: {}
        }
      },
      methods: {
        /**
         * @description: 树增删改组操作
         * @param {*} code 操作类型
         * @param {*} data  选中数据
         */
        handle_Tree(code, data) {
          this.code_Button_Tree = code
          this.child_Node_Data = data
          switch (code) {
            case 'add':
              this.add_Tree(data)
              break
            case 'edit':
              this.edit_Tree(data)
              break
            default:
              this.delete_Tree(data)
              break
          }
        },
        /**
         * @description: 树添加弹框操作
         */
        add_Tree(data) {
          if (this.powerData.title) this.powerData.title = ''
          if (this.powerData.path) this.powerData.path = ''
          if (this.powerData.type) this.powerData.type = ''
          bus.$emit('remove_Active_Tree')
          this.active_Dia = data.seaId
          this.active_tree = data.seaId
        },
        /**
         * @description: 树修改弹框操作赋值
         */
        edit_Tree(data) {
          this.powerData.title = data.title
          this.powerData.path = data.path
          this.powerData.type = data.type
          bus.$emit('remove_Active_Tree')
          this.active_Dia = data.seaId
          this.active_tree = data.seaId
        },
        /**
         * @description: 子节点驱动父节点删除方法
         */
        delete_Tree(data) {
          const delete_Arranguments = (child) => {
            return child.reduce((prev, { id, child = [] }) => {
              return prev.concat(id, delete_Arranguments(child))
            }, [])
          }
          const delete_All_Id = (
            data.child ? delete_Arranguments(data.child) : []
          ).concat(data.id)
          this.$MsgBox('是否删除', 'wran')
            .then(() => {
              this.handle_Total_Tree(
                'delete',
                { id: delete_All_Id },
                this.Determine_Delete_Tree_Success
              )
            })
            .catch(() => this.$Msg('取消删除'))
        },
        /**
         * @description: 后端删除节点成功后的回调
         */
        Determine_Delete_Tree_Success() {
          const data = this.child_Node_Data
          if (data.pid === 0) {
            this.treeDataCopy.splice(Number(data.seaId), 1)
          } else {
            this.$emit('pass_Father_Delete_Data_Tree', data.seaId)
          }
        },
        /**
         * @description: 树父节点删除子集
         */
        pass_Father_Delete_Data_Tree(_SeaData) {
          const father_Id = _SeaData.substring(
            _SeaData.length - 3,
            _SeaData.length - 2
          )
          const delete_index = this.treeDataCopy[father_Id].child.findIndex(
            (item) => item.seaId === _SeaData
          )
          this.treeDataCopy[father_Id].child.splice(delete_index, 1)
          if (this.treeDataCopy[father_Id].child.length === 0) {
            this.treeDataCopy[father_Id].arrow = false
          }
        },
        /**
         * @description: 树节点弹框确认操作
         */
        confirm_Operation_Button_Tree(data) {
          const { title, path, type } = this.powerData
          if (title === '') return this.$Msg('名称不能为空', 'wran')
          if (path === '') return this.$Msg('路径不能为空', 'wran')
          if (type === '') return this.$Msg('类型不能为空', 'wran')
          switch (this.code_Button_Tree) {
            case 'add':
              this.Id_node_Tree = new Date().getTime()
              this.handle_Total_Tree(
                'add',
                { ...this.powerData, pid: data.id, id: this.Id_node_Tree },
                this.Determine_Add_Tree_Success
              )
              break
            case 'edit':
              this.handle_Total_Tree(
                'edit',
                { ...this.powerData, id: data.id, _id: data._id },
                this.Determine_Edit_Tree_Success
              )
              break
          }
          this.active_Dia = ''
        },
        /**
         * @description: 后端添加节点成功后的回调
         */
        Determine_Add_Tree_Success() {
          this.add_Determine_Tree()
          this.powerData.title = ''
          this.powerData.path = ''
        },
        /**
         * @description: 树节点添加
         */
        add_Determine_Tree() {
          const data = this.child_Node_Data
          const son_Node_Data = {
            arrow: false,
            checked: false,
            seaId: data.seaId + '-' + (data.child ? data.child.length : 0),
            checkSemi: false,
            ...this.powerData,
            pid: data.id,
            id: this.Id_node_Tree
          }
          if (data.child && data.child.lengtn !== 0) {
            data.child.push(son_Node_Data)
          } else {
            data.child = [son_Node_Data]
          }
          data.arrow = true
          this.check_All_Tree(data)
        },
        /**
         * @description: 树节点修改
         */
        Determine_Edit_Tree_Success() {
          const data = this.child_Node_Data
          const { title, path, type } = this.powerData
          data.title = title
          data.path = path
          data.type = type
          this.powerData.title = ''
          this.powerData.path = ''
        },
        /**
         * @description: 树编辑驱动方法合并
         */
        handle_Total_Tree(code, data, callback) {
          this.$emit('handle_Total_Tree', code, data, callback)
        },
        /**
         * @description: 复选框选中数据驱动
         */
        selectData() {
          this.$emit('selectData')
        },
        /**
         * @description: 点击树复选框操作
         * @param {*} _c  选中数据
         */
        changeBox(_c) {
          bus.$emit('remove_Active_Tree')
          // 赋值选中id以展示点击阴影
          this.active_tree = _c.seaId
          if (_c.checked) {
            _c.checkSemi = false
          }
          _c.checked = !_c.checked
          _c.child ? this.check_All_Tree(_c) : ''
          _c.pid !== 0 ? this.check_Father_Tree() : ''
          this.$emit('selectData')
        },
        /**
         * @description: 子节点全选
         */
        check_All_Tree(_c) {
          _c.child.forEach((c) => {
            c.checked = _c.checked
            if (!_c.checked) {
              c.checkSemi = false
            }
            if (c.child && c.child.length) {
              this.check_All_Tree(c)
            }
          })
        },
        /**
         * @description: 首次调用判断父节点多选框类型
         */
        check_Father_Tree() {
          this.$emit(
            'pass_Father_Checked_Semi',
            this.treeDataCopy[0].seaId,
            this.checked_All(),
            this.semi_All()
          )
        },
        /**
         * @description: 树复选框状态展示操作
         * @param {*} _SeaData  操作子节点seaId
         * @param {*} _semi_Num 子节点选中数量
         * @param {*} _semiFlag 子节点是否存在半选状态
         */
        pass_Father_Checked_Semi(_SeaData, _semi_Num, _semiFlag) {
          const father_Id = _SeaData.substring(
            _SeaData.length - 3,
            _SeaData.length - 2
          )
          // 子节点集合未选中状态
          if (_semi_Num === 0) {
            this.treeDataCopy[father_Id].checked = false
            this.treeDataCopy[father_Id].checkSemi = !!_semiFlag
            this.$emit(
              'pass_Father_Checked_Semi',
              this.treeDataCopy[0].seaId,
              this.checked_All(),
              this.semi_All()
            )
            // 子节点集合全选状态
          } else if (_semi_Num === this.treeDataCopy[father_Id].child.length) {
            this.treeDataCopy[father_Id].checked = true
            this.treeDataCopy[father_Id].checkSemi = false
            this.$emit(
              'pass_Father_Checked_Semi',
              this.treeDataCopy[0].seaId,
              this.checked_All()
            )
            // 子节点集合半选状态
          } else {
            this.treeDataCopy[father_Id].checked = false
            this.treeDataCopy[father_Id].checkSemi = true
            this.$emit(
              'pass_Father_Checked_Semi',
              this.treeDataCopy[0].seaId,
              1
            )
          }
        },
        /**
         * @description: 子节点选中子集数量
         */
        checked_All() {
          const dataNum = this.treeDataCopy.filter((c) => {
            if (c.checked === true) {
              return c
            }
          })
          return dataNum.length
        },
        /**
         * @description: 判断自己点半选状态
         */
        semi_All() {
          return this.treeDataCopy.some((c) => {
            return c.checkSemi === true
          })
        },
        /**
         * @description: 树展开关闭及选中状态赋值
         */
        open_Close_Tree(c) {
          c.arrow = !c.arrow
          bus.$emit('remove_Active_Tree')
          this.active_tree = c.seaId
        }
      },
      created() {
        /**
         * @description: 树选中及编辑树状态清空
         */
        bus.$on('remove_Active_Tree', () => {
          this.active_tree = ''
          this.active_Dia = ''
        })
      }
    }
  },
  methods: {
    bodyClick(e) {
      if (this.$refs.active_Btn.$el.contains(e.target) || this.$refs.active_Dia.contains(e.target)) return
      this.active_Dia = false
    },
    add_All_Role() {
      bus.$emit('remove_Active_Tree')
      this.active_Dia = true
    },
    add_Batten_Data() {
      const { title, path } = this.powerData
      if (title === '') return this.$Msg('名称不能为空', 'wran')
      if (path === '') return this.$Msg('路径不能为空', 'wran')
      this.active_Dia = false
      this.Id_node_Tree = new Date().getTime()
      this.handle_Total_Tree(
        'add',
        { ...this.powerData, pid: 0, id: this.Id_node_Tree },
        this.Determine_Add_Tree_Success
      )
    },
    Determine_Add_Tree_Success() {
      const son_Node_Data = {
        arrow: false,
        checked: false,
        seaId:
          this.treeDataCopy.length - 1 < 0
            ? '0'
            : this.treeDataCopy.length + '',
        checkSemi: false,
        ...this.powerData,
        pid: 0,
        id: this.Id_node_Tree
      }
      if (this.treeDataCopy.length === 0) {
        this.treeDataCopy = [son_Node_Data]
      } else {
        this.treeDataCopy.push(son_Node_Data)
      }
      this.powerData.path = ''
      this.powerData.title = ''
    },
    /**
     * @description: 树复选框选中数据集合
     */
    selectData() {
      let arrangementObject = { checked: [], checkSemi: [] }
      const arrangementCheck = (data) => {
        data.forEach((c) => {
          if (c.child) {
            arrangementCheck(c.child)
          }
          const _c = Object.assign({}, c)
          delete _c.checked
          delete _c.arrow
          delete _c.seaId
          delete _c.checkSemi
          if (c.checked) arrangementObject.checked.push(_c.id)
          if (c.checkSemi) arrangementObject.checkSemi.push(_c.id)
        })
      }
      arrangementCheck(this.treeDataCopy)
      this.$emit('selectData', arrangementObject)
      arrangementObject = null
    },
    /**
     * @description: 树子集驱动方法集合
     * @param {*} code 操作类型
     * @param {*} data  返回数据
     */
    handle_Total_Tree(code, data, callback) {
      switch (code) {
        case 'add':
          this.$emit('add_Tree', data, callback)
          break
        case 'edit':
          this.$emit('edit_Tree', data, callback)
          break
        default:
          this.$emit('delete_Tree', data, callback)
          break
      }
    }
  },
  watch: {
    check_Echo_Data: function(newV) {
      const add_Check_Echo = (data) => {
        data.forEach((c) => {
          c.arrow = false
          if (newV.checkSemi.includes(c.id)) {
            c.checkSemi = true
          } else {
            c.checkSemi = false
          }
          if (newV.checked.includes(c.id)) {
            c.checked = true
          } else {
            c.checked = false
          }
          if (c.child && c.child.length) {
            add_Check_Echo(c.child)
          }
        })
      }
      add_Check_Echo(this.treeDataCopy)
    }
  }
}
</script>

<style lang="less">
.tree {
  position: relative;
  color: #606266;
  transition: all 0.3s;
  .tree_ul {
    position: relative;
    .tree_Arrow {
      width: 15px;
      height: 15px;
      position: absolute;
      left: 3px;
      top: 5px;
      background-size: 15px 15px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(~assets/tree/right.svg);
      transition: transform 0.3s ease-in-out;
      z-index: 1;
    }
    .tree_li {
      padding: 5px 0;
      padding-left: 20px;
      position: relative;
      background: #fff;
      user-select: none;
      &:hover {
        background-color: #f5f7fa;
        .edit_Tree {
          display: inline-block;
        }
      }
      .edit_Tree {
        display: none;
        position: relative;
        span {
          margin-left: 10px;
          cursor: pointer;
          color: #979797;
          transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
          &:hover {
            color: #606266;
            transform: scale3d(1.2, 1.2, 1.2);
          }
        }
        .dia_Tree {
          left: 90px;
          top: -20px;
        }
      }
    }
    .tree_Active {
      background: #f5f7fa;
    }
  }
}
.dia_Tree {
  transition: transform 0.3s;
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 200px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  &::before {
    content: '';
    position: absolute;
    border-bottom: solid 12px rgba(0, 0, 0, 0);
    border-top: solid 12px rgba(0, 0, 0, 0);
    border-right: solid 12px #ebeef5;
    left: -12px;
    top: 15px;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  }
  &::after {
    content: '';
    position: absolute;
    border-bottom: solid 10px rgba(0, 0, 0, 0);
    border-top: solid 10px rgba(0, 0, 0, 0);
    border-right: solid 10px #ffffff;
    left: -10px;
    top: 17px;
  }
  .dia_Tree_Item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    p {
      width: 40px;
      line-height: 27px;
    }
    input {
      width: calc(~'100% - 40px');
      height: 24px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-family: 'Rubik', sans-serif;
      outline: 0;
      font-size: 12px;
    }
    select {
      -webkit-appearance: none;
      background-color: #fff;
      border-radius: 4px;
      border: 2px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 28px;
      outline: none;
      padding: 0 10px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 35%;
      margin-left: -38px;
    }
  }
}
</style>
