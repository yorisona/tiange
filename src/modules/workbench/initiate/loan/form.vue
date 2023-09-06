<template>
  <div class="tg-dialog-vcenter">
    <el-dialog
      :close-on-press-escape="false"
      :visible="visible"
      class="customer-dialog loan-dialog el-dialog-center-rewrite"
      :isAppendToBody="true"
      :close-on-click-modal="false"
      width="800px"
      :isfooter="true"
      @close="emitClose"
    >
      <template #title><span>用款申请单</span></template>
      <div class="wrap" ref="rootDomRef">
        <el-form :rules="loanFormRules" :model="loanForm" ref="loanFormRef" label-width="80px">
          <div class="block-title">用款基础信息</div>
          <el-form-item label="用款类型：" prop="level_two_types" required>
            <el-radio v-model="loanForm.level_two_types" :label="loanForm.level_two_types"
              >成本安排
            </el-radio>
          </el-form-item>
          <el-form-item label="店铺名称：" prop="collecting_shop_name">
            <el-input
              :maxlength="20"
              v-model.trim="loanForm.collecting_shop_name"
              placeholder="请输入店铺名称"
              ref="autoFocuseRef"
            />
          </el-form-item>
          <el-form-item label="用款总额：" prop="transfer_amount">
            <!-- 限制只能输入数字及小数点2位 -->
            <el-input
              v-model="loanForm.transfer_amount"
              @input="inputLoanAmount"
              placeholder="请输入用款总额"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="用款日期：" prop="transfer_date">
            <el-date-picker
              :clearable="false"
              size="small"
              placeholder="请选择收款时间"
              style="width: 100%"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              v-model="loanForm.transfer_date"
            />
          </el-form-item>
          <el-form-item label="收款方式：" prop="level_three_types" required class="mgb0">
            <el-radio-group v-model="loanForm.level_three_types" style="display: inline-flex">
              <el-radio v-for="radio in paymentRadioOptions" :label="radio.value" :key="radio.value"
                >{{ radio.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="level-three-types-block level-three-background">
            <template v-if="loanForm.level_three_types === 3">
              <div style="display: flex">
                <el-form-item label="银行卡号：" prop="bank_card_number" label-width="100px">
                  <el-input
                    :maxlength="30"
                    placeholder="请输入银行卡号"
                    v-model="loanForm.bank_card_number"
                    @input="input_bank_card_number"
                  />
                </el-form-item>
                <el-form-item label="公司名称：" label-width="110px" prop="collecting_company">
                  <el-input
                    :maxlength="20"
                    placeholder="请输入公司名称"
                    v-model.trim="loanForm.collecting_company"
                  />
                </el-form-item>
              </div>
              <div style="display: flex">
                <el-form-item
                  label="开户行："
                  prop="bank_of_deposit"
                  class="bank-deposit"
                  label-width="100px"
                >
                  <el-input
                    :maxlength="40"
                    placeholder="请输入开户行"
                    v-model.trim="loanForm.bank_of_deposit"
                  />
                </el-form-item>
              </div>
            </template>
            <template v-if="loanForm.level_three_types === 4">
              <el-form-item label="收款人：" prop="collecting_person" label-width="100px">
                <el-input
                  :maxlength="20"
                  placeholder="请输入收款人姓名"
                  v-model.trim="loanForm.collecting_person"
                />
              </el-form-item>
              <el-form-item label="支付宝账号：" prop="alipay_account" label-width="100px">
                <el-input
                  :maxlength="50"
                  placeholder="请输入支付宝账号"
                  v-model.trim="loanForm.alipay_account"
                />
              </el-form-item>
            </template>
          </div>
          <el-form-item label="付款事由：" prop="pay_reason" required>
            <el-input
              type="textarea"
              v-model.trim="loanForm.pay_reason"
              placeholder="请输入付款事由"
              :maxlength="100"
              show-word-limit
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :maxlength="100"
              v-model.trim="loanForm.remark"
              show-word-limit
              placeholder="请输入备注"
              :rows="3"
            />
          </el-form-item>
          <div class="block-title">用款明细</div>
          <el-form-item label="业务类型：" prop="level_three_types" required class="mgb0">
            <el-radio-group
              v-model="loanForm.business_type"
              @change="businessTypeChange"
              style="display: inline-flex"
            >
              <el-radio
                v-for="radio in businessTypeRadioOptions"
                :label="radio.value"
                :key="radio.value"
                >{{ radio.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="loanForm.business_type !== 1">
            <el-form-item label="成本类型：" prop="level_three_types" required>
              <el-radio-group v-model="loanForm.cost_type" style="display: inline-flex">
                <el-radio
                  v-for="radio in costTypeRadioOptions"
                  :label="radio.value"
                  :key="radio.value"
                  >{{ radio.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div
              class="level-three-types-block"
              v-if="
                loanForm.cost_type === 2 || loanForm.cost_type === 3 || loanForm.cost_type === 5
              "
            >
              <div v-for="(item, key) in loanForm.cost" :key="key" class="cost-line">
                <el-form-item
                  label="所属项目："
                  :prop="`cost.${key}.project_id`"
                  required
                  label-width="96px"
                  :rules="loanFormRules.cost_project"
                >
                  <el-select
                    v-model="item.project_id"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="请输入项目编号"
                    :remote-method="getCustmerByContractNo"
                    size="medium"
                    @change="onProjectChange"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in project_options"
                      :key="item.id"
                      :label="item.project_uid"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="费用金额："
                  :prop="`cost.${key}.price`"
                  required
                  label-width="96px"
                  :rules="loanFormRules.cost_price"
                >
                  <el-input
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    v-model="item.price"
                    @input="inputLoanAmountCost(key, $event)"
                    placeholder="请输入项目分摊金额"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <tg-icon
                  name="ico-cross-lite"
                  @click="deleteCost(key)"
                  class="close"
                  hoverName="ico-cross-red"
                />
              </div>
              <div v-if="false" class="operation-addcost" @click="addCost">+添加项目</div>
            </div>
          </template>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handledialogCancel">取消</tg-button>
        <tg-button type="primary" @click="handledialogSubmit">提交</tg-button>
      </template>
    </el-dialog>

    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./form.tsx"></script>

<style lang="less" scoped>
.mgb0 {
  margin-bottom: 0;
}
.wrap {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 0 !important;
  .cost-line {
    position: relative;
    display: flex;
    justify-content: space-between;
    .level-three-background();
    margin-bottom: 10px;
    padding-top: 10px;
    padding-right: 16px;
    &:first-child {
      .close {
        display: none;
      }
    }
    .close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
      color: #cccccc;
    }
  }
  .block-title {
    color: #3d3d3d;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .level-three-types-block {
    margin-left: 80px;
    border-radius: 4px;
    padding: 6px 10px 0 0;
    margin-bottom: 18px;
  }
  .level-three-background {
    background: #f6f6f6;
  }
  .operation-addcost {
    border-radius: 4px;
    height: 36px;
    border: 1px dashed #dcdfe6;
    color: var(--theme-color);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>

<style lang="less">
@import './form.less';
</style>
