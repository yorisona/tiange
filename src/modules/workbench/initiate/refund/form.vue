<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :visible="visible"
      class="customer-dialog tg-dialog-vcenter-new refund-dialog"
      :isAppendToBody="true"
      width="800px"
      :isfooter="true"
      @close="emitClose"
    >
      <template #title> <span>退款申请单</span> </template>
      <div style="padding-left: 73px; padding-right: 73px">
        <el-form
          :rules="refundFormRules"
          :model="refundForm"
          label-width="90px"
          ref="refundFormRef"
        >
          <!-- [退款类型] -->
          <el-form-item label="退款类型：" prop="level_two_types">
            <el-radio v-model="refundForm.level_two_types" :label="1">业绩退款</el-radio>
          </el-form-item>
          <!-- [关联业绩] -->
          <el-form-item label="关联业绩：" prop="achievement_uid" class="form-item-achievement_uid">
            <el-select
              v-model="refundForm.achievement_uid"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索并选择收款编号"
              :remote-method="getAchievementUIds"
              clearable
              size="small"
              @change="selectAchievementUid"
              @clear="clearAchievementUIds"
              ref="autoFocuseRef"
            >
              <el-option
                v-for="item in list_uid"
                :key="item.achievement_uid"
                :label="item.achievement_uid"
                :value="item.achievement_uid"
              />
            </el-select>
            <div class="gatherAmountStr-bgc mgl-10">
              <span>该笔业绩收款金额：</span>
              <span class="gatherAmountStr">{{
                refundForm.gather_amount ? '￥' + refundForm.gather_amount : '--'
              }}</span>
            </div>
          </el-form-item>
          <!-- [退款金额] -->
          <el-form-item label="退款金额：" prop="refund_amount">
            <!-- 限制只能输入数字及小数点最多2位 -->
            <el-input
              size="small"
              @input="inputRefundAmount"
              v-model="refundForm.refund_amount"
              placeholder="请输入退款金额"
              style="width: 550px"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="退款方式：" prop="level_three_types">
            <el-radio
              v-model="refundForm.level_three_types"
              :label="opt.label"
              v-for="opt in level_three_types_options"
              :key="opt.label"
              @change="val => onLevelThreeTypesChange(val)"
              >{{ opt.name }}</el-radio
            >
          </el-form-item>
          <div class="level-three-types-block">
            <template v-if="refundForm.level_three_types === 1">
              <el-form-item label="V任务id：" prop="v_task_id">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="20"
                  placeholder="请输入V任务id"
                  v-model.trim="refundForm.v_task_id"
                  @input="inputVTaskId"
                />
              </el-form-item>
              <el-form-item label="旺旺名：" prop="wangwang_name">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="20"
                  placeholder="请输入旺旺名"
                  v-model.trim="refundForm.wangwang_name"
                />
              </el-form-item>
            </template>
            <template v-if="refundForm.level_three_types === 2">
              <el-form-item label="姓名：" prop="name">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="20"
                  placeholder="请输入姓名"
                  v-model.trim="refundForm.name"
                />
              </el-form-item>
              <el-form-item label="账号：" prop="account">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="50"
                  placeholder="请输入账号"
                  v-model.trim="refundForm.account"
                />
              </el-form-item>
            </template>
            <template v-if="refundForm.level_three_types === 3">
              <el-form-item label="银行卡号：" prop="bank_card_number">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="20"
                  placeholder="请输入银行卡号"
                  v-model.trim="refundForm.bank_card_number"
                  @input="input_bank_card_number"
                />
              </el-form-item>
              <el-form-item label="公司名称：" prop="company_name">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="20"
                  placeholder="请输入公司名称"
                  v-model.trim="refundForm.company_name"
                />
              </el-form-item>
              <el-form-item label="开户行：" prop="bank_of_deposit" class="bank-deposit">
                <el-input
                  style="width: 406px"
                  size="small"
                  :maxlength="40"
                  placeholder="请输入开户行"
                  v-model.trim="refundForm.bank_of_deposit"
                />
              </el-form-item>
            </template>
          </div>
          <!-- [退款理由] -->
          <el-form-item label="退款理由：" prop="refund_reason">
            <el-input
              type="textarea"
              :rows="2"
              :maxlength="100"
              v-model.trim="refundForm.refund_reason"
              placeholder="请输入退款理由"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="2"
              :maxlength="100"
              v-model.trim="refundForm.remark"
              placeholder="请输入备注"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button type="default" @click="handledialogCancel">取消</tg-button>
        <tg-button type="primary" @click="handledialogSubmit()">提交</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./form.ts"></script>

<style lang="less">
@import './form.less';
</style>
