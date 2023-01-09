<template>
    <div class="app-container">
        <router-link :to="{path:'/goods/goods/addEdit', query: {}}">
            <el-button type="primary"  icon="plus">添加商品</el-button>
        </router-link>
        <div class="content-main">
            <div class="block">
				<span class="wrapper">
					<el-button :plain="true" type="primary" :class="filterForm.sortField == 'actual_sales' ? 'active' : '' "
							   @click="sortOrder('actual_sales')" size="small">按销量排序</el-button>
					<el-button :plain="true" type="primary" :class="filterForm.sortField == 'stock' ? 'active' : '' "
							   @click="sortOrder('stock')" size="small">按库存排序</el-button>
				</span>
            </div>
            <el-tabs v-model="filterForm.listType" @tab-click="handleClick">
                <el-tab-pane label="全部商品" name="all"></el-tab-pane>
                <el-tab-pane label="出售中" name="saling"></el-tab-pane>
                <el-tab-pane label="已售完" name="sold"></el-tab-pane>
                <el-tab-pane label="已下架" name="under"></el-tab-pane>
            </el-tabs>
            <div class="filter-box">
                <el-form :inline="true" class="form-inline">
                    <el-form-item label="商品名称">
                        <el-input size="small" v-model="filterForm.name" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="onSubmitFilter">查询</el-button>
                        <el-button size="small" @click="clear">清空</el-button>
                    </el-form-item>
                </el-form>
                <!-- <el-button @click="expandToggle" type="primary" icon="plus" size="small">{{expand == false?'全部展开':'全部收起'}}</el-button> -->
            </div>
            <div class="form-table-box">
                <el-table :data="tableData" style="width: 100%" stripe>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.products" style="width: 100%" stripe>
                                <!-- <el-table-column prop="id" label="id" width="60"></el-table-column> -->
                                <el-table-column prop="sku" label="商品SKU" width="140">
                                    <template scope="scope">
                                        <el-input @blur="checkSkuOnly(scope.$index, scope.row)" size="mini"
                                                  v-model="scope.row.sku" placeholder="商品SKU"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="short_name" label="快递单上的简称" width="160">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.short_name"
                                                  placeholder="简称"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="attr" label="型号/规格" width="140">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.attr" placeholder="如1斤/条"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="cost" label="成本(元)" width="90">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.cost" placeholder="成本"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="retail" label="零售(元)" width="90">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.retail"
                                                  placeholder="零售"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="weight" label="重量(KG)" width="90">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.weight"
                                                  placeholder="重量"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="stock" label="库存" width="90">
                                    <template scope="scope">
                                        <el-input size="mini" v-model="scope.row.stock"
                                                  placeholder="库存"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="上架" width="80">
                                    <template scope="scope">
                                        <el-switch
                                                v-model="scope.row.on_sale"
                                                active-text=""
                                                inactive-text=""
                                                :active-value="1"
                                                :inactive-value="0"
                                                @change='updateGoodsProduct({id: scope.row.id, on_sale: scope.row.on_sale})'>
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template scope="scope">
                                        <el-button
                                                size="mini"
                                                type="primary"
                                                @click="specSave(scope.$index, scope.row)">
                                                保存
                                        </el-button>
                                        <el-button 
                                            size="small" plain 
                                            type="danger" 
                                            @click="handleProductDelete(scope.$index, scope.row)"
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="ID" width="120"></el-table-column>
                    <el-table-column prop="pic_url" label="商品图片" width="80">
                        <template scope="scope">
                            <img :src="getCompleteUrl(scope.row.pic_url)" alt="" style="width: 40px;height: 40px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="120" sortable>
                        <template scope="scope">
                            <el-input-number class="sort-width" size="mini" :min="1" :max="100" controls-position="right" v-model="scope.row.sort" placeholder="排序" @blur="submitSort(scope.$index, scope.row)" @change="submitSort(scope.$index, scope.row)"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sales" label="显示销量" width="120" sortable></el-table-column>
                    <el-table-column prop="actual_sales" label="实际销量" width="100" sortable></el-table-column>
                    <el-table-column prop="stock" label="库存" width="80" sortable>
                    </el-table-column>
                    <el-table-column label="首页显示" width="80">
                        <template scope="scope">
                            <el-switch
                                    v-model="scope.row.is_index"
                                    active-text=""
                                    inactive-text=""
                                    :active-value="true"
                                    :inactive-value="false"
                                    @change='updateGoods({id: scope.row.id, is_index: scope.row.is_index})'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="上架" width="80">
                        <template scope="scope">
                            <el-switch
                                    v-model="scope.row.on_sale"
                                    active-text=""
                                    inactive-text=""
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change='updateGoods({id: scope.row.id, on_sale: scope.row.on_sale})'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" plain type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <pagination v-show="total>0" :total="total" :page.sync="filterForm.pageNo" :limit.sync="filterForm.pageSize" @pagination="getList" />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { PAGESIZE } from '@/utils'
import { goodsList, goodsUpdate, goodsDelete } from '@/api/goods'
import { goodsProductDelete, goodsProductUpdate } from '@/api/goodsProduct'
import { getCompleteUrl } from '@/api'
export default {
    components: { Pagination },
    data() {
        return {
            total: 0,
            filterForm: {
                pageNo: 1,
                pageSize: PAGESIZE,
                listType: 'all',
                sortField: 'createTime'
            },
            pIndex: 0,
            num: 0,
            activeClass: 0,
            expand:true,
            tableData:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
        }
    },
    methods: {
        getCompleteUrl(url) {
            return getCompleteUrl(url)
        },
        updateGoods(obj) {
            goodsUpdate(obj).then(res => {
                if (res.data.success) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                } else {
                    this.$message({
                        type: 'fail',
                        message: res.data.message
                    });
                }
                this.getList()
            })
        },
        specSave(index,row){
            if(row.goods_name == '' || row.value == '' || row.cost == '' || row.retail_price == '' || row.goods_weight == ''){
                this.$message({
                    type: 'error',
                    message: '值不能为空!'
                });
                return false;
            }
            const { createTime, updateTime, belong_user_id, goods_id, ...doc } = row
            goodsProductUpdate(doc).then((response) => {
                if (response.data.success) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    });
                }
                this.getList()
            })
        },
        checkSkuOnly(index,row) {
            console.log(index);
            console.log(row);
            if(row.goods_sn == ''){
                this.$message({
                    type: 'error',
                    message: 'SKU不能为空'
                })
                return false;
            }
            this.axios.post('goods/checkSku', {info: row}).then((response) => {
                if (response.data.errno === 100) {
                    this.$message({
                        type: 'error',
                        message: '该SKU已存在！'
                    })
                }
                else{
                    this.$message({
                        type: 'success',
                        message: '该SKU可以用！'
                    })
                }
            })
        },
        expandToggle(){
            this.expand = !this.expand;
        },
        submitName(index, row){
            this.axios.post('goods/updateShortName', { id: row.id,short_name:row.short_name }).then((response) => {
                if (response.data.errno === 0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                }
            })
        },
        submitSort(index, row){
            this.updateGoods({ id: row.id, sort:row.sort })
        },
        handleClick() {
            this.filterForm.pageNo = 1;
            this.filterForm.sortField = 'createTime';
            this.getList()
        },
        handleRowEdit(index, row) {
            this.$router.push({path: '/goods/goods/addEdit', query: row})
        },
        handleRowDelete(index, row) {
            this.$confirm('确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this;
                goodsDelete({ids: [row.id]}).then((response) => {
                    if (response.data.success) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        that.$message({
                            type: 'fail',
                            message: response.data.message
                        });
                    }
                    that.getList()
                })
            })
        },
        handleProductDelete(index, row) {
            this.$confirm('确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this;
                goodsProductDelete({ids: [row.id]}).then((response) => {
                    if (response.data.success) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        that.$message({
                            type: 'fail',
                            message: response.data.message
                        });
                    }
                    that.getList()
                })
            })
        },
        onSubmitFilter() {
            this.filterForm.pageNo = 1;
            this.getList();
        },
        clear(){
            this.filterForm = {
                pageNo: 1,
                pageSize: PAGESIZE
            }
            this.getList()
        },
        getList() {
            goodsList(this.filterForm).then((response) => {
                this.tableData = response.data.data
                this.total = response.data.total
            })
        },
        sortOrder(sortField) {
            this.filterForm.sortField = sortField;
            this.getList();
        },
        changeStatus($event, para) {
            this.axios.get('goods/saleStatus', {
                params: {
                    status: $event,
                    id: para
                }
            }).then((response) => {

            })
        },
        changeProductStatus($event, para) {
            this.axios.get('goods/productStatus', {
                params: {
                    status: $event,
                    id: para
                }
            }).then((response) => {

            })
        },
        changeShowStatus($event, para) {
            this.axios.get('goods/indexShowStatus', {
                params: {
                    status: $event,
                    id: para
                }
            }).then((response) => {

            })
        }
    },
    mounted() {
        this.getList();
    }
}

</script>

<style scoped>
    .sort-width{
        width: 90px;
    }
    .right{
        float: right;
    }
    .form-inline {
        margin-top: 2px;
        height: 40px;
        margin-right: 20px;
    }

    .block {
        margin-bottom: 10px;
        height:42px;
        display: flex;
        align-items: center;
        justify-content:space-between;
    }

    .active {
        border-color: #ff4949;
        color: #ff4949;
    }

    .marginRight{
        margin-right: 20px;
    }

    .content-main {
        margin-top: 20px;
        background: #fff;
    }
</style>
