<template>
    <div class="app-container">
        <el-button type="primary" @click="handleAdd">
            添加广告
        </el-button>
  
        <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
            <el-table-column prop="image_url" label="广告">
                <template scope="scope">
                    <img :src="getCompleteUrl(scope.row.image_url)" alt="" style="width: 80px;height: 80px">
                </template>
            </el-table-column>
            <el-table-column align="center" label="关联商品或链接">
            <template slot-scope="scope">
                {{ scope.row.link_type == 0 ? scope.row.goods[0].name : scope.row.link_url }}
            </template>
            </el-table-column>
            <el-table-column align="center" label="结束时间">
            <template slot-scope="scope">
                {{ scope.row.end_time }}
            </template>
            </el-table-column>
            <el-table-column align="center" label="排序">
            <template slot-scope="scope">
                {{ scope.row.sort }}
            </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        @change='changeStatus($event,scope.row.id)'>
                    </el-switch>
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
  
        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑广告':'新建广告'">
            <el-form ref="formData" :rules="infoRules" :model="formData" label-width="120px">
                <el-form-item label="广告图片" prop="image_url" v-if="formData.image_url" class="image-uploader-diy new-height">
                    <div class="index-image">
                        <el-image :preview-src-list="previewList" v-if="formData.image_url" :src="getCompleteUrl(formData.image_url)" @click="previewImg()"
                            class="image-show" fit="cover"></el-image>
                        <div class="o-shadow" @click="delePicList">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="广告图片" prop="image_url" v-if="!formData.image_url">
                    <UploadFile :multiple="false" :showFileList="false" :fpaths.sync="formData.image_url"></UploadFile>
                </el-form-item>
                <el-form-item label="商品类型">
                    <el-radio-group v-model="formData.link_type">
                        <el-radio :label="0">商品</el-radio>
                        <el-radio :label="1">链接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="广告链接" prop="link_url" v-if="formData.link_type == 1">
                    <el-input class="link-input" style="width: 80%" v-model="formData.link_url"></el-input>
                </el-form-item>
                <el-form-item label="商品" prop="link" v-if="formData.link_type == 0">
                    <el-input class="id-input" v-if="false" v-model="formData.goods_id"></el-input>
                    <el-popover v-if="false" placement="right">
                        <div class="el_popover_class">
                            <div class="filter-box">
                                <el-form :inline="true" class="form-inline">
                                    <el-form-item label="商品名称">
                                        <el-input clearable size="small" v-model="filterForm.name" placeholder="商品名称"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="small" @click="relateGoodsClick">查询</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <el-table :data="chooseRelateGoods" stripe style="width: 100%" height="100%">
                                <!-- <el-table-column prop="id" label="id" width="100"></el-table-column> -->
                                <el-table-column prop="pic_url" label="商品图片" width="120">
                                    <template scope="scope">
                                        <img :src="getCompleteUrl(scope.row.pic_url)" alt="" style="width: 40px;height: 40px">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="name" label="商品名称" width="300px"></el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button
                                                size="small"
                                                type="danger"
                                                @click="relateSelect(scope.row.id)">选择
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-button style="margin-top:10px" slot="reference" type="primary" @click="relateGoodsClick">添加关联商品</el-button>
                    </el-popover>
                    <el-select v-model="formData.goods_id" filterable clearable placeholder="请选择">
                        <el-option
                            v-for="item in chooseRelateGoods"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                                <img :src="getCompleteUrl(item.pic_url)" alt="" style="width: 30px;height: 30px"/>
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结束时间" prop="end_time">
                    <el-date-picker
                            v-model="formData.end_time"
                            type="datetime"
                            placeholder="选择日期"
                            default-time="23:59:59">
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="formData.sort" :min="1" :max="999"></el-input-number>
                </el-form-item>
                <el-form-item label="广告启用">
                    <el-switch v-model="formData.status"></el-switch>
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
import { getLists, addOne, deleteData, updateData } from '@/api/advertisement'
import moment from 'moment'
import i18n from '@/lang'
import { getCompleteUrl } from '@/api'
import UploadFile from '@/components/Upload/index2'
import { goodsList } from '@/api/goods'

const defaultFormData = {
    sort: 1,
    status: true,
    link_type: 0
}
  
export default {
    components: { UploadFile },
    data() {
        return {
            formData: Object.assign({}, defaultFormData),
            dataList: [],
            dialogVisible: false,
            dialogType: 'new',
            previewList: [],
            filterForm: {
                isLoadAll: true
            },
            chooseRelateGoods: [],
            infoRules: {
				image_url: [{
					required: true,
					message: '请上传广告图',
					trigger: 'blur'
				}]
			},
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
        relateGoodsClick() {
            if (this.filterForm.name === '') {
                delete this.filterForm.name
            }
            goodsList(this.filterForm).then((response) => {
                this.chooseRelateGoods = response.data.data
            })
        },
        delePicList() {
            this.formData.image_url = ''
        },
        previewImg() {
			this.previewList = [];
			this.previewList.push(this.getCompleteUrl(this.formData.image_url));
		},
        getCompleteUrl(url) {
            return getCompleteUrl(url)
        },
        async getList() {
            const res = await getLists()
            this.$debugLog("ad getList ==> ", res.data.data)
            this.dataList = res.data.data
        },
        async handleAdd() {
            await this.relateGoodsClick()
            this.formData = Object.assign({}, defaultFormData)
            this.dialogType = 'new'
            this.dialogVisible = true
        },
        async handleEdit(scope) {
            await this.relateGoodsClick()
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
        changeStatus($event, id) {
            updateData({ id, status: this.formData.status }).then((res) => {
                const { success, message } = res.data
                if (success) {
                    this.$message({ type: 'success', message: "操作成功"})
                } else {
                    this.$message({ type: 'fail', message})
                }
            })
        },
        async handleConfirm() {
            const isEdit = this.dialogType === 'edit'
            if (isEdit) {
                delete this.formData.createTime
                delete this.formData.updateTime
                delete this.formData.goods
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
    .el_popover_class{
        height: 500px; 
        overflow: auto;
    }
    .el-popover {
        height: 100px; 
        overflow: auto;
    }
    .image-uploader-diy .new-image-uploader .image-show {
        width: 165px;
        height: 105px;
        display: block;
    }
    .shadow,
	.o-shadow {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, .5);
		opacity: 0;
		transition: opacity .3s;
		color: #fff;
		font-size: 20px;
		line-height: 20px;
		padding: 10px;
		cursor: pointer;
	}
    .index-image {
		width: 148px;
		height: 148px;
		position: relative;
	}
    .index-image:hover .o-shadow {
		opacity: 1;
	}
    .filter-box {
        margin-top: 10px;   
    }
</style>
  