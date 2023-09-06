<template>
  <common-dialog
    ref="certificateUploadDialog"
    :isAppendToBody="true"
    :title="'上传' + name"
    :width="460"
    :isfooter="false"
    @dialog-cancel="dialogCancelHandle"
  >
    <div class="box">
      <div id="preview" @paste="handlePaste">
        <!-- <p>
          <img class="upload_img_icon" src="@/assets/img/upload_img_icon.png" alt />
        </p>
        <span style="color:#396FFF">将图片按Ctrl+V 粘贴至此处</span> -->
      </div>
      <p id="log"></p>
      <div class="fujian-list clearfix" v-if="certificate_pic !== ''" style="margin-left: 50px">
        <i class="iconfont iconfujian mr5"></i>
        <span class="brand-color mr5">{{
          certificate_pic.split('/')[certificate_pic.split('/').length - 1] || '--'
        }}</span>
        <i class="el-icon-error" @click="removePlan()"></i>
      </div>
    </div>
    <template #tip>
      <p class="el-upload__tip">支持扩展名：.jpg .jpeg .png</p>
    </template>
    <div class="tac" style="margin-bottom">
      <el-button
        :disabled="isDisable"
        class="big-button"
        size="small"
        type="primary"
        v-loading="loading"
        @click="uploadPlans"
        >上传文件</el-button
      >
    </div>
  </common-dialog>
</template>

<script>
import { uploadCertificate } from '@/api/cooperative';

export default {
  name: 'CertificateUpload',
  props: ['id', 'name', 'type'],
  data() {
    return {
      isDisable: false,
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      loading: false,
      certificate_pic: '',
      file: null,
    };
  },
  mounted() {
    /* do nth */
  },
  methods: {
    // 监听粘贴操作
    handlePaste(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        // log.innerHTML = '<span style="color:red;">当前浏览器不支持本地</span>';
        this.$message.error('当前浏览器不支持本地');
        return;
      }

      // 搜索剪切板items
      for (let ii = 0; ii < items.length; ii++) {
        if (items[ii].type.indexOf('image') !== -1) {
          file = items[ii].getAsFile();
          break;
        }
      }

      if (!file) {
        // log.innerHTML = '<span style="color:red;">粘贴内容非图片</span>';
        this.$message.error('粘贴内容非图片');
        return;
      }

      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      const reader = new FileReader();
      reader.onload = event => {
        document.querySelector(
          '#preview',
        ).innerHTML = `<img src="${event.target.result}" class="upload-image" id="upload-image">`;
      };
      reader.readAsDataURL(file);
      this.file = file;
    },

    // 显示
    show() {
      this.isDisable = false;
      this.file = '';
      this.certificate_pic = '';
      this.$refs.certificateUploadDialog.dialogOpen();
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans() {
      const file = this.file;
      if (!file) {
        // log.innerHTML = '<span style="color:red;">请粘贴图片</span>';
        this.$message.error('请粘贴图片后上传');
        return;
      }
      this.loading = true;
      // if (file.size > 2 * 1024 * 1024) {
      //   this.$message.error('上传图片需小于2M')
      //   return
      // }
      const form = new FormData();
      form.append('file', file);
      form.append('achievement_or_cost_id', this.id);
      form.append('type', this.type);
      uploadCertificate(form)
        .then(data => {
          this.loading = false;
          if (data.data && data.data.success) {
            this.certificate_pic = data.data.data.source;
            this.$message.success(this.name + '上传成功！');
            this.$refs.certificateUploadDialog.dialogClose();

            this.isDisable = true;
            this.data.data.data.source = '';
          } else {
            this.$message.error(this.name + '上传失败！');
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 删除凭证
     * @param
     */
    removePlan() {
      this.isDisable = false;
      this.file = '';
      this.certificate_pic = '';
      // 拿到待删除节点:
      const self = document.getElementById('upload-image');
      // 拿到父节点:
      const parent = self.parentElement;
      // 删除:
      const removed = parent.removeChild(self);
      removed === self; // true
    },
    // 关闭弹窗
    dialogCancelHandle() {
      this.isDisable = false;
      this.$emit('upload-close', this.certificate_pic === '');
      this.$emit('upload-close', this.file === '');
      // 拿到待删除节点:
      const self = document.getElementById('upload-image');
      // 拿到父节点:
      const parent = self.parentElement;
      // 删除:
      const removed = parent.removeChild(self);
      removed === self; // true
    },
  },
};
</script>

<style lang="less" scoped>
.upload_img_icon {
  margin-top: 30px;
  margin-bottom: 15px;
}
/deep/ .el-dialog {
  // padding-bottom: 70px;
}
#preview {
  margin: 0 auto;
  width: 340px;
  height: 146px;
  // background: rgba(255, 255, 255, 1);
  border: 1px dashed rgba(223, 230, 236, 1);
  border-radius: 10px;
  background-image: url('../../../assets/img/upload_img_icon.png');
  background-position: 84px 38px;
  background-size: 50% 50%;
  background-repeat: no-repeat;
  /deep/ .upload-image {
    width: 100%;
    height: 100%;
  }
}

//附件
.fujian-list {
  display: block;
  margin-right: 50px;
  line-height: 15px;
  margin-top: 10px;
  i {
    color: var(--text-des-color);
  }
}
.el-upload__tip {
  color: #b0bcdc;
  font-size: 14px;
  margin-bottom: 10px;
}
/deep/ .el-dialog__body {
  border-radius: 10px;
}
/deep/ .common-dialog .el-dialog__body {
  padding: 10px;
}
.box {
  border-radius: 10px;
  text-align: center;
  background: #fff;
  padding-top: 20px;
  position: relative;
}
.big-button {
  background-color: #396fff;
  margin-top: 20px;
}
</style>
