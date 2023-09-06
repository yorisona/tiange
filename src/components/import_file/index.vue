<style lang="less" scoped>
/deep/ .el-dialog__footer {
  padding: 0 !important;
}
.upload-wrap {
  padding: 90px 0;
  text-align: center;
  background: #fff;
  border-radius: 10px;
}
.upload-area {
  margin: 0 auto;
  background: #fff;
  border-radius: 2px;
  // /deep/ .el-upload{
  //   border: 1px dashed red;
  // }
  /deep/ .el-button {
    border: 1px dashed #dfe6ec;
    border-radius: 15px;
    font-size: 14px;
    &:hover {
      border: 1px dashed #396fff;
      background: #fff;
    }
  }
}
.import {
  width: 500px;
  height: 240px;
  overflow: hidden;
  .upload-icon {
    width: 78px;
    height: 70px;
    background: url(../../assets/img/import_icon.png) no-repeat;
    margin: 60px auto 20px;
  }
  .upload-title {
    font-size: 16px;
    color: #396fff;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .upload-tip {
    color: #bbb;
    font-size: 12px;
  }
}
.download-template-link {
  display: inline-block;
  margin: 20px 0;
  text-decoration: none;
  color: #fff;
  width: 160px;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
  font-size: 14px;
  background: #396fff;
}
</style>

<template>
  <div class="upload-wrap">
    <el-upload
      class="upload-area"
      action="/"
      multiple
      :http-request="handleImport"
      :show-file-list="false"
    >
      <el-button size="small" :loading="uploadLoading">
        <div class="import">
          <div class="upload-icon"></div>
          <p class="upload-title">批量导入{{ uploadText }}</p>
          <p class="upload-tip">点击此处选择要导入的文件</p>
        </div>
      </el-button>
    </el-upload>
    <el-row style="text-align: center; margin-top: 12px">
      <a :href="fileurl" class="download-template-link" target="_blank">下载模板</a>
      <slot></slot>
    </el-row>
  </div>
</template>

<script>
import { uploadFile } from '@/api/upload';
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config';
import { RouterNameProjectManage } from '@/const/router';

/**
 * 下载模板组件
 */
export default {
  /** uploadText: 导入文件标题
   * uploadKey:  类型，角色
   * downloadSrc: 下载模板链接 */
  props: ['uploadText', 'uploadKey', 'downloadSrc'],
  data() {
    return {
      uploadLoading: false,
    };
  },
  computed: {
    /** 下载模板路径 */
    fileurl() {
      return `${window.location.origin}${this.downloadSrc}`;
    },
  },
  methods: {
    /** 上传文件处理 */
    handleImport(param) {
      this.uploadLoading = true;
      const { file } = param;
      if (file.size > fileMaxSize) {
        this.$message.error(fileMaxSizeTips);
        this.uploadLoading = false;
        return;
      }
      const formData = new FormData();
      formData.append('operate', this.uploadKey);
      formData.append('file', file, file.name);
      uploadFile(formData)
        .then(res => {
          this.uploadLoading = false;
          this.$gmMessage({
            content: res.data.message,
            type: 'success',
            showBtn: true,
            duration: 0,
            submutConfig: {
              visible: true,
              primaryText: '查看结果',
              infoText: '继续导入',
              callback: () => {
                this.$router.push({
                  name: RouterNameProjectManage.marketing.importLog,
                });
              },
            },
          });
        })
        .catch(() => {
          this.uploadLoading = false;
          this.$message({
            type: 'warning',
            message: '导入出错，请稍后重试',
          });
        });
      return false;
    },
  },
};
</script>
