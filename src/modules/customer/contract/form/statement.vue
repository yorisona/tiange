<template>
  <div>
    <el-dialog
      class="customer-dialog statement-dialog tg-dialog-vcenter"
      :visible="visible"
      width="822px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="onCancelBtnClick"
    >
      <template #title>
        <span>新增客户结算单</span>
      </template>
      <div class="form-block">
        <el-form
          :model="form"
          :rules="formRules"
          ref="formRef"
          label-width="86px"
          size="mini"
          inline
        >
          <div class="subject mgb-10">结算单基本信息</div>
          <el-form-item label="合同编号：" prop="contract_id">
            <el-select
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
          <el-form-item v-if="project && project.business_type !== 5" label="品牌：">
            <el-input
              class="contract-attachment-input"
              v-model="project.brand_name"
              placeholder="请先关联合同编号"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="审批金额：" prop="approval_amount">
            <el-input
              class="contract-attachment-input"
              v-model="form.approval_amount"
              placeholder="请输入审批金额"
              @input="inputApprovalAmount"
            />
          </el-form-item>
          <el-form-item label="用章情况：" prop="seal_type">
            <el-select
              popper-class="el-select-popper-mini"
              class="contract-attachment-input"
              v-model="form.seal_type"
            >
              <el-option
                style="width: 158px"
                v-for="item in SealTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请内容：" prop="comment">
            <el-input
              type="textarea"
              style="width: 426px"
              :maxlength="100"
              v-model.trim="form.comment"
              placeholder="请输入文本"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="附件单：" prop="attachment_url">
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
            <span class="upload-tips mgl-12"
              >支持扩展名：.docx .pdf .jpg .png .xlsx；最多上传5个文件夹 (单个文件大小不超过30M)
            </span>
            <div class="uploaded-list" v-if="uploadedAttachmentList.length">
              <upload-file-list v-model="uploadedAttachmentList" inline />
            </div>
            <!-- <div class="uploaded-list">
            <span v-for="(item, index) in uploadedAttachmentList" :key="index">
              <tg-icon name="ico-annex" style="font-size: 14px" />
              <a style="margin-left: 4px">{{ item.file }}</a>
              <tg-icon
                name="ico-cross"
                hover-name="ico-cross-red"
                @click="handleAttachmentClick(index)"
                style="margin-left: 4px; font-size: 14px; cursor: pointer"
              />
            </span>
          </div> -->
          </el-form-item>
          <div class="subject mgb-16" style="margin-top: 8px">结算情况</div>
          <!-- [结算情况] -->
          <div
            class="settlement-detail-item"
            v-for="(settlement, index) in form.settlement_detail"
            :key="index"
          >
            <!-- [结算方式] -->
            <el-form-item
              :label-width="labelWidth"
              label="结算方式："
              :prop="`settlement_detail[${index}].settle_way`"
              :rules="settlementDetailRules.settle_way"
              style="margin: 0"
            >
              <el-radio-group v-model="settlement.settle_way" style="display: inline-flex">
                <el-radio v-for="opt in SettleWayOptions" :label="opt.value" :key="opt.value"
                  >{{ opt.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- [下面一行三列] -->
            <div class="settlement-detail-item-grid">
              <!-- [店铺名称] -->
              <el-form-item
                :label-width="labelWidth"
                label="店铺名称："
                :prop="`settlement_detail[${index}].shop_name`"
                :rules="settlementDetailRules.shop_name"
                v-if="isVTask(settlement)"
              >
                <el-input
                  :maxlength="20"
                  v-model.trim="settlement.shop_name"
                  placeholder="店铺名称"
                  style="width: 158px"
                />
              </el-form-item>
              <!-- [下单旺旺名] -->
              <el-form-item
                :label-width="labelWidth"
                label="旺旺名："
                style="margin: 0 !important"
                :prop="`settlement_detail[${index}].wangwang_num`"
                :rules="settlementDetailRules.wangwang_num"
                v-if="isVTask(settlement)"
              >
                <el-input
                  :maxlength="20"
                  v-model.trim="settlement.wangwang_num"
                  placeholder="下单旺旺名"
                  style="width: 158px"
                />
              </el-form-item>
              <!-- [结算金额] -->
              <el-form-item
                :label-width="labelWidth"
                style="margin: 0 !important"
                label="结算金额："
                :prop="`settlement_detail[${index}].settle_amount`"
                :rules="settlementDetailRules.settle_amount"
              >
                <el-input
                  v-model="settlement.settle_amount"
                  placeholder="0.00"
                  @input="value => inputAmount(index, 'settle_amount', value)"
                  style="width: 158px"
                />
              </el-form-item>
              <!-- [开始日期] -->
              <el-form-item
                :label-width="labelWidth"
                label="开始日期："
                style="margin: 0 !important"
                :prop="`settlement_detail[${index}].start_date`"
                :rules="settlementDetailRules.start_date"
              >
                <el-date-picker
                  clearable
                  placeholder="开始日期"
                  style="width: 158px"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  v-model="settlement.start_date"
                  @change="value => onStartDateChange(index, value)"
                />
              </el-form-item>
              <!-- [结束日期] -->
              <el-form-item
                :label-width="labelWidth"
                label="结束日期："
                style="margin: 0 !important"
                :prop="`settlement_detail[${index}].end_date`"
                :rules="settlementDetailRules.end_date"
              >
                <el-date-picker
                  clearable
                  placeholder="结束日期"
                  style="width: 158px"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  v-model="settlement.end_date"
                  @change="value => onEndDateChange(index, value)"
                />
              </el-form-item>
              <!-- [已收金额] -->
              <!-- <el-form-item
              :label-width="labelWidth"
              label="已收金额："
              :prop="`settlement_detail[${index}].done_amount`"
              :rules="settlementDetailRules.done_amount"
            >
              <el-input
                size="medium"
                v-model="settlement.done_amount"
                placeholder="0.00"
                @input="value => inputAmount(index, 'done_amount', value)"
                style="width: 158px"
              />
            </el-form-item> -->
              <!-- [待收金额] -->
              <!-- <el-form-item
              :label-width="labelWidth"
              label="待收金额："
              :prop="`settlement_detail[${index}].wait_amount`"
              :rules="settlementDetailRules.wait_amount"
            >
              <el-input
                size="medium"
                v-model="settlement.wait_amount"
                placeholder="0.00"
                @input="value => inputAmount(index, 'wait_amount', value)"
                style="width: 158px"
              />
            </el-form-item> -->
              <!-- [已开票金额] -->
              <!-- <el-form-item
              :label-width="labelWidth"
              label="已开票金额："
              :prop="`settlement_detail[${index}].invoice_amount`"
              :rules="settlementDetailRules.invoice_amount"
            >
              <el-input
                size="medium"
                v-model="settlement.invoice_amount"
                placeholder="0.00"
                @input="value => inputAmount(index, 'invoice_amount', value)"
                style="width: 158px"
              />
            </el-form-item> -->
            </div>
            <!-- [备注] -->
            <el-form-item
              :label-width="labelWidth"
              label="备注："
              :prop="`settlement_detail[${index}].remark`"
              :rules="settlementDetailRules.remark"
              style="width: 512px"
            >
              <el-input
                :maxlength="20"
                style="width: 416px"
                v-model.trim="settlement.remark"
                placeholder="备注（不超过20个字）"
                show-word-limit
              />
            </el-form-item>
            <div class="close-btn" @click="removeSettlement(index)" v-if="!isOnlyEmpty">
              <tg-icon name="ico-cross-lite" />
            </div>
          </div>
          <div class="statement-add-btn" @click="addSettlement" v-if="!isFullSettlementDetail">
            <tg-icon name="ico-btn-add" />
            <span>点击添加</span>
          </div>
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

<script src="./statement.ts"></script>

<style lang="less">
@import './statement.less';
</style>
