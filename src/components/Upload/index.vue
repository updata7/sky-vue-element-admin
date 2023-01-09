<!-- 可拖拽的 -->
<template>
    <el-upload
        drag
        :action="uploadUrl"
        :show-file-list="showFileList"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :before-remove="beforeRemove"
        :on-exceed="onExceed"
        :multiple="multiple"
        :headers="headers"
        :fileType="fileType"
        name="files"
        :limit="limit">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
        </div>
    </el-upload>
</template>
  
<script>
import { uploadUrl } from '@/api'
import { getToken } from '@/utils/auth'
export default {
    name: "UploadFile",
    props:{
        fpaths: {
            type: [String, Array]
        },
        multiple: {
            type: Boolean,
            default: false
        },
        showFileList: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 1
        },
        fileType: {
            type: String,
            default: 'image'  // 文件类型 video, txt, excel
        }
    },
    data: function () {
        return {
            uploadUrl,
            headers: {
                "access-token": getToken(),
            },
            tmpPaths: []
        }
    },
    methods:{
        handleAvatarSuccess(res, file) {
            console.log('handleAvatarSuccess ===> ', typeof this.tmpPaths, res)
            if (this.multiple) {
                this.tmpPaths.push(...res.paths)
            } else {
                this.tmpPaths = res.paths[0]
            }
            this.$emit('update:fpaths', this.tmpPaths);
        },
        beforeRemove(file, fileList) {
            let rmFilePath = file.response ? file.response.paths[0] : file.name
            if (typeof this.value === "object") {
                let index = this.value.indexOf(rmFilePath)
                this.tmpPaths.splice(index, 1)
            } else {
                this.tmpPaths = null
            }
            this.$emit('update:fpaths', this.tmpPaths);
        },
        beforeAvatarUpload(file) {
            if (this.fileType === 'image') {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        },
        onExceed() {
            this.$message.error(`最多只能传${this.limit}张图片`);
        }
    }
}
</script>

<style lang="scss" scoped>
</style>