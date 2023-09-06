<template>
  <div class="refund-dialog-wrapper">
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new refund-dialog"
      width="930px"
      @close="emitClose"
    >
      <template #title> <span>退款申请</span> </template>
      <div class="form-wrapper">
        <el-form
          size="mini"
          :rules="refundFormRules"
          :model="refundForm"
          inline
          label-width="106px"
          ref="refundFormRef"
        >
          <el-form-item label="部门：" prop="department">
            <el-input
              disabled
              style="width: 180px"
              placeholder="请输入部门"
              v-model.trim="refundForm.department"
            />
          </el-form-item>
          <el-form-item label="项目：" prop="project_name">
            <el-input
              disabled
              style="width: 180px"
              placeholder="请输入项目"
              v-model.trim="refundForm.project_name"
            />
          </el-form-item>
          <el-form-item :label="isFromPrePay ? '预收编号：' : '收款编号：'" prop="achievement_uid">
            <el-input
              disabled
              style="width: 180px"
              :placeholder="isFromPrePay ? '请输入预收编号' : '请输入收款编号'"
              v-model.trim="refundForm.achievement_uid"
            />
          </el-form-item>
          <el-form-item label="退款金额：" prop="refund_amount" style="width: 800px">
            <el-input
              style="width: 180px"
              placeholder="请输入退款金额"
              v-model.trim="refundForm.refund_amount"
              @input="inputAmount($event, 'refund_amount')"
            />
          </el-form-item>
          <el-form-item label="退款事由：" prop="refund_reason">
            <el-input
              type="textarea"
              :rows="3"
              style="width: 476px; padding-bottom: 6px"
              placeholder="请输入退款事由"
              v-model.trim="refundForm.refund_reason"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <div>
            <el-form-item label="公司名称：" prop="company_id" key="company_id">
              <el-select
                class="company-select"
                popper-class="el-select-popper-mini"
                v-model.trim="refundForm.company_id"
                style="width: 180px"
                placeholder="请输入并选择公司名称"
                filterable
                remote
                reserve-keyword
                @change="handleCompanySelect"
                :remote-method="getAllCompanyName"
              >
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.company_name"
                  :value="item.id"
                >
                  <span>{{ item.company_name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item :label="isRealPay ? '退款方式：' : '收款方式：'" prop="refund_way">
            <el-radio-group
              v-model="refundForm.refund_way"
              style="
                width: 800px;
                display: inline-grid;
                grid-template-columns: repeat(4, 80px);
                column-gap: 12px;
              "
              @change="onCollectionWayChange"
            >
              <el-radio :label="3">对公账户</el-radio>
              <!-- <el-radio :label="4">银行卡</el-radio> -->
              <el-radio :label="2">支付宝</el-radio>
              <!-- <el-radio :label="1">V任务</el-radio> -->
            </el-radio-group>
          </el-form-item>

          <template v-if="refundForm.refund_way === 3">
            <el-form-item label="银行账号：" prop="bank_account" key="bank_account">
              <el-select
                v-model="refundForm.bank_account"
                @change="onBankAccountChange"
                :placeholder="refundForm.company_id ? '请选择银行账号' : '请先选择公司名称'"
              >
                <el-option
                  v-for="account in accountList.filter(el => el.account_type === 1)"
                  :label="account.account_code"
                  :value="account.account_code"
                  :key="account.account_code"
                ></el-option>
              </el-select>
              <!-- <el-input
                style="width: 180px"
                placeholder="请输入银行账号"
                onkeyup="value=value.replace(/[^\d]/g, '')"
                @blur="blurFun('bank_account', $event)"
                v-model.trim="refundForm.bank_account"
              /> -->
            </el-form-item>
            <el-form-item label="开户支行：" prop="bank" key="bank">
              <el-input
                disabled
                style="width: 180px"
                placeholder="请输入开户支行"
                :value="refundForm.bank"
              />
            </el-form-item>
          </template>
          <!-- <template v-if="refundForm.refund_way === 4">
            <el-form-item label="卡号：" prop="bank_card_number" key="bank_card_number">
              <el-input
                style="width: 180px"
                placeholder="请输入卡号"
                onkeyup="value=value.replace(/[^\d]/g, '')"
                @blur="blurFun('bank_card_number', $event)"
                v-model.trim="refundForm.bank_card_number"
              />
            </el-form-item>
            <el-form-item label="户名：" prop="bank_card_person" key="bank_card_person">
              <el-input
                style="width: 180px"
                placeholder="请输入户名"
                v-model.trim="refundForm.bank_card_person"
              />
            </el-form-item>
            <el-form-item label="开户行：" prop="bank_card_name" key="bank_card_name">
              <el-input
                style="width: 180px"
                placeholder="请输入开户行"
                v-model.trim="refundForm.bank_card_name"
              />
            </el-form-item>
          </template> -->
          <template v-if="refundForm.refund_way === 2">
            <!-- <el-form-item :label="isRealPay ? '付款人：' : '收款人：'" prop="name" key="name">
              <el-input
                style="width: 180px"
                :placeholder="isRealPay ? '请输入付款人姓名' : '请输入收款人姓名'"
                v-model.trim="refundForm.name"
              />
            </el-form-item> -->
            <el-form-item label="支付宝账号：" prop="account" key="account">
              <el-select
                v-model="refundForm.account"
                :placeholder="refundForm.company_id ? '请选择支付宝账号' : '请先选择公司名称'"
              >
                <el-option
                  v-for="account in accountList.filter(el => el.account_type === 2)"
                  :label="account.account_code"
                  :value="account.account_code"
                  :key="account.account_code"
                ></el-option>
              </el-select>
              <!-- <el-input
                style="width: 180px"
                placeholder="请输入支付宝账号"
                v-model.trim="refundForm.account"
              /> -->
            </el-form-item>
          </template>
          <!-- <template v-if="refundForm.refund_way === 1">
            <el-form-item label="旺旺名：" prop="wangwang_name" key="wangwang_name">
              <el-input
                style="width: 180px"
                placeholder="请输入旺旺名"
                v-model.trim="refundForm.wangwang_name"
              />
            </el-form-item>
            <el-form-item label="V任务ID：" prop="v_task_id" key="v_task_id">
              <el-input
                style="width: 180px"
                placeholder="请输入V任务ID"
                v-model.trim="refundForm.v_task_id"
              />
            </el-form-item>
          </template> -->
          <div>
            <el-form-item label="客户合同：">
              <el-select
                clearable
                reserve-keyword
                style="width: 476px"
                v-model="refundForm.contract_id"
                :placeholder="this.contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'"
                :remote-method="getContract"
                filterable
                remote
              >
                <el-option
                  v-for="item in contract_id_list"
                  :key="item.contract_id"
                  :label="
                    item.company_name +
                    '  (' +
                    item.sign_type_name +
                    ')  ' +
                    item.coop_start_date +
                    '-' +
                    item.coop_end_date
                  "
                  :value="item.contract_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="2"
              style="width: 476px; padding-bottom: 6px"
              placeholder="请输入备注"
              v-model.trim="refundForm.remark"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="附件：">
            <div class="upload-box">
              <tg-upload
                :disabled="refundForm.attachment.length >= 5"
                action="/api/approval/upload_approval_attachment"
                :show-file-list="false"
                :beforeUpload="beforeUpload"
                :success="successHandle"
              >
                <tg-button :disabled="refundForm.attachment.length >= 5" icon="ico-upload-lite"
                  >上传附件</tg-button
                >
              </tg-upload>
              <span class="file-tips">
                支持扩展名：.docx .doc .pdf .jpg .png；最多上传5个文件（单个文件大小不超过30M）
              </span>
            </div>
            <div class="file-list-box">
              <upload-file-list v-model="refundForm.attachment" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button type="default" @click="handleDialogCancel">取消</tg-button>
        <tg-button type="primary" @click="handleDialogSubmit()">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>
<script src="./form.ts"></script>
<style lang="less" scoped>
@import './form.less';
</style>
