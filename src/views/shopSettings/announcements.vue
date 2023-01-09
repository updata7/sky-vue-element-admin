<template>
    <div class="app-container">
      <el-button type="primary" @click="handleAdd">
        添加公告
      </el-button>
  
      <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="内容" width="220">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.start_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑公告':'新建公告'">
        <el-form :model="formData" label-width="80px" label-position="left">
          <el-form-item label="内容">
            <el-input v-model="formData.content" :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea" placeholder="content" class="content" />
          </el-form-item>
          <el-form-item label="公告时间">
            <el-date-picker
                v-model="timeRange"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                class="datepicker"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">
            {{ $t('permission.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleConfirm">
            {{ $t('permission.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { deepClone } from '@/utils'
  import { getLists, addOne, deleteData, updateData } from '@/api/announcements'
  import moment from 'moment'
  import i18n from '@/lang'
  
  const defaultFormData = {
    start_time: moment().format('yyyy-MM-DD HH:mm:ss'),
    end_time: moment().format('yyyy-MM-DD HH:mm:ss')
  }
  
  export default {
    data() {
      return {
        formData: Object.assign({}, defaultFormData),
        dataList: [],
        dialogVisible: false,
        dialogType: 'new',
      }
    },
    computed: {
      timeRange: {
        get() {
            console.debug('formData ==> ', this.formData)
            return [this.formData.start_time, this.formData.end_time]
        },
        set(v) {
            this.formData.start_time = v[0]
            this.formData.end_time = v[1]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        const res = await getLists()
        this.$debugLog("geList ==> ", res)
        const nowDate = moment().format("yyyy-MM-DD HH:mm:ss")
        this.dataList = res.data.data.map(r => {
            r.status = r.start_time > nowDate ? '未开始' : r.end_time < nowDate ? '已过期' : '进行中'
            return r
        } )
      },
      handleAdd() {
        this.formData = Object.assign({}, defaultFormData)
        this.dialogType = 'new'
        this.dialogVisible = true
      },
      handleEdit(scope) {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.formData = deepClone(scope.row)
      },
      handleDelete({ $index, row }) {
        this.$confirm(i18n.t('permission.deleteRecordConfirm'), i18n.t('permission.warning'), {
          confirmButtonText: i18n.t('permission.confirm'),
          cancelButtonText: i18n.t('permission.cancel'),
          type: 'warning'
        })
          .then(async() => {
            const { data } = await deleteData({ ids: [row.id] })
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
      async handleConfirm() {
        const isEdit = this.dialogType === 'edit'
        if (isEdit) {
          delete this.formData.createTime
          delete this.formData.updateTime
          console.debug('editRole ===> ', this.formData)
          await updateData(this.formData)
        } else {
          await addOne(this.formData)
        }
  
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `success`,
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
  .datepicker, .content {
    width: 90%;
  }
  </style>
  