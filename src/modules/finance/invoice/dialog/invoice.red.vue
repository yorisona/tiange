<template>
  <div class="invoice-red-dialog">
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      title="开红票申请"
      :visible="visible"
      width="624px"
      destroy-on-close
      @close="cancel"
      :close-on-click-modal="false"
    >
      <invoice-base v-if="visible" :info="invoice" @changeDepartId="ChangeDepartmentId" />
      <div class="reason-box red">
        <el-form ref="formRef" :rules="formRules" :model="form" size="mini" label-position="top">
          <el-form-item label="发票红冲原因：" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              v-model="form.remark"
              placeholder="请输入原因"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="radio-flex">
              <p class="slot"><span class="star">*</span>对方是否已认证发票：</p>
              <el-radio-group v-model="form.is_certified">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item v-if="form.is_certified" prop="attachment">
            <div class="upload-box">
              <tg-upload
                :disabled="form.attachment.length >= 1"
                action="/api/financial/upload_red_invoice_attachment"
                :show-file-list="false"
                :beforeUpload="beforeUpload"
                :success="successHandle"
              >
                <tg-button :disabled="form.attachment.length >= 1" icon="ico-upload-lite"
                  >上传附件</tg-button
                >
              </tg-upload>
              <span class="file-tips">
                支持扩展名：.pdf .png .jpg .jpeg；（文件大小不超过30M）
              </span>
            </div>
            <div class="file-list-box">
              <upload-file-list v-model="form.attachment" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <tg-button @click="cancel" class="mgr-12">取 消</tg-button>
        <tg-button type="primary" @click="submit">提 交</tg-button>
      </div>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>
<script src="./invoice.red.ts"></script>
<style lang="less">
@import './invoice.red.less';
.reason-box.red {
  .el-form .el-form-item {
    &:first-child {
      width: 554px !important;
    }
    width: auto !important;
    &.el-form-item--mini .el-form-item__content .el-radio-group {
      padding-top: 0;
    }
  }
}
</style>
