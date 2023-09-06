<template>
  <div>
    <el-dialog
      class="customer-dialog new-statement-dialog tg-dialog-vcenter"
      :visible="visible"
      width="478px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="onCancelBtnClick"
    >
      <template #title>
        <span>新增客户结算单</span>
      </template>
      <div class="form-block">
        <el-form :model="form" :rules="formRules" ref="formRef" label-width="86px" size="mini">
          <!-- <div class="subject mgb-10">结算单基本信息</div> -->
          <el-form-item label="合同编号：" prop="contract_id">
            <el-select
              :disabled="isRelaunch"
              v-model="contract_uid"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请搜索并选择合同编号"
              class="contract-attachment-input"
              popper-class="contract-select-empty el-select-popper-mini"
              :remote-method="getCustmerByContractUid_extend"
              :loading="contract_uid_loading"
              @change="onContractUidChange"
            >
              <el-option
                v-for="item in contractInfoRecords"
                :key="item.contract_uid"
                :label="item.contract_uid"
                :value="item.contract_uid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户：" prop="partner_name">
            <el-input
              class="contract-attachment-input"
              v-model.trim="form.partner_name"
              placeholder="请搜索并选择关联合同编号"
              disabled
            />
          </el-form-item>
          <el-form-item v-if="project" label="项目：" :rules="[{ required: true }]">
            <el-input
              v-if="project.project_name"
              class="contract-attachment-input"
              v-model="project.project_name"
              placeholder="请先关联合同编号"
              disabled
            ></el-input>
            <el-input
              v-else
              class="contract-attachment-input"
              v-model="project.cooperation_name"
              placeholder="请先关联合同编号"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item v-if="project" label="费用承担部门：">
            <el-input
              class="contract-attachment-input"
              v-model="project.feishu_department_name"
              disabled
            ></el-input>
          </el-form-item>
          <!-- <el-form-item v-if="project && project.business_type !== 5" label="品牌：">
            <el-input
              class="contract-attachment-input"
              v-model="project.brand_name"
              placeholder="请先关联合同编号"
              disabled
            ></el-input>
          </el-form-item> -->
          <el-form-item
            label="审批金额："
            :prop="`settlement_detail[${0}].settle_amount`"
            :rules="settlementDetailRules.settle_amount"
          >
            <el-input
              :disabled="isRelaunch"
              class="contract-attachment-input"
              v-model="form.settlement_detail[0].settle_amount"
              placeholder="请输入审批金额"
              @input="inputApprovalAmount"
            />
          </el-form-item>
          <!-- [开始日期] -->
          <el-form-item
            label="开始日期："
            :prop="`settlement_detail[${0}].start_date`"
            :rules="settlementDetailRules.start_date"
          >
            <el-date-picker
              clearable
              :disabled="isRelaunch"
              placeholder="开始日期"
              class="contract-attachment-input"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              v-model="form.settlement_detail[0].start_date"
              @change="value => onStartDateChange(0, value)"
            />
          </el-form-item>
          <!-- [结束日期] -->
          <el-form-item
            label="结束日期："
            :prop="`settlement_detail[${0}].end_date`"
            :rules="settlementDetailRules.end_date"
          >
            <el-date-picker
              clearable
              :disabled="isRelaunch"
              placeholder="结束日期"
              class="contract-attachment-input"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              v-model="form.settlement_detail[0].end_date"
              @change="value => onEndDateChange(0, value)"
            />
          </el-form-item>
          <el-form-item label="附件单：" prop="attachment_url" style="margin-right: 0 !important">
            <div class="upload-btn-wrap">
              <el-upload
                action="/"
                class="upload-attachment"
                :multiple="false"
                :show-file-list="false"
                accept=".jpeg,.jpg,.png,.pdf,.docx,.xlsx"
                :http-request="uploadAttachmentFile"
                :disabled="uploadedAttachmentList.length >= 5"
              >
                <tg-button icon="ico-btn-upload" :disabled="uploadedAttachmentList.length >= 5"
                  >上传文件
                </tg-button>
              </el-upload>
            </div>
            <!-- <el-popover
              popper-class="moreitems-popover"
              placement="right"
              width="150"
              trigger="hover"
              style="margin-top: -4px; display: block"
            >
              <template slot="reference">
                <span class="upload-tips"
                  >支持扩展名：.docx .pdf .jpg .png .xlsx；最多上传5个文件夹...
                </span>
              </template> -->
            <span class="upload-tips"
              >支持扩展名：.docx .pdf .jpg .png .xlsx；最多上传5个文件夹 (单个文件大小不超过30M)
            </span>
            <!-- </el-popover> -->
            <div class="uploaded-list" v-if="uploadedAttachmentList.length">
              <upload-file-list v-model="uploadedAttachmentList" inline />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button type="default" @click="onCancelBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onConfirmBtnClick">提交</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交数据，请稍候..." />
  </div>
</template>

<script src="./newStatement.ts"></script>

<style lang="less" scoped>
@charset 'utf-8';
@import '~@/styles/utils/index.less';
.new-statement-dialog {
  padding: 20px;
  .upload-tips {
    position: relative;
    top: 5px;
    .fc(12px, var(--text-third-color));
  }
  .form-block {
    padding: 24px 32px;
    //height: 554px;
    max-height: 716px;
    overflow-y: auto;
    & .contract-attachment-input {
      width: 335px;
    }
    .el-form-item {
      margin-right: 18px;
    }
    .el-form-item:nth-child(3n + 1) {
      margin-right: 0;
    }
    .uploaded-list {
      margin-top: 2px;
      // width: 660px;
      /deep/.upload-file-list {
        .file-name {
          max-width: 265px;
        }
      }
    }
  }
}
// @import  ./statement.less;
</style>
