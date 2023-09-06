<template>
  <div>
    <el-dialog
      class="tg-customer-contract-form-annex-dialog customer-dialog tg-dialog-vcenter"
      :visible="dialogVisible"
      width="850px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="add-attachment-dialog"
      @close="handleDialogClose"
    >
      <template #title><span>新增补充协议</span></template>
      <div style="padding: 20px">
        <el-form
          class="dialog-content"
          ref="annexFormRef"
          :model="annexForm"
          :rules="contract_attachment_rules"
          label-width="130px"
        >
          <!--[关联客户合同]-->
          <el-form-item label="关联客户合同：" prop="contract_type">
            <el-radio-group
              v-model="annexForm.contract_type"
              style="display: inline-flex"
              :disabled="lockContract"
            >
              <el-radio v-for="item in contractTypeOptions" :label="item.value" :key="item.value">{{
                item.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--[关联合同编号]-->
          <el-form-item
            label="关联合同编号："
            label-width="114px"
            class="sub-form-item"
            prop="contract_id"
          >
            <el-input v-model="locked_contract_uid" disabled v-if="lockContract" />
            <el-select
              v-model="contract_uid"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入或者搜索合同编号"
              :remote-method="getCustmerByContractNo"
              size="medium"
              :loading="contract_uid_loading"
              @change="onContractUidChange"
              style="width: 100%"
              v-else
            >
              <el-option
                v-for="item in custmerOption"
                :key="item.contract_uid"
                :label="item.contract_uid"
                :value="item.contract_uid"
              />
            </el-select>
          </el-form-item>
          <!--[客户(公司)名称]-->
          <el-form-item label="客户(公司)名称：" prop="partner_name">
            <el-input v-model="locked_partner_name" disabled v-if="lockContract" />
            <el-input
              size="medium"
              v-model="annexForm.partner_name"
              placeholder="请选择关联合同编号"
              disabled
              v-else
            />
          </el-form-item>
          <!--[审批金额]-->
          <el-form-item label="审批金额：" prop="approval_amount">
            <el-input
              size="medium"
              v-model="annexForm.approval_amount"
              placeholder="请输入审批金额"
              @input="inputApprovalAmount"
            />
          </el-form-item>
          <!--[用章情况]-->
          <el-form-item label="用章情况：" prop="seal_type">
            <el-radio-group
              size="medium"
              v-model="annexForm.seal_type"
              style="display: inline-flex"
            >
              <el-radio :label="opt.value" v-for="opt in SealTypeOptions" :key="opt.value">{{
                opt.label
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--[申请内容]-->
          <el-form-item label="申请内容：" prop="comment">
            <el-input
              size="medium"
              placeholder="请输入申请内容"
              :maxlength="100"
              :show-word-limit="true"
              v-model.trim="annexForm.comment"
            />
          </el-form-item>
          <!--[附件单]-->
          <el-form-item label="附件单：" prop="attachment_url">
            <div class="upload-btn-wrap">
              <el-upload
                action="/"
                class="upload-attachment"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadAttachmentFile"
                accept=".docx,.pdf,.jpg,.jpeg,.xlsx,.png,.xls"
                :disabled="uploadedAttachmentList.length >= 5"
              >
                <tg-button icon="ico-btn-upload" :disabled="uploadedAttachmentList.length >= 5"
                  >上传文件</tg-button
                >
              </el-upload>
            </div>
            <span class="upload-tips mgl-16"
              >支持扩展名：.docx .pdf .jpg .png .xlsx
              .xls；最多上传5个文件夹(单个文件大小不超过30M)</span
            >
            <div class="uploaded-list">
              <div v-for="(item, index) in uploadedAttachmentList" :key="index">
                <tg-icon name="ico-annex" style="font-size: 14px" />
                <a style="margin-left: 4px">{{ item.file }}</a>
                <tg-icon
                  name="ico-cross"
                  hover-name="ico-cross-red"
                  @click="handleAttachmentClick(index)"
                  style="margin-left: 4px; font-size: 14px; cursor: pointer"
                />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handleDialogClose">取消</tg-button>
        <tg-button type="primary" @click="handleAttachmentSubmitClick">提交</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交数据，请稍候..." />
  </div>
</template>

<script src="./annex.tsx"></script>

<style lang="less">
@import './annex.less';
</style>
