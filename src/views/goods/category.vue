<template>
    <div class="app-container">
        <el-button type="primary" @click="handleAdd">
            添加分类
        </el-button>

        <el-table :data="dataList" style="width: 100%;margin-top:30px" border>
            <el-table-column prop="name" label="分类名称">
                <template scope="scope">
                    <div class="bg-gray">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column label="图标显示" width="80">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.isIconShow"
                            active-text=""
                            inactive-text=""
                            @change='handleUpdate("isIconShow", $event, scope.row.id)'>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="首页显示" width="80">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.isHomepageShow"
                            active-text=""
                            inactive-text=""
                            @change='handleUpdate("isHomepageShow", $event, scope.row.id)'>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="全部产品页面显示" width="140">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.isAllShow"
                            active-text=""
                            inactive-text=""
                            @change='handleUpdate("isAllShow", $event, scope.row.id)'>
                    </el-switch>
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="infoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="简短介绍">
                    <el-input type="textarea" v-model="infoForm.brief" :rows="2"></el-input>
                    <div class="form-tip"></div>
                </el-form-item>
                <el-form-item label="分类图片" prop="imgUrl">
                    <img v-if="infoForm.imgUrl" :src="getCompleteUrl(infoForm.imgUrl)" class="image-show">
                    <UploadFile :multiple="false" :showFileList="true" :fpaths.sync="infoForm.imgUrl"></UploadFile>
                    <div class="form-tip">图片尺寸：顶级分类为690*自定义, 只能上传jpg/png文件</div>
                </el-form-item>
                <el-form-item label="分类图片高度" prop="name">
                    <el-input v-model="infoForm.height"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconUrl">
                    <img v-if="infoForm.iconUrl" :src="getCompleteUrl(infoForm.iconUrl)" class="image-show">
                    <UploadFile :multiple="false" :showFileList="true" :fpaths.sync="infoForm.iconUrl"></UploadFile>
                    <div class="form-tip">图片尺寸：图标250*250, 只能上传jpg/png文件</div>
                </el-form-item>
                <el-form-item label="图标显示">
                    <el-switch
                        v-model="infoForm.isIconShow"
                        active-text="显示"
                        inactive-text="隐藏"
                    />
                </el-form-item>
                <el-form-item label="首页显示">
                    <el-switch
                        v-model="infoForm.isHomepageShow"
                        active-text="显示"
                        inactive-text="隐藏"
                    />
                </el-form-item>
                <el-form-item label="全部产品页面显示">
                    <el-switch
                        v-model="infoForm.isAllShow"
                        active-text="显示"
                        inactive-text="隐藏"
                    />
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
import { goodsCategoryList, goodsCategoryAdd, goodsCategoryDelete, goodsCategoryUpdate } from '@/api/goodsCategory'
import { getCompleteUrl } from '@/api'
import i18n from '@/lang'
import UploadFile from '@/components/Upload'
import Pagination from '@/components/Pagination'
import { PAGESIZE } from '@/utils'

const defaultForm = {
    name: '',
    brief: '',
    sort: 1,
    height: 155
}
  
export default {
    components: { Pagination, UploadFile },
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
                    { required: true, message: '分类名称不能为空', trigger: 'blur' }
                ],
                brief: [
                    { required: true, message: '简介不能为空', trigger: 'blur' }
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
        getCompleteUrl(url) {
            return getCompleteUrl(url)
        },
        bannerRemove() {

        },
        async handleUpdate(key, value, id) {
            const data = { id, [key]: value }
            console.log('change channel status ', data)
            const res = await goodsCategoryUpdate(data)
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
            const res = await goodsCategoryList(this.queryParams)
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
                await goodsCategoryDelete({ ids: [row.id] })
                this.getList()
                this.$message({
                    type: 'success',
                    message: 'Delete succed!'
                })
            })
            .catch(err => { console.error(err) })
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
                    await goodsCategoryUpdate(this.infoForm)
                } else {
                    await goodsCategoryAdd(this.infoForm)
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
  