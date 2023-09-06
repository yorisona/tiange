<template>
  <div>
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new contract-form-modal"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      top="70px"
      @close="visible = false"
    >
      <template #title>
        <span>上传模板</span>
      </template>
      <div
        class="dialog-content"
        style="
          padding: 25px 0;
          overflow-y: auto;
          max-height: 554px;
          min-height: 280px;
          overflow-x: hidden;
        "
      >
        <el-form size="mini" :model="form" :rules="formRules" label-width="110px" ref="formRef">
          <!-- [合同模板] -->
          <el-form-item
            label="模板类型："
            prop="template_type"
            style="display: inline-block; width: 548px; margin-top: 0"
          >
            <el-radio-group v-model="form.template_type" style="line-height: 29px">
              <el-radio :label="1" style="line-height: 29px">客户合同</el-radio>
              <el-radio :label="2" style="line-height: 29px">供应商合同</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合同模板：" prop="name" style="width: 500px">
            <el-upload
              action
              class="upload-btn-wrap"
              :show-file-list="false"
              :multiple="false"
              :http-request="uploadAttachmentFile"
              accept=".doc,.docx"
            >
              <tg-button v-if="!form.name" style="margin-top: 3px" icon="ico-btn-upload"
                >上传文件</tg-button
              >
              <tg-button
                style="
                  color: var(--theme-color);
                  border: none;
                  padding: 0 !important;
                  width: 350px;
                  justify-content: flex-start;
                "
                v-else
                ><span
                  style="
                    display: inline-block;
                    max-width: 330px;
                    overflow: hidden;
                    line-height: 29px;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ form.name }}</span
                ><tg-button
                  icon="ico-btn-upload"
                  style="
                    border: none;
                    color: var(--theme-color);
                    padding-top: 6px !important;
                    background-color: transparent;
                  "
                ></tg-button
              ></tg-button>
            </el-upload>
            <span v-if="!form.name" class="upload-tips mgl-16"
              >支持扩展名：.docx .doc ,大小不超过10M</span
            >
          </el-form-item>
          <!-- [销售渠道] -->
          <el-form-item label="业务类型：" prop="business_types" style="margin-top: 10px">
            <el-checkbox-group
              class="contract-checkbox-group"
              v-model="form.business_types"
              @change="handleCheckedSaleChanceChange"
            >
              <el-checkbox
                class="chance-checkbox"
                v-for="(chance, index) in saleChances"
                :label="chance.value"
                :key="index"
                style="height: 16px; line-height: 16px"
                >{{ chance.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <!-- [显示排序] -->
          <el-form-item
            label="显示排序："
            prop="priority"
            style="display: inline-block; width: 578px; margin-top: 10px"
          >
            <el-input
              type="number"
              min="1"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="form.priority"
              placeholder="在下载页面的显示顺序，数字越小越靠前"
              @blur="inputPrice"
              style="width: 344px; margin-top: 2px"
            />
          </el-form-item>
          <el-form-item
            label="模板状态："
            prop="status"
            style="display: inline-block; width: 578px; margin-top: 0px"
          >
            <el-radio-group v-model="form.status" style="line-height: 29px; height: 29px">
              <el-radio :label="1" style="line-height: 29px; height: 29px">启用</el-radio>
              <el-radio :label="0" style="line-height: 29px; height: 29px">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="visible = false">取消</tg-button>
        <tg-button type="primary" @click="saveClick" :disabled="saveLoading">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存数据，请稍候..." />
  </div>
</template>

<script src="./templateContractDialog.ts"></script>

<style lang="less" scoped>
@import './index.less';

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: gray;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield !important;
}
/deep/ input {
  -moz-appearance: textfield !important;
}
/deep/ input::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
