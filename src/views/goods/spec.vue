<template>
    <div class="app-container">
        <el-button type="primary" @click="handleAdd">
            添加型号
        </el-button>

        <el-table :data="dataList" style="width: 100%;margin-top:30px" border>
            <el-table-column prop="name" label="型号名">
                <template scope="scope">
                    <div class="bg-gray">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="100" sortable>
                <template scope="scope">
                    <el-input v-model="scope.row.sort" placeholder="排序" @blur="handleUpdate('sort', scope.row.sort, scope.row.id)"></el-input>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                        {{ $t('permission.delete') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
  
        <el-dialog :visible.sync="dialog.visible" :title="dialog.title">
            <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="140px">
                <el-form-item label="型号名" prop="name">
                    <el-input v-model="infoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="infoForm.sort" :min="1" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="danger" @click="dialog.visible=false">
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
import { goodsSpecList, goodsSpecAdd, goodsSpecDelete, goodsSpecUpdate } from '@/api/goodsSpec'
import i18n from '@/lang'
import Pagination from '@/components/Pagination'
import { PAGESIZE } from '@/utils'

const defaultForm = {
    name: '',
    sort: 1,
}
  
export default {
    components: { Pagination },
    data() {
        return {
            queryParams: {
                pageNo: 1,
                pageSize: PAGESIZE
            },
            total: 0,
            imgFiles: [],
            iconFiles: [],
            infoForm: Object.assign({}, defaultForm),
            dialog: {
                visible: false,
                title: ''
            },
            routes: [],
            dataList: [],
            infoRules: {
                name: [
                    { required: true, message: '型号名称不能为空', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '排序不能为空', trigger: 'blur' }
                ]
            },
            dialogType: 'new',
        }
    },
    computed: {
    },
    created() {
        this.getList()
    },
    methods: {
        async handleUpdate(key, value, id) {
            const data = { id, [key]: value }
            console.log('change channel status ', data)
            const res = await goodsSpecUpdate(data)
            const { success, message } = res.data
            if (success) {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                })
            } else {
                this.$message({
                    type: 'fail',
                    message
                })
            }
        },
        handleRowDelete(id) {
        },
        async getList() {
            const res = await goodsSpecList(this.queryParams)
            console.debug('getList ==> ', res)
            this.dataList = res.data.data
            this.total = res.data.total
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
        handleAdd() {
            this.infoForm = Object.assign({}, defaultForm)
            this.dialog = {
                visible: true,
                title: '新建分类'
            }
            this.dialogType = 'new'
        },
        handleEdit(scope) {
            this.dialog = {
                visible: true,
                title: '编辑分类'
            }
            this.dialogType = 'edit'
            this.infoForm = deepClone(scope.row)
        },
        handleDelete(row) {
            this.$confirm(i18n.t('permission.deleteRecordConfirm'), i18n.t('permission.warning'), {
                confirmButtonText: i18n.t('permission.confirm'),
                cancelButtonText: i18n.t('permission.cancel'),
                type: 'warning'
            })
            .then(async() => {
                await goodsSpecDelete({ ids: [row.id] })
                this.getList()
                this.$message({
                    type: 'success',
                    message: 'Delete succed!'
                })
            })
            .catch(err => { /*console.error(err)*/ })
        },
        async confirmRole() {
            console.log('confirmRole ==> ', this.infoForm)
            this.$refs['infoForm'].validate(async(valid) => {
                if (!valid) {
                    return
                }
                const isEdit = this.dialogType === 'edit'
                if (isEdit) {
                    delete this.infoForm.createTime
                    delete this.infoForm.updateTime
                    console.debug('editRole ===> ', this.infoForm)
                    await goodsSpecUpdate(this.infoForm)
                } else {
                    await goodsSpecAdd(this.infoForm)
                }
                this.dialog.visible = false
                this.getList()
                this.$notify({
                    title: 'Success',
                    dangerouslyUseHTMLString: true,
                    message: `
                        success
                        `,
                    type: 'success'
                })
            })
        }
    }
  }
</script>
  
<style lang="scss" scoped>
.app-container {
    .image-show {
        background-color: #f8f8f8;
        width: 30%;
        height: 105px;
        display: block;
    }
}
</style>