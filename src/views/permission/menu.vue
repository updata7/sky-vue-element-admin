<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addMenu') }}
    </el-button>

    <el-table
      :data="menusList"
      style="width: 100%;margin-top:30px;"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="false"
      row-key="id"
      highlight-current-row
      border
    >
      <el-table-column align="center" :label="$t('table.menuName')" width="220">
        <template slot-scope="scope">
          <i v-if="scope.row.meta.icon && scope.row.meta.icon.indexOf('el-') > -1" :class="scope.row.meta.icon" />
          <svg-icon
            v-else-if="scope.row.meta.icon"
            :icon-class="scope.row.meta.icon"
          />
          {{ scope.row.meta.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.menuType')">
        <template #default="scope">
          <el-tag
            v-if="scope.row.type === 'DIR'"
            type="warning"
          >目录</el-tag>
          <el-tag
            v-if="scope.row.type === 'MENU'"
            type="success"
          >菜单</el-tag>
          <el-tag
            v-if="scope.row.type === 'LINK'"
            type="info"
          >外链</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.apiPermissions')">
        <template slot-scope="scope">
          {{ scope.row.apiPermissions }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.status')">
        <template #default="scope">
          <el-tag v-if="!scope.row.hidden" type="success">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.order')">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" :label="$t('table.createTime')">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" :label="$t('table.updateTime')">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="280" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button type="success" size="small" @click="handleAddChild(scope)">
            {{ $t('table.addChild') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新建菜单'">
      <el-form ref="ruleForm" :model="menu" label-width="80px" :rules="rules" label-position="left">
        <el-form-item :label="$t('table.parentMenu')" prop="parentId">
          <el-tree-select
            ref="treeSelect"
            v-model="menu.parentId"
            style="width: 95%"
            placeholder="选择上级菜单"
            :tree-params="treeParams"
            :select-params="selectParams"
            @searchFun="treeSearch"
          />
        </el-form-item>

        <el-form-item :label="$t('table.menuName')" prop="meta.title">
          <el-input v-model="menu.meta.title" placeholder="菜单名" />
        </el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
        >
          <el-popover
            v-model="showIconSelect"
            placement="bottom-start"
            width="570"
            trigger="click"
          >
            <div class="icon-tabs">
              <el-tabs type="border-card">
                <el-tab-pane label="Icons">
                  <div class="grid">
                    <div v-for="item of svgIcons" :key="item" @click="handleSelected(generateIconCode(item),$event)">
                      <el-tooltip placement="top">
                        <div class="icon-item">
                          <svg-icon :icon-class="item" class-name="disabled" />
                          <span>{{ item }}</span>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Element-UI Icons">
                  <div class="grid">
                    <div v-for="item of elementIcons" :key="item" @click="handleSelected(generateElementIconCode(item),$event)">
                      <el-tooltip placement="top">
                        <div class="icon-item">
                          <i :class="'el-icon-' + item" />
                          <span>{{ item }}</span>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <el-input
              slot="reference"
              v-model="menu.meta.icon"
              placeholder="点击选择图标"
              readonly
              @click="showIconSelect = !showIconSelect"
            >
              <template #prefix>
                <div v-if="menu.meta.icon && menu.meta.icon.indexOf('el-') > -1">
                  <i :class="menu.meta.icon" />
                </div>
                <div v-else>
                  <svg-icon :icon-class="menu.meta.icon" />
                </div>
              </template>
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group
            v-model="menu.type"
          >
            <el-radio label="DIR">目录</el-radio>
            <el-radio label="MENU">菜单</el-radio>
            <el-radio label="LINK">外链</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="menu.type == 'LINK'"
          label="外链地址"
          prop="path"
        >
          <el-input v-model="menu.path" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item
          v-if="menu.type != 'LINK'"
          label="路由路径"
          prop="path"
        >
          <el-input
            v-if="menu.type == 'DIR'"
            v-model="menu.path"
            placeholder="/system  (目录以/开头)"
          />
          <el-input v-else-if="menu.type == 'MENU' && menu.parentId === '0'" v-model="menu.path" placeholder="/user (顶级菜单以/开头)" />
          <el-input v-else v-model="menu.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item
          v-if="menu.type == 'MENU'"
          label="页面路径"
          prop="component"
        >
          <el-input
            v-model="menu.component"
            placeholder="system/user/index"
            style="width: 95%"
          >
            <template
              #prepend
            >@/views/</template>
            <template #append>.vue</template>
          </el-input>
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item
          label="权限标识"
          prop="permissions"
        >
        <el-cascader
          :options="permissions"
          :props="props"
          filterable
          collapse-tags
          v-model="menu.permissions"
          style="width: 100%"
          clearable></el-cascader>
          <!-- <el-input v-model="menu.permissions" placeholder="/user/add (多个用英文逗号隔开)" /> -->
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="menu.hidden"
            active-text="隐藏"
            inactive-text="显示"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="menu.sort"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import svgIcons from '../icons/svg-icons'
import elementIcons from '../icons/element-icons'
import { getMenus, addMenu, deleteMenu, updateMenu, optionsMenu } from '@/api/menu'
import { getPermissionList } from '@/api/permission'

import i18n from '@/lang'

const defaultMenu = {
  path: '',
  type: 'DIR',
  sort: 1,
  parentId: '0',
  hidden: false,
  component: '',
  meta: {
    title: '',
    icon: '',
    affix: true
  },
  permissions: []
}

export default {
  data() {
    return {
      props: { multiple: true },
      selectParams: {
        multiple: false,
        clearable: true,
        placeholder: '请输入内容'
      },
      treeParams: {
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [
          {
            id: '0',
            title: '顶级菜单',
            children: []
          }
        ],
        props: {
          label: 'title',
          value: 'id'
        }
      },
      showIconSelect: false,
      svgIcons,
      elementIcons,
      iconSelectVisible: false,
      menu: Object.assign({}, defaultMenu),
      routes: [],
      menusList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      rules: {
        parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
        'meta.title': [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        component: [
          { required: true, message: '请输入组件完整路径', trigger: 'blur' }
        ]
      },
      initOptionsMenu: false,
      permissions: []
    }
  },
  computed: {
  },
  created() {
    this.getMenus()
  },
  methods: {
    async getPermission() {
      if (this.permissions.length > 0) {
        return
      }
      const res = await getPermissionList()
      const { data } = res.data
      this.permissions = data
    },
    async optionsMenu() {
      this.getPermission()
      if (this.initOptionsMenu) return
      this.initOptionsMenu = true
      const res = await optionsMenu({})
      console.debug('optionsMenu ==> ', res)
      this.treeParams.data[0].children = res.data.records
      console.debug('optionsMenu ==> ', this.treeParams.data)
    },
    generateIconCode(symbol) {
      return `${symbol}`
    },
    generateElementIconCode(symbol) {
      return `el-icon-${symbol}`
    },
    handleSelected(text, event) {
      this.menu.meta.icon = text
      this.showIconSelect = false
    },
    treeSearch(value) {
      this.$refs.treeSelect.filterFun(value)
    },
    async getMenus() {
      const res = await getMenus()
      console.debug('getMenus ==> ', res)
      this.menusList = res.data.records
    },
    async handleAddRole() {
      this.menu = deepClone(Object.assign({}, defaultMenu))
      await this.optionsMenu()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      await this.optionsMenu()
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.menu = deepClone(scope.row)
    },
    async handleAddChild(scope) {
      await this.optionsMenu()
      this.dialogType = 'new'
      this.dialogVisible = true
      this.menu = deepClone(defaultMenu)
      this.menu.parentId = scope.row.id
    },
    handleDelete({ $index, row }) {
      this.$confirm(i18n.t('permission.deleteMenuConfirm'), i18n.t('permission.warning'), {
        confirmButtonText: i18n.t('permission.confirm'),
        cancelButtonText: i18n.t('permission.cancel'),
        type: 'warning'
      })
        .then(async() => {
          await deleteMenu({ ids: [row.id] })
          this.getMenus()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (!valid) {
          console.debug('confirmRole ==> bad params')
          return
        }

        if (this.menu.type === 'DIR') {
          this.menu.alwaysShow = true
          this.menu.component = 'Layout'
        }
        const isEdit = this.dialogType === 'edit'
        if (isEdit) {
          delete this.menu.createTime
          delete this.menu.updateTime
          delete this.menu.children
          console.debug('editMenu ===> ', this.menu)
          await updateMenu(this.menu)
        } else {
          console.debug('addMenu ===> ', this.menu)
          const { data } = await addMenu(this.menu)
        }

        this.getMenus()
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `success`,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
.icon-tabs{
  height: 500px;
  overflow: auto;
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 16px;
    margin-left: 10px;
  }
}
</style>
