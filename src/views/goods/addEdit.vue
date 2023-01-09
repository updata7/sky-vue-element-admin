<template>
	<div class="form-table-box">
		<el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
			<el-form-item label="商品分类">
				<el-select class="el-select-class" v-model="infoForm.category_id" placeholder="选择商品分类">
					<el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品首图" prop="pic_url" v-if="infoForm.pic_url" class="image-uploader-diy new-height">
				<div class="index-image">
					<el-image :preview-src-list="previewList" v-if="infoForm.pic_url" :src="getCompleteUrl(infoForm.pic_url)" @click="previewImg()"
						class="image-show" fit="cover"></el-image>
					<div class="o-shadow" @click="delePicList">
						<i class="el-icon-delete"></i>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="商品首图" prop="pic_url" v-if="!infoForm.pic_url">
				<UploadFile :multiple="false" :showFileList="false" :fpaths.sync="infoForm.pic_url"></UploadFile>
			</el-form-item>
			<el-form-item label="商品轮播或视频">
				<el-switch active-text="商品轮播图" inactive-text="商品视频" active-value="1" inactive-value="2" v-model="infoForm.show_pic_or_video"></el-switch>
			</el-form-item>
			<el-form-item label="商品轮播图" prop="list_pic_url" v-if="infoForm.show_pic_or_video == 1">
				<draggable v-model="infoForm.list_pic_url" draggable=".gallery-item" class="drag-wrap">
					<div v-for="(url, idx) in infoForm.list_pic_url" class="gallery-item">
						<el-image :preview-src-list="previewList" @click="previewIndexImg(idx)" style="width: 148px; height: 148px;margin:0 10px 10px 0;"
							:src="getCompleteUrl(url)" fit="cover"></el-image>
						<div class="shadow" @click="onRemoveHandler(idx)">
							<i class="el-icon-delete"></i>
						</div>
					</div>
					<UploadFile :multiple="true" :showFileList="false" :limit="10" :fpaths.sync="infoForm.list_pic_url"></UploadFile>
				</draggable>
			</el-form-item>
			<el-form-item label="商品视频" prop="video_url" v-if="infoForm.show_pic_or_video == 2">
				<video class="video-wrap" v-if="infoForm.video_url" :src="getCompleteUrl(infoForm.video_url)" controls="controls">您的浏览器不支持视频播放</video>
				<UploadFile v-if="!infoForm.video_url" fileType="video" :fpaths.sync="infoForm.video_url"></UploadFile>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
				<el-input v-model="infoForm.name"></el-input>
			</el-form-item>
			<el-form-item label="商品简介" prop="brief">
				<el-input type="textarea" v-model="infoForm.brief" :rows="3"></el-input>
				<div class="form-tip"></div>
			</el-form-item>
			<el-form-item label="商品单位" prop="unit">
				<el-input v-model="infoForm.unit"></el-input>
				<div class="form-tip">如：件、包、袋</div>
			</el-form-item>
			<el-form-item label="销量" prop="sales">
				<el-input v-model.number="infoForm.sales"></el-input>
			</el-form-item>
			<el-form-item label="型号和价格" prop="spec_id">
				<div>
					<el-select class="el-select-class" v-model="infoForm.spec_id" placeholder="选择型号分类">
						<el-option v-for="item in specificationList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="spec-wrap">
					<el-table :data="infoForm.products" stripe style="width: 100%">
						<el-table-column prop="sku" label="商品SKU" width="140">
							<template scope="scope">
								<el-input @blur="checkSkuOnly(scope.$index, scope.row)" size="mini" v-model="scope.row.sku" placeholder="商品SKU"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="short_name" label="快递单上的简称" width="140">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.short_name" placeholder="简称"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="attr" label="型号/规格" width="150">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.attr" placeholder="如1斤/条"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="cost" label="成本(元)" width="120">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.cost" placeholder="成本"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="retail" label="零售(元)" width="120">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.retail" placeholder="零售"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="weight" label="重量(KG)" width="130">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.weight" placeholder="重量"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="stock" label="库存" width="130">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.stock" placeholder="库存"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="sort" label="排序" width="120">
							<template scope="scope">
								<el-input size="mini" v-model="scope.row.sort" placeholder="1"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="70">
							<template scope="scope">
								<el-button size="mini" type="danger" icon="el-icon-delete" circle @click="productDelete(scope.$index, scope.row)">
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-button class="marginTop20" type="primary" @click="addProduct">新增型号</el-button>
				</div>
			</el-form-item>
			<el-form-item label="属性设置" class="checkbox-wrap">
				<el-radio-group v-model="infoForm.attr" class="radio-list">
					<el-radio :label="0">普通</el-radio>
					<el-radio :label="1">新品</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="选择快递模板">
				<el-select v-model="infoForm.express_template_id" placeholder="请选择快递">
					<el-option v-for="item in kdOptions" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number :mini="1" :max="100" v-model="infoForm.sort"></el-input-number>
			</el-form-item>
			<el-form-item label="">
				<el-switch active-text="上架" inactive-text="下架" active-value="0" inactive-value="1" v-model="infoForm.on_sale"></el-switch>
			</el-form-item>
			<el-form-item label="商品详情" prop="detail">
				<div class="edit_container">
					<tinymce v-model="infoForm.detail" :height="300" />
				</div>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
				<el-button @click="goBackPage">返回列表</el-button>
				<el-button type="danger" class="float-right" @click="onCopyGood" v-if="infoForm.id > 0">复制商品</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { goodsCategoryList } from '@/api/goodsCategory'
