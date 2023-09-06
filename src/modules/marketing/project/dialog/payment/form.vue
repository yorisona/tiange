<template>
  <div class="payment-dialog-wrapper">
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new payment-dialog"
      width="1184px"
      @close="emitClose"
    >
      <template #title> <span>对外付款申请</span> </template>
      <div class="form-wrapper">
        <el-form
          :rules="paymentFormRules"
          :model="paymentForm"
          inline
          label-width="140px"
          ref="paymentFormRef"
          size="mini"
        >
          <div class="base-title">基本信息</div>

          <el-form-item label="业务类型：" prop="business_type" key="business_type">
            <el-select
              popper-class="el-select-popper-mini"
              disabled
              v-model="business_type_new"
              style="width: 220px"
              placeholder="请选择业务类型"
            >
              <el-option
                :key="key"
                :label="item.label"
                :value="item.value"
                v-for="(item, key) in BusinessTypeAllOptions"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="票款方式：" prop="fare_way" key="fare_way">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.fare_way"
              style="width: 220px"
              placeholder="请选择票款方式"
            >
              <el-option label="先票后款" :value="1"></el-option>
              <el-option label="先款后票" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="付款总额：" prop="transfer_amount" key="transfer_amount">
            <el-input
              style="width: 220px"
              placeholder="根据结算单明细自动计算"
              :disabled="paymentForm.fare_way === 1"
              @input="inputInvoiceNum($event, 'transfer_amount')"
              v-model.trim="paymentForm.transfer_amount"
            />
          </el-form-item>

          <el-form-item label="供应商：" prop="supplier_id" key="supplier_id">
            <el-select
              disabled
              popper-class="el-select-popper-mini"
              v-model="paymentForm.supplier_id"
              style="width: 220px"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择供应商"
              :remote-method="getAllSupplierName"
              @change="onSupplierIdChange"
            >
              <el-option
                v-for="(item, index) in allSupplierName"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否已回款：" prop="is_back" key="is_back">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.is_back"
              style="width: 220px"
              placeholder="请选择是否已回款"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收款编号："
            prop="achievement_uid"
            :rules="{
              required: paymentForm.is_back,
              message: '请输入并选择收款编号',
              trigger: ['change', 'blur'],
            }"
            key="achievement_uid"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.achievement_uid"
              :disabled="!paymentForm.is_back"
              style="width: 220px"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择收款编号"
              :remote-method="getAchievementList"
            >
              <el-option
                v-for="(item, index) in achievementList"
                :key="index"
                :label="item.achievement_uid"
                :value="item.achievement_uid"
              >
                <span>{{ item.achievement_uid }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="成本类别："
            prop="expense_type_biz_code"
            :rules="{
              required: true,
              message: '请选择成本类别',
              trigger: ['change', 'blur'],
            }"
            key="achievement_uid"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.expense_type_biz_code"
              style="width: 220px"
              filterable
              clearable
              placeholder="请选择成本类别"
            >
              <el-option
                v-for="(item, index) in expenseTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <div class="settlementList-title">结算单明细</div>
          <div class="invoice-list-wrapper">
            <div class="header-box">
              <div class="header-item settlement-uid"><span class="star">*</span>结算单编号</div>
              <div class="header-item settlement-amount">结算金额 (元)</div>
              <div class="header-item paid-amount">已付金额 (元)</div>
              <div class="header-item pending_amount">待付金额 (元)</div>
              <div class="header-item pay_amount"><span class="star">*</span>本次支付金额 (元)</div>
              <div class="header-item upload-invoice"><span class="star">*</span>上传发票</div>
              <div class="header-item settlement-delete">操作</div>
            </div>
            <div v-for="(item, index) in paymentForm.settlements" :key="index" class="body-box">
              <div class="body-item settlement-uid">
                <el-form-item
                  label=""
                  :key="index"
                  :prop="'settlements.' + index + '.settlement_uid'"
                  :rules="{
                    required: true,
                    message: '请选择',
                    trigger: 'change',
                  }"
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    filterable
                    style="width: 288px"
                    v-model="item.settlement_uid"
                    placeholder="请选择"
                    class="settlement-uid-select"
                    @change="val => onSettlementUidChanged(val, index)"
                  >
                    <el-option
                      v-for="settlement in settlementList"
                      :label="`${settlement.settlement_uid}（${settlement.project_name}）`"
                      :value="settlement.settlement_uid"
                      :key="settlement.settlement_uid"
                      :disabled="settlementUidOptionDisabled(settlement.settlement_uid, index)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="body-item settlement-amount">
                <el-form-item label="">
                  <el-input
                    style="width: 148px"
                    placeholder=""
                    :disabled="true"
                    v-model.trim="item.settlement_amount"
                  />
                </el-form-item>
              </div>
              <div class="body-item paid-amount">
                <el-form-item label="">
                  <el-input disabled style="width: 148px" v-model.trim="item.paid_amount" />
                </el-form-item>
              </div>
              <div class="body-item pending_amount">
                <el-form-item label="">
                  <el-input
                    disabled
                    placeholder=""
                    style="width: 148px"
                    v-model.trim="item.pending_amount"
                  />
                </el-form-item>
              </div>
              <div class="body-item pay_amount">
                <el-form-item
                  label=""
                  :prop="'settlements.' + index + '.pay_amount'"
                  :rules="{
                    required: true,
                    validator: (rule, value, callback) =>
                      pay_amount_check(rule, value, callback, index),
                    trigger: 'change',
                  }"
                >
                  <el-input
                    placeholder="请输入支付金额"
                    style="width: 148px"
                    :value="item.pay_amount"
                    @input="val => payAmountChanged(val, index)"
                  />
                </el-form-item>
              </div>
              <div class="body-item upload-invoice" style="display: flex; justify-content: center">
                <div class="upload-box" style="align-items: center">
                  <tg-button type="link" @click="onInvoiceUpload(item)">
                    <tg-icon
                      class="ico-upload-btn"
                      name="ico-upload-lite"
                      :disabled="
                        paymentForm.fare_way === 1 &&
                        canIUse.uploadInvoiceBtn &&
                        (item.write_off_status === InoviceWriteOffStatusEnums.write_off_none ||
                          item.write_off_status === InoviceWriteOffStatusEnums.write_off_part)
                          ? false
                          : true
                      "
                      :style="
                        paymentForm.fare_way === 1 &&
                        canIUse.uploadInvoiceBtn &&
                        item.write_off_status === InoviceWriteOffStatusEnums.write_off_none &&
                        item.invoice_info_list.length === 0
                          ? 'color: #ec1e1e'
                          : ''
                      "
                    />
                  </tg-button>
                  <!-- <tg-upload
                    v-if="item.invoice_image === '' || item.invoice_image === undefined"
                    :action="
                      item.is_upload
                        ? '/api/approval/upload_approval_invoice?is_upload=true'
                        : '/api/approval/upload_approval_invoice'
                    "
                    :show-file-list="false"
                    :beforeUpload="beforeInvoiceUpload"
                    :success="
                      (response, file, fileList) => {
                        return successInvoiceList(response, file, fileList, index);
                      }
                    "
                  >
                    <tg-icon class="ico-upload-btn" name="ico-upload-lite" />
                  </tg-upload> -->
                  <!-- <div v-else>
                    <el-avatar
                      class="invoice-icon"
                      shape="square"

                      fit="fill"
                      :src="item.invoice_image + '?Authorization=' + Auth"
                    ></el-avatar>
                    <tg-icon
                      class="delete-icon"
                      name="ico-a-quseguanbiicon2x"
                      @click="handleDeleteInvoive(index)"
                    ></tg-icon>
                  </div> -->
                </div>
              </div>
              <div class="body-item settlement-delete">
                <tg-icon
                  :disabled="paymentForm.settlements.length <= 1 || index === 0"
                  class="ico-btn"
                  name="ico-btn-delete"
                  @click="onDeleteSettlement(index)"
                />
              </div>
            </div>
          </div>
          <div class="invoice-add-box">
            <tg-button
              icon="ico-btn-add"
              size="mini"
              @click="onAddSettlement"
              :disabled="paymentForm.settlements.length >= 50"
              >结算编号</tg-button
            >
          </div>
          <div
            v-if="paymentForm.fare_way === 1 && associateInvoices.length > 0"
            class="base-title mgt-24"
          >
            发票明细
          </div>
          <div
            v-if="paymentForm.fare_way === 1 && associateInvoices.length > 0"
            class="invoice-list-wrapper"
          >
            <div class="header-box">
              <div class="header-item invoice-settlement-uid">关联结算单号</div>
              <div class="header-item invoice-purchaser">购买方</div>
              <div class="header-item invoice-seller">销售方</div>
              <div class="header-item invoice-no">发票号码</div>
              <div class="header-item invoice-date">发票日期</div>
              <div class="header-item invoice-amount">发票金额 (元)</div>
              <div class="header-item invoice-write-off-amount">发票核销金额 (元)</div>
              <div class="header-item tax-rate">税率</div>
              <div class="header-item tax">税额 (元)</div>
              <div class="header-item no-tax">不含税金额 (元)</div>
              <div class="header-item invoice-type">发票类型</div>
            </div>
            <div v-for="(item, index) in associateInvoices" :key="index" class="body-box">
              <div class="body-item invoice-settlement-uid">
                {{ item.settlement_uid }}
              </div>
              <div class="body-item invoice-purchaser line-clamp-1">
                <el-popover :open-delay="300" trigger="hover" :content="item.buyer_name">
                  <div slot="reference" class="line-clamp-1">
                    {{ item.buyer_name }}
                  </div>
                </el-popover>
              </div>
              <div class="body-item invoice-seller">
                <el-popover :open-delay="300" trigger="hover" :content="item.seller_name">
                  <div slot="reference" class="line-clamp-1">
                    {{ item.seller_name }}
                  </div>
                </el-popover>
              </div>
              <div class="body-item invoice-no">
                {{ item.invoice_number }}
              </div>
              <div class="body-item invoice-date">
                {{ invoice_date(item.invoice_date) }}
              </div>
              <div class="body-item invoice-amount">
                {{ item.total_amount }}
              </div>
              <div class="body-item invoice-write-off-amount">
                {{ item.write_amount_by_this_settlement }}
              </div>
              <div class="body-item tax-rate">
                {{ item.tax_rate }}
              </div>
              <div class="body-item tax">
                {{ item.tax_amount }}
              </div>
              <div class="body-item no-tax">
                {{ item.tax_excluded_amount }}
              </div>
              <div class="body-item invoice-type">
                {{ item.invoice_type === 1 ? '销售发票' : '采购发票' }}
              </div>
            </div>
          </div>
          <el-form-item
            label="承担部门："
            prop="project_feishu_department_id"
            :rules="{ required: true, message: '请选择部门', trigger: ['change'] }"
            key="project_feishu_department_id"
            :class="
              paymentForm.fare_way !== 1 || associateInvoices.length === 0 ? 'mgt-18' : 'mgt-6'
            "
          >
            <el-popover
              placement="bottom-start"
              trigger="click"
              width="370"
              popper-class="payment-dialog-tree-popper-class  el-tree-popper-mini"
            >
              <div slot="reference" class="repain-select" style="display: block">
                <div v-if="paymentForm.project_feishu_department_name" class="depart-select-box">
                  <span>{{ paymentForm.project_feishu_department_name }}</span>
                  <i
                    @click.stop="
                      () => {
                        paymentForm.project_feishu_department_id = undefined;
                        paymentForm.project_feishu_department_name = undefined;
                        cb_department_tree.setCheckedKeys([]);
                      }
                    "
                    style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                    class="el-icon-circle-close"
                  ></i>
                </div>
                <div v-else class="depart-select-box" style="color: #888">
                  <span>请选择承担部门</span>
                  <i
                    style="
                      margin-top: 8px;
                      color: var(--disabled-color);
                      font-size: var(--small-font-size);
                    "
                    class="el-icon-arrow-down"
                  ></i>
                </div>
              </div>
              <div class="department-tree">
                <el-tree
                  ref="cb_department_tree"
                  :props="treeProps"
                  :check-strictly="true"
                  node-key="id"
                  :data="feishuDepartmentList"
                  show-checkbox
                  check-on-click-node
                  :default-checked-keys="default_checked_department_ids"
                  :default-expanded-keys="default_checked_department_ids"
                  @check="handleCheckChange"
                >
                </el-tree>
              </div>
            </el-popover>
          </el-form-item>
          <el-form-item label="收款方式：" prop="receive_way" key="receive_way">
            <el-radio-group
              v-model="paymentForm.receive_way"
              style="
                width: 800px;
                display: inline-grid;
                grid-template-columns: repeat(4, 100px);
                column-gap: 0;
              "
            >
              <el-radio :label="3">对公账户</el-radio>
              <el-radio :label="4">对公支付宝</el-radio>
              <el-radio :label="2">V任务</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="paymentForm.receive_way === 3"
            label="银行账号："
            prop="bank_account"
            key="bank_account"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.bank_account"
              style="width: 220px"
              placeholder="请选择银行账号"
              @change="chooseBankAccount"
            >
              <el-option
                v-for="(item, key) in bankAccount"
                :key="key"
                :label="item.bank_card_number"
                :value="item.bank_card_number"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="paymentForm.receive_way === 3"
            label="开户行："
            prop="bank"
            key="bank"
          >
            <el-input
              disabled
              style="width: 220px"
              placeholder="请输入开户行"
              v-model.trim="paymentForm.bank"
            />
          </el-form-item>

          <el-form-item
            v-if="paymentForm.receive_way === 4"
            label="收款人："
            prop="name"
            key="name"
          >
            <el-input
              disabled
              style="width: 220px"
              placeholder="请输入收款人"
              v-model.trim="paymentForm.name"
            />
          </el-form-item>

          <el-form-item
            v-if="paymentForm.receive_way === 4"
            label="支付宝账号："
            prop="alipay_account"
            key="alipay_account"
            :rules="{ required: true, message: '请至供应商管理功能完善信息', trigger: 'change' }"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.alipay_account"
              style="width: 220px"
              placeholder="请选择支付宝账号"
            >
              <el-option
                v-for="item in alipay"
                :key="item.alipay_account"
                :label="item.alipay_account"
                :value="item.alipay_account"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="付款事由："
            prop="pay_reason"
            key="pay_reason"
            class="textarea-form-item"
          >
            <el-input
              type="textarea"
              :rows="3"
              style="width: 590px; margin-top: 5px"
              placeholder="请输入付款事由"
              v-model.trim="paymentForm.pay_reason"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            v-if="paymentForm.is_back === 0"
            label="关联审批单："
            style="margin-top: 6px"
            key="borrowing_id"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="paymentForm.borrowing_id"
              style="width: 590px"
              clearable
              placeholder="请选择关联审批单"
            >
              <el-option
                v-for="(item, index) in borrowList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <div v-if="paymentForm.fare_way === 1" class="invoice-add-box">
            <tg-button
              :disabled="paymentForm.invoice_list.length >= 10"
              icon="ico-btn-add"
              size="mini"
              @click="handleInvoiceAddDisabled"
              >新增发票</tg-button
            >
            <tg-button
              :disabled="paymentForm.invoice_list.length >= 10"
              icon="ico-btn-add"
              @click="handleInvoiceAdd"
              size="mini"
              >手动输入</tg-button
            >
          </div> -->
          <div class="base-title" style="margin-top: 24px">其他信息</div>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="2"
              style="width: 590px; margin-top: 5px"
              placeholder="请输入备注"
              v-model.trim="paymentForm.remark"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="附件：" style="margin-top: 4px">
            <div class="upload-box">
              <tg-upload
                :disabled="paymentForm.fileList.length >= 5"
                action="/api/approval/upload_approval_attachment"
                :show-file-list="false"
                :beforeUpload="beforeUpload"
                :success="successHandle"
              >
                <tg-button :disabled="paymentForm.fileList.length >= 5" icon="ico-upload-lite"
                  >上传附件</tg-button
                >
              </tg-upload>
              <div style="display: flex; flex-direction: column">
                <!-- <div class="file-tips" style="display: flex; margin-top: -6px">
                  <tg-icon
                    name="ico-icon_tongyong_jinggao_xianxing"
                    style="color: var(--warning-color); font-size: 20px; margin-top: 2px"
                  ></tg-icon>
                  <span style="color: var(--text-third-color); margin-left: 2px">
                    若结算单已关联合同，合同文本将作为附件自动提交</span
                  >
                </div> -->
                <span class="file-tips" style="margin-top: 0">
                  支持扩展名：.xlsx .xls .docx .doc .pdf .jpg
                  .png；最多上传5个文件（单个文件大小不超过30M）
                </span>
              </div>
            </div>

            <div class="file-list-box">
              <upload-file-list v-model="paymentForm.fileList" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button type="default" @click="emitClose">取消</tg-button>
        <tg-button type="primary" @click="handleDialogSubmit">保存</tg-button>
      </template>
    </el-dialog>
    <invoice-upload ref="InvoiceUploadRef" @success="onInvoiceUploadSuccess"></invoice-upload>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>
<script src="./form.ts"></script>
<style lang="less" scoped>
@import './form.less';
.depart-select-box {
  border: 1px solid rgba(164, 178, 194, 0.5);
  padding: 0 10px;
  line-height: 27px;
  height: 28px;
  display: flex;
  font-size: 12px;
  color: var(--text-color);
  justify-content: space-between;
  width: 220px;
  border-radius: 2px;
  flex: 1;
  &:hover {
    /deep/ .el-icon-circle-close {
      color: #c0c4cc !important;
    }
    border-color: #5c82ff;
  }
}
</style>
<style lang="less">
.payment-dialog-tree-popper-class {
  max-height: 360px;
  overflow: auto;
}
</style>
