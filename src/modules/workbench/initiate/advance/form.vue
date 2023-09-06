<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new advance-dialog"
      width="896px"
      @close="emitClose"
    >
      <template #title> <span>垫款申请</span> </template>
      <div class="form-wrapper">
        <el-form
          size="mini"
          :rules="advanceFormRules"
          :model="advanceForm"
          inline
          label-width="92px"
          ref="advanceFormRef"
        >
          <el-form-item label="部门：" prop="department">
            <el-input
              disabled
              style="width: 180px"
              placeholder="请输入部门"
              v-model.trim="advanceForm.department"
            />
          </el-form-item>
          <el-form-item label="需垫款客户：" prop="customer_id">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="advanceForm.customer_id"
              style="width: 180px"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择"
              :remote-method="getAllCustomerName"
              @change="onCustomerIdChange"
            >
              <el-option
                v-for="(item, index) in allCustomerName"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目：" prop="project_id">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="advanceForm.project_id"
              style="width: 180px"
              clearable
              placeholder="请选择项目"
              @change="onProjectIdChange"
            >
              <el-option
                v-for="(item, index) in allProjectName"
                :key="index"
                :label="item.name"
                :value="item.project_id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="advanceForm.business_type !== 5" label="品牌：" prop="brand_name">
            <el-input
              disabled
              style="width: 180px"
              placeholder="请输入品牌"
              v-model.trim="advanceForm.brand_name"
            />
          </el-form-item>
          <el-form-item label="垫款金额：" prop="borrowing_amount">
            <el-input
              style="width: 180px"
              placeholder="请输入垫款金额"
              v-model.trim="advanceForm.borrowing_amount"
              @input="inputAmount($event, 'borrowing_amount')"
            />
          </el-form-item>
          <el-form-item label="回款销售额：" prop="pay_back_amount">
            <el-input
              style="width: 180px"
              placeholder="请输入回款销售额"
              v-model.trim="advanceForm.pay_back_amount"
              @input="inputAmount($event, 'pay_back_amount')"
            />
          </el-form-item>
          <el-form-item label="供应商：" prop="supplier_id">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="advanceForm.supplier_id"
              style="width: 180px"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择"
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
          <el-form-item label="银行账号：" prop="bank_account">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="advanceForm.bank_account"
              style="width: 180px"
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
          <el-form-item label="开户行：" prop="bank">
            <el-input
              disabled
              style="width: 180px"
              placeholder="请输入开户行"
              v-model.trim="advanceForm.bank"
            />
          </el-form-item>
          <div>
            <el-form-item label="客户经理：">
              <el-input
                disabled
                style="width: 180px"
                placeholder="客户经理"
                v-model.trim="advanceForm.customer_manager_name"
              />
            </el-form-item>
          </div>
          <el-form-item label="垫款事由：" prop="borrowing_reason">
            <el-input
              type="textarea"
              :rows="3"
              style="width: 476px; padding-bottom: 2px"
              placeholder="请输入垫款事由"
              v-model.trim="advanceForm.borrowing_reason"
              maxlength="90"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="3"
              style="width: 476px; padding-bottom: 6px"
              placeholder="请输入备注"
              v-model.trim="advanceForm.remark"
              maxlength="90"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="附件：">
            <div class="upload-box">
              <tg-upload
                :disabled="advanceForm.attachment.length >= 5"
                action="/api/approval/upload_approval_attachment"
                :show-file-list="false"
                :beforeUpload="beforeUpload"
                :success="successHandle"
              >
                <tg-button :disabled="advanceForm.attachment.length >= 5" icon="ico-upload-lite"
                  >上传附件</tg-button
                >
              </tg-upload>
              <span class="file-tips">
                支持扩展名：.docx .doc .pdf .jpg .png；最多上传5个文件（单个文件大小不超过30M）
              </span>
            </div>
            <div class="file-list-box">
              <upload-file-list v-model="advanceForm.attachment" :column="2" />
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
