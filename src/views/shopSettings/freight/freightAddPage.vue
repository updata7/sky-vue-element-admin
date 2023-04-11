<template>
    <div class="app-container">
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="模板名字" prop="name">
                        <el-input v-model="infoForm.name" placeholder="请输入模板名称" autofocus></el-input>
                    </el-form-item>
                    <el-form-item label="付费类型">
                        <el-radio-group v-model="infoForm.charge_type">
                            <el-radio :label="0">自定义邮费</el-radio>
                            <el-radio :label="1">卖家承担运费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="infoForm.charge_type==0">
                        <el-form-item label="快递收费方式">
                            <el-radio-group v-model="infoForm.freight_type">
                                <el-radio :label="0">按件计费</el-radio>
                                <el-radio :label="1">按重量计费</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="默认运费" class="default-freight">
                            <div class="line-wrap">
                                <div class="line">
                                    <el-input v-model="infoForm.start"></el-input>
                                    <div class="text">{{infoForm.freight_type == 0?'件内':'KG内'}}</div>
                                    <el-input v-model="infoForm.start_fee"></el-input>
                                    <div class="text">元</div>
                                </div>
                                <div class="line2">
                                    <div class="text2">每增加</div>
                                    <el-input v-model="infoForm.add"></el-input>
                                    <div class="text">{{infoForm.freight_type == 0?'件':'KG'}}</div>
                                    <div class="text2">增加</div>
                                    <el-input v-model="infoForm.add_fee"></el-input>
                                    <div class="text">元</div>
                                </div>
                            </div>

                            <!-- <div class="form-table-box">
                                <el-table :data="infoForm" style="width: 100%" border stripe>
                                    <el-table-column prop="start" :label="infoForm.freight_type == 0?'首件(个)':'首重(KG)'">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.start" placeholder="个" autofocus></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="start_fee" label="运费(元)">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.start_fee" placeholder="运费"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="add" :label="infoForm.freight_type == 0?'续件(个)':'续重(KG)'"
                                    >
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.add" placeholder="个"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="add_fee" :label="infoForm.freight_type == 0?'每续件(个)增加运费(元)':'每续重(个)增加运费(元)'">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.add_fee" placeholder="运费"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div> -->

                        </el-form-item>
                        <el-form-item label="指定区域运费" class="special-freight">
                            <div class="form-table-box">
                                <el-table :data="areaData" style="width: 100%" border stripe>
                                    <el-table-column prop="areaNames" label="运送到">
                                    </el-table-column>
                                    <el-table-column prop="start" :label="infoForm.freight_type == 0?'首件(个)':'首重(KG)'"
                                                    width="90">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.start" placeholder="个" autofocus></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="start_fee" label="运费(元)" width="90">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.start_fee" placeholder="运费"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="add" :label="infoForm.freight_type == 0?'续件(个)':'续重(KG)'"
                                                    width="90">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.add" placeholder="个"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="add_fee" label="运费(元)" width="90">
                                        <template scope="scope">
                                            <el-input size="mini" v-model="scope.row.add_fee" placeholder="运费"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="160">
                                        <template scope="scope">
                                            <el-button size="mini" type="primary" plain
                                                @click="handleRowEdit(scope.$index, scope.row)">编辑地区
                                            </el-button>
                                            <el-button
                                                    @click.native.prevent="deleteRow(scope.$index, areaData)"
                                                    type="text"
                                                    size="small">
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="add-btn">
                                <el-button type="text" @click="addTemplate">+添加指定地区运费</el-button>
                            </div>
                        </el-form-item>
                    </div>
                    <el-button type="primary" class="float-left" @click="onAddTemplate">
                        保存模板
                    </el-button>
                </el-form>
            </div>
        </div>
        <el-dialog title="设置运送到到区域" :visible.sync="specEditVisible">
            <el-form ref="specForm">
                <el-form-item label="" prop="value" label-width="80px">
                    <el-transfer v-model="selectedArea" :props="{key: 'code',label: 'name'}"
                        :data="allAreaData" :titles="['可选', '已选']"></el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="specEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateArea">确定</el-button>
                <!--<el-button type="primary" @click="updateSpec" v-if="!is_spec_add">确定修改</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getProvince } from "@/api/area"
    import { freightAdd, freightUpdate, freightGetOne } from "@/api/freight"
    export default {
        data() {
            return {
                nowTableIndex: 0,
                allAreaData: [],
                areaData: [],
                selectedArea: [],
                hiddenSelectedArea: [],
                specEditVisible: false,
                infoForm: {
                    charge_type: 0,
                    freight_type: 0,
                    name: '',
                    start: 1,
                    start_fee: 1,
                    add: 1,
                    add_fee: 1,
                    areas: []
                },
                infoRules: {
                    name: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'},
                    ],
                    charge_type: [
                        { required: true, message: '付费类型不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            updateArea() {
                let index = this.nowTableIndex;
                let selected = this.selectedArea
                console.log("selected 22 ==> ", this.selectedArea);
                let newName = [];
                for (let i = 0; i < selected.length; i++) {
                    this.allAreaData.map((ele) => ele.code == selected[i] ? newName.push(ele.name) : '')
                }

                console.log('newName iii ==> ', newName);
                // 将areaName 变成selected后等areaName;
                this.areaData[index].areaNames = newName.join(',');
                this.areaData[index].codes = this.selectedArea
                console.log("this.infoForm ==> ", this.infoForm)
                this.specEditVisible = false;
            },

            onAddTemplate() {
                this.$refs["infoForm"].validate(valid => {
                    if (!valid) return

                    const commit = this.infoForm.id ? freightUpdate: freightAdd
                    const formData = JSON.parse(JSON.stringify(this.infoForm))
                    for(let i = 0; i < formData.areas.length; i++) {
                        delete formData.areas[i].areaNames
                    }
                    formData.updateTime && delete formData.updateTime
                    formData.createTime && delete formData.createTime
                    commit(formData).then((response) => {
                        const { success, message } = response.data
                        if (success) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                        } else {
                            this.$message({
                                type: 'error',
                                message
                            })
                        }
                    })
                })
            },

            deleteRow(index, rows) {
                this.$confirm('确定要删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    rows.splice(index, 1);
                });
            },
            addTemplate() {
                let ele = {
                    start: 1,
                    start_fee: 0,
                    add: 1,
                    add_fee: 0,
                    codes: [],
                    areaNames: ''
                }
                this.areaData.push(ele)
            },
            goBackPage() {
                this.$router.go(-1);
            },
            async loadData() {
                const response = await getProvince()
                this.allAreaData = response.data.data;
                console.log('this.infoForm.id ==> ', this.infoForm.id)
                freightGetOne({ id: this.infoForm.id}).then(response => {
                    this.infoForm = response.data.data;
                    this.areaData = this.infoForm.areas || []
                    this.areaData.map(area => {
                        let newName = []
                        for (let i = 0; i < area.codes.length; i++) {
                            this.allAreaData.map((ele) => ele.code == area.codes[i] ? newName.push(ele.name) : '')
                        }
                        area.areaNames = newName.join(',')
                    })
                })
            },
            handleRowEdit(index, row) {
                this.nowTableIndex = index;
                let nowArea = this.areaData[index];
                this.selectedArea = (nowArea && nowArea.codes) ? nowArea.codes : []
                console.log("this.allAreaData ==> ", this.allAreaData);
                console.log("this.selectedArea ==> ", index, this.selectedArea)
                // tableData中将数据中的area集合在一起
                // 然后将这些area的地区从all将已存在的disabled，
                for (const item of this.allAreaData) {
                    item.disabled = false;
                    for (let i = 0; i < this.areaData.length; i++) {
                        if (i === index) continue;
                        const codes = this.areaData[i].codes || []
                        for (const ele of codes) {
                            if (item.code == ele) {
                                item.disabled = true;
                                break
                            }
                        }
                    }
                }

                this.specEditVisible = true;
            }
        },
        components: {},
        mounted() {
            this.infoForm.id = this.$route.query.id;
            this.loadData();
        }
    }

</script>

<style scoped>
    .number_input {
        width: 90px;
    }

    .money_input {
        width: 100px;
    }

    .el-form-item__content {
        display: flex;
        justify-content: flex-start;
    }

    .line-wrap {
        display: flex;
        justify-content: flex-start;
    }

    .default-freight .el-input {
        width: 130px;
        float: left;
    }

    .default-freight .el-input .el-input__inner {
        width: 100px;
    }

    .default-freight .line {
        display: flex;
        justify-content: flex-start;
        border-right: 1px solid #f1f1f1;
        /*padding-right: 40px;*/
        margin-right: 40px;
    }

    .default-freight .line2 {
        display: flex;
        justify-content: flex-start;
    }

    .default-freight .text {
        width: 60px;
        float: left;
        margin-left: 10px;
    }

    .default-freight .text2 {
        width: 50px;
        float: left;
        /*margin: 10px;*/
    }

    .float-left {
        float: right;
    }

    .add-btn {
        color: #3a8ee6;
        font-size: 14px;
        padding: 20px;
        border: 1px solid #f1f1f1;
        border-top: none;
        display: flex;
        justify-content: space-between;
    }
</style>