<!--
 * @Description: 新增合同复印件弹窗
 * @Author: 神曲
 * @Date: 2020-03-17 17:09:12
 * @LastEditTime: 2020-12-13 19:12:43
 * @LastEditors: 矢车
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
.upload-item {
  display: flex;
  justify-content: space-around;
  & span {
    flex: 3;
  }
  & i {
    flex: 1;
  }
}
.footer {
  text-align: center;
}
.upload_box {
  margin: 10px 20px;
  // background: #F2F6F9;
  padding: 10px 0;
  max-height: 192px;
  overflow-y: auto;
}
.upload_box_bgc {
  border-radius: 10px;
  margin: 10px 20px;
  background: #f2f6f9;
  padding: 10px 0;
}
::v-deep .common-dialog .el-dialog__body {
  padding-top: 10px;
}
.icon-shanchu:before {
  color: #f05765;
  font-size: 18px;
}
</style>

<template>
  <div id="addContractCopyDialog">
    <common-dialog
      ref="addContractCopyDialog"
      :isAppendToBody="true"
      :title="title"
      :width="500"
      :isfooter_upload="true"
      @dialog-cancel="dialogCancelHandle"
      @dialog-submit="dialogCancelSubmit"
    >
      <div class="upload_box" :class="{ upload_box_bgc: contract_copy.length !== 0 }">
        <div v-for="(item, index) in this.contract_copy" :key="index">
          <div v-if="contract_copy !== ''" style="text-align: center" class="upload-item">
            <i class="iconfont iconfujian mr5"></i>
            <span class="brand-color mr5">{{
              decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
            }}</span>
            <i class="iconfont icon-shanchu" @click="clearUploadedFile(index)"></i>
          </div>
        </div>
      </div>
      <div style="padding-bottom: 15px; text-align: center">
        <el-upload
          :disabled="no_upload_click"
          style="padding: 10px 50px"
          action
          :http-request="uploadPlans"
          :show-file-list="false"
          accept="application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        >
          <el-button
            class="upload-btn btn-blue big-button"
            size="small"
            style="width: 110px"
            type="primary"
            :disabled="no_upload_click"
          >
            <i class="iconfont icon-zhongxinshangchuan"></i>
            {{ this.contract_copy.length === 20 ? '最多传20个' : '上传文件' }}
          </el-button>
          <template #tip>
            <p class="el-upload__tip">支持扩展名：.pdf .doc .docx...(最多上传20个文件)</p>
          </template>
        </el-upload>
      </div>
    </common-dialog>
  </div>
</template>

<script>
import { uploadFile, savaContractCopy } from '@/api/cooperative';

export default {
  name: 'addContractCopyDialog',
  // props: ["id", "name", "type"],
  data() {
    return {
      title: '',
      contract_id: '',
      no_upload_click: false,
      descriptionAccepts: ['pdf', 'doc', 'docx'], // 扩展名
      loading: false,
      contract_copy: [],
    };
  },
  computed: {},
  props: ['contractId'],
  methods: {
    // 显示
    show(row) {
      this.no_upload_click = false;
      this.contract_copy = [];
      if (row.contract_detail.contract_scan_urls.length > 19) {
        this.no_upload_click = true;
      }
      if (row.contract_detail.contract_scan_urls.length > 0) {
        this.title = '编辑合同扫描件';
        for (let i = 0; i < row.contract_detail.contract_scan_urls.length; i++) {
          this.contract_copy.push(row.contract_detail.contract_scan_urls[i].url);
        }
      } else {
        this.title = '上传合同扫描件';
        this.contract_copy = [];
      }
      this.$refs.addContractCopyDialog.dialogOpen();
      setTimeout(() => {
        this.contract_id = this.contractId;
      }, 10);
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans(params) {
      // const vm = this;
      const file = params.file;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const found = this.descriptionAccepts.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.error('上传格式不正确！');
        return;
      }
      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'contract/scan');
      uploadFile(form)
        .then(data => {
          this.loading = false;
          if (data.data && data.data.success) {
            // 每次上传插入数组
            this.contract_copy.push(data.data.data.source);
            if (this.contract_copy.length === 20) {
              this.no_upload_click = true;
            } else {
              this.no_upload_click = false;
            }
            // console.log(vm.contract_copy);
            // this.$message.success("上传成功！");
          } else {
            this.$message.error('上传失败！');
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
    clearUploadedFile(index) {
      this.contract_copy.splice(index, 1);
      this.no_upload_click = false;
    },

    // 关闭弹窗
    dialogCancelHandle() {
      // do nth
      Object.assign(this.$data, this.$options.data());
    },
    // 点击提交
    dialogCancelSubmit() {
      savaContractCopy({
        contract_scan_urls: this.contract_copy,
        contract_id: this.contract_id,
      }).then(res => {
        if (res.data.success) {
          this.$message.success('上传成功');
          this.$refs.addContractCopyDialog.dialogClose();
          this.$emit('upload:success');
        } else {
          this.$message.error('上传失败');
        }
      });
    },
  },
};
</script>
