<template>
  <div class="app-container">

    <div class="search">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="用户名/昵称/手机号"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            style="width: 200px"
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery"
          >搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <template #header>
        <el-form class="operUser">
          <el-form-item style="float: left">
            <el-button
              type="success"
              icon="el-icon-plus"
              @click="handleAdd"
            >新增</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="ids.length === 0"
              @click="handleDelete({ids: ids.map(r => r.id)})"
            >删除</el-button>
          </el-form-item>
        </el-form>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          key="account"
          label="用户名"
          align="center"
          prop="account"
        />
        <el-table-column
          label="用户昵称"
          width="120"
          align="center"
          prop="nickname"
        />
        <el-table-column
          label="手机号码"
          align="center"
          prop="mobile"
          width="120"
        />

        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :inactive-value="1"
              :active-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        />
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          width="180"
        />
        <el-table-column label="操作" align="left" width="240">
          <template #default="scope">
            <el-button
              type="success"
              link
              size="small"
              @click="resetPassword(scope.row)"
            >重置密码</el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete({ids: [scope.row.id]})"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 用户表单 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input
            v-model="formData.account"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="用户性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择">
                <el-option label="未知" :value="0" />
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
                </el-select>
            </el-form-item> -->

        <el-form-item label="备注" prop="introduction">
          <el-input
            v-model="formData.introduction"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import { userAdd, userList, userUpdate, userDelete } from '@/api/user'
import { getRoles } from '@/api/role'
import Pagination from '@/components/Pagination'
import { PAGESIZE } from '@/utils'

export default {
  components: { Pagination },
  data() {
    const validatePass = (rule, value, callback) => {
      console.debug('dddd ==> ', value, this.formData.id)
      if (!value && !this.formData.id) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      roleList: [],
      queryParams: {
        pageNo: 1,
        pageSize: PAGESIZE
      },
      userList: [],
      rules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, message: '密码不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '用户角色不能为空', trigger: 'blur' }
        ],
        email: [
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      ids: [],
      userList: [],
      loading: false,
      total: 0,
      dialog: {},
      formData: {
        status: 0
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoles({ isLoadAll: true })
      const { data } = res.data
      console.debug('getRoleList ==> ', data)
      this.roleList = data
    },
    async getList() {
      const res = await userList(this.queryParams)
      const { data, total } = res.data
      console.debug('getList ==> ', data)
      this.userList = data
      this.total = total
    },

    closeDialog() {
      this.dialog.visible = false
    },
    async submitForm() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (!valid) {
          console.debug('confirmRole ==> bad params')
          return
        }
        let res
        let title
        if (this.formData.id) {
          delete this.formData.createTime
          delete this.formData.updateTime
          delete this.formData.fatherAccount
          res = await userUpdate(this.formData)
          title = '修改成功'
        } else {
          res = await userAdd(this.formData)
          title = '添加成功'
        }
        this.dialog.visible = false
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: title
          })
        } else {
          this.$message({
            type: 'fail',
            message: res.message
          })
        }

        this.getList()
      })
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.queryParams = {}
    },
    handleAdd() {
      this.getRoleList()
      console.debug('handleAdd ==>')
      this.formData = {
        status: 0
      }
      this.dialog = {
        title: '添加用户',
        visible: true
      }
    },
    handleDelete(obj) {
      this.$confirm("确定要删除该用户？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      })
      .then(async() => {
        const { data } = await userDelete(obj)
        const { success, message } = data
        this.getList()
        if (success) {
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        } else {
          this.$message({
            type: 'fail',
            message
          })
        }
      })
      .catch(err => { console.error(err) })
    },
    handleSelectionChange(val) {
      this.ids = val
    },
    handleStatusChange() {

    },
    handleUpdate(row) {
      this.getRoleList()
      this.formData = row
      this.dialog = {
        title: '编辑用户',
        visible: true
      }
    },
    /**
     * 重置密码
     */
    resetPassword(row) {
      MessageBox.prompt(
        '请输入用户「' + row.account + '」的新密码',
        '重置密码',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(({ value }) => {
          if (!value) {
            ElMessage.warning('请输入新密码')
            return false
          }
          userUpdate({ id: row.id, password: value }).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
    .search{
        padding:18px  0 0  10px;
        margin-bottom: 10px;
        box-shadow: var(--el-box-shadow-light);
        border-radius: var(--el-card-border-radius);
        border: 1px solid var(--el-card-border-color);
    }
    .operUser{
        margin-bottom: 30px;
    }
}
</style>
