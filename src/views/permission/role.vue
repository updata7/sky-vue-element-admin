<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" :label="$t('table.roleName')" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.description')">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item :label="$t('table.roleName')">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item :label="$t('table.description')">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" default-expand-all :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
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
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { optionsMenu } from '@/api/menu'

import i18n from '@/lang'

const defaultRole = {
  name: '',
  description: '',
  permissions: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title',
        value: 'id'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await optionsMenu({})
      this.routes = res.data.records
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data.data
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      // this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(async() => {
        this.$refs.tree.setCheckedKeys(this.role.permissions)
        // set checked state of a node not affects its father and child nodes
        // this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm(i18n.t('permission.deleteRoleConfirm'), i18n.t('permission.warning'), {
        confirmButtonText: i18n.t('permission.confirm'),
        cancelButtonText: i18n.t('permission.cancel'),
        type: 'warning'
      })
        .then(async() => {
          await deleteRole({ ids: [row.id] })
          this.getRoles()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      this.role.permissions = this.$refs.tree.getCheckedKeys()
      console.debug('confirmRole ==> ', this.role.permissions)
      if (isEdit) {
        delete this.role.createTime
        delete this.role.updateTime
        console.debug('editRole ===> ', this.role)
        await updateRole(this.role)
      } else {
        await addRole(this.role)
      }

      this.getRoles()
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            success
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