import { goodsProductCheck } from '@/api/goodsProduct'
import { goodsSpecList } from '@/api/goodsSpec'
import { getCompleteUrl } from '@/api'
import { goodsAdd, goodsUpdate } from '@/api/goods'
import UploadFile from '@/components/Upload/index2'
import draggable from 'vuedraggable'

const defaultForm = {
	name: "",
	list_pic_url: [],
	brief: '',
	attr: 1,
	on_sale: 0,
	products: [],
	show_pic_or_video: '1',
	sort: 1,
	express_template_id: '1'
}
export default {
	components: { Tinymce, UploadFile, draggable },
	data() {
		const validateListPicUrl = (rule, value, callback) => {
			if (this.infoForm.show_pic_or_video == 1 && !value) {
				callback(new Error('轮播图至少需要一张'))
			} else {
				callback()
			}
		}
		const validateVideoUrl = (rule, value, callback) => {
			if (this.infoForm.show_pic_or_video == 2 && !value) {
				callback(new Error('视频不能为空'))
			} else {
				callback()
			}
		}
		return {
			kdOptions: [],
			cateOptions: [],
			infoForm: defaultForm,
			infoRules: {
				name: [{
					required: true,
					message: '请输入名称',
					trigger: 'blur'
				}, ],
				brief: [{
					required: true,
					message: '请输入简介',
					trigger: 'blur'
				}, ],
				list_pic_url: [{
					validator: validateListPicUrl,
					message: '至少需要一张轮播图',
					trigger: 'blur'
				}, ],
				video_url: [{
					validator: validateVideoUrl,
					message: '视频不能为空',
					trigger: 'blur'
				}]
			},
			specificationList: [],
			previewList: [],
		}
	},
	methods: {
		getCompleteUrl(url) {
            return getCompleteUrl(url)
        },
		onRemoveHandler(index) {
			let that = this;
			that.$confirm('确定删除该图片?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					let arr = that.infoForm.list_pic_url;
					arr.splice(index, 1)
				})
				.catch(() => {})
		},
		previewImg() {
			let that = this;
			that.previewList = [];
			that.previewList.push(this.getCompleteUrl(that.infoForm.pic_url));
		},
		previewIndexImg(index) {
			let that = this;
			that.previewList = [];
			let arr = that.infoForm.list_pic_url;
			that.previewList.push(this.getCompleteUrl(arr[index]));
		},
		checkSkuOnly(index, row) {
			console.log("checkSkuOnly ==> ", index, row);
			if (row.sku == '') {
				this.$message({
					type: 'error',
					message: 'SKU不能为空'
				})
				return false;
			}

			goodsProductCheck({ sku: row.sku }).then((response) => {
				if (response.data.success) {
					this.$message({
						type: 'success',
						message: '该SKU可以用！'
					})
				} else {
					this.$message({
						type: 'error',
						message: '该SKU已存在！'
					})
				}
			})
		},
		addProduct() {
			let product = {
				sku: '',
				short_name: '',
				attr: '',
				cost: '',
				retail: '',
				weight: '',
				stock: 10000,
				sort: 1
			}
			this.infoForm.products.push(product)
		},
		productDelete(index, row) {
			this.infoForm.products.splice(index, 1);
		},
		delePicList() {
			let that = this;
			that.$confirm('确定删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(() => {
				that.infoForm.pic_url = '';
			})
			.catch(() => {})
		},
		goBackPage() {
			this.$router.go(-1);
		},
		onCopyGood() {
			this.$confirm('确定复制该商品？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios.post('goods/copygoods', {
					id: this.infoForm.id
				}).then((response) => {
					if (response.data.errno === 0) {
						this.$message({
							type: 'success',
							message: '复制成功!'
						});
					}
				})
			});
		},
		onSubmitInfo() {
			this.$refs['infoForm'].validate(async (valid) => {
				if (!valid) {
					return false
				}
				if (this.infoForm.pic_url == '' || this.infoForm.pic_url == null) {
					this.$message({
						type: 'error',
						message: '请上传商品首图！'
					})
					return false;
				}
				if (this.infoForm.show_pic_or_video === 1 && this.infoForm.list_pic_url.length <= 0) {
					this.$message({
						type: 'error',
						message: '请至少上传一张轮播图！'
					})
					return false;
				}
				
				if (this.infoForm.products.length == 0) {
					this.$message({
						type: 'error',
						message: '请添加一个规格型号'
					})
					return false;
				}
				for (const ele of this.infoForm.products) {
					if (ele.cost == '' || ele.short_name == '' || ele.attr == '' || ele.retail == '' 
						|| ele.weight == '' || ele.stock == '' || ele.sort == '') {
						this.$message({
							type: 'error',
							message: '型号参数里的值不能为空'
						})
						return false;
					}
				}
				let res
				if (this.infoForm.id) {
					delete this.infoForm.createTime
					delete this.infoForm.updateTime
					delete this.infoForm.actual_sales
					delete this.infoForm.stock
					for (let obj of this.infoForm.products) {
						delete obj.createTime
						delete obj.updateTime
						delete obj.__v
						delete obj._id
						delete obj.belong_user_id
						delete obj.goods_id
					}
					res = await goodsUpdate(this.infoForm)
				} else {
					res = await goodsAdd(this.infoForm)
				}
				const { success, message } = res.data
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
			});
		},
		// 获取所有分类
		async getAllCategory() {
			const res = await goodsCategoryList()
			const { data } = res.data
			this.cateOptions = data
		},
		async getAllSpecification() {
			const res = await goodsSpecList()
			const { data } = res.data
			console.log('getAllSpecification ==> ', data)
			this.specificationList = data
		},
		loadData() {
			this.getAllSpecification()
			this.getAllCategory()
		}
	},
	computed: {
	},
	mounted() {
		this.infoForm = this.$route.query.id ? this.$route.query : defaultForm;
		// console.log('infoForm ==> ', this.infoForm)
		// console.log('this.$route.query ==> ', this.$route.query)
		this.loadData();
	},
}
</script>

<style scoped>
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

	.gallery-item {
		display: flex;
		justify-content: center;
		align-items: center;
		float: left;
		position: relative;
	}

	.gallery-item:hover .shadow {
		opacity: 1;
	}

	.video-wrap {
		width: 200px;
		height: 200px;
	}

	.dialog-header {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.dialog-header .value {
		width: 150px;
		margin-right: 14px;
	}

	.input-wrap .el-input {
		width: 200px;
		float: left;
		margin: 0 20px 20px 0;
	}

	.input-wrap .el-input input {
		background-color: #fff !important;
		color: #233445 !important;
	}

	.specFormDialig .el-input {
		width: 150px;
		margin-right: 10px;
	}

	.el-select-class {
		width: 200px;
		margin-right: 20px;
	}

	.sepc-form {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.spec-form-wrap {
		margin-top: 0 !important;
	}

	.add-spec {
		margin-top: 10px;
	}

	.spec-form-wrap .header {
		display: flex;
		justify-content: flex-start;
	}

	.spec-form-wrap .header .l {
		width: 200px;
		margin-right: 20px;
	}

	.spec-form-wrap .header .m {
		width: 200px;
		margin-right: 20px;
	}

	.spec-form-wrap .header .m {
		width: 200px;
		margin-right: 20px;
	}

	/*.sepc-form div{*/
	/*margin-left: 0;*/
	/*}*/

	.float-right {
		float: right;
	}

	.sepc-form .el-input {
		width: 200px;
		margin-right: 20px;
	}

	.marginTop20 {
		margin-top: 20px;
	}

	.checkbox-wrap .checkbox-list {
		float: left;
		margin-right: 20px;
	}

	.upload_ad {
		display: none;
	}

	.upload_ad .el-upload--picture-card {
		display: none;
	}

	.ql-container {
		min-height: 200px;
		max-height: 400px;
		overflow-y: auto;
	}

	.image-uploader-diy {
		/*height: 200px;*/
		position: relative;
	}

	.image-uploader-diy .el-upload {
		border: 1px solid #d9d9d9;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.image-uploader-diy .el-upload:hover {
		border-color: #20a0ff;
	}

	.image-uploader-diy .image-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 200px;
		height: 200px;
		line-height: 200px;
		text-align: center;
	}

	.image-uploader-diy .image-show {
		min-width: 148px;
		height: 148px;
		background-color: #f9f9f9;
		display: block;
	}

	.index-image {
		width: 148px;
		height: 148px;
		position: relative;
	}

	.index-image:hover .o-shadow {
		opacity: 1;
	}

	.image-uploader-diy .new-image-uploader {
		font-size: 28px;
		color: #8c939d;
		width: 165px;
		height: 105px;
		line-height: 105px;
		text-align: center;
	}

	.image-uploader-diy .new-image-uploader .image-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 165px;
		height: 105px;
		line-height: 105px;
		text-align: center;
	}

	.image-uploader-diy .new-image-uploader .image-show {
		width: 165px;
		height: 105px;
		display: block;
	}

	.item-url-image-fuzhu .el-input {
		width: 260px;
	}

	.hidden {
		display: none;
	}

	.el-input {
        width: 60%;
    }

    .el-textarea {
        width: 60%;
    }
	.edit_container {
		width: 80%;
	}
	.form-table-box {
		margin-top: 20px;
	}
</style>
