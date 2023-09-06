<template>
  <div class="tg-live-project-detail-tab-calendar">
    <el-form
      @submit.native.prevent
      :model="DataForm"
      size="mini"
      label-width="74px"
      style="padding: 33px"
      :rules="FormRules"
    >
      <!-- <el-form-item
        label="结算时间"
        class="mgt-18"
        style="width: 348px; line-height: 32px; height: 32px"
        ><el-select
          v-model="DataForm.settlement_day"
          clearable
          placeholder="选择结算时间"
          style="width: 248px; line-height: 32px; height: 32px"
        >
          <el-option
            v-for="item in costOptions"
            :label="item + '号'"
            :value="item"
            :key="item"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item
        class="mgt-18"
        label="小时报价"
        style="width: 348px; line-height: 32px; height: 32px"
      >
        <el-input
          style="width: 248px"
          @input="PriceHourAmountInput"
          maxlength="12"
          placeholder="请输入"
          v-model="DataForm.price_per_hour"
          ><span slot="append">元/时</span></el-input
        >
      </el-form-item>
      <el-form-item
        class="mgt-18"
        label="服务费"
        style="width: 348px; line-height: 32px; height: 32px"
        prop="service_amount"
      >
        <el-input
          style="width: 248px"
          @input="SaleAmountInput"
          maxlength="12"
          placeholder="请输入"
          v-model="DataForm.service_amount"
          ><span slot="append">元</span></el-input
        >
      </el-form-item>
      <el-form-item
        label="佣金比例"
        prop="commission_rate"
        style="width: 348px; line-height: 32px; height: 32px"
      >
        <el-input
          style="width: 248px"
          placeholder="请输入"
          @input="CommissionRateInput"
          maxlength="6"
          v-model.trim="DataForm.commission_rate"
          ><span slot="append">%</span></el-input
        >
      </el-form-item>
      <el-form-item
        label="是否开启"
        prop="status"
        style="display: inline-block; width: 348px; line-height: 32px; height: 32px"
      >
        <el-radio-group v-model="DataForm.is_enable">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="filter-form-item-btn" style="margin-left: 12px">
        <tg-button style="padding: 0 30px !important" type="primary" @click="onSaveClick">
          保存
        </tg-button>
      </div>
    </el-form>

    <div
      style="
        margin-top: 0px;
        color: var(--text-second-color);
        padding: 15px 43px;
        line-height: 22px;
        font-weight: 400;
        font-size: 12px;
      "
    >
      <div style="margin-bottom: 8px">结算设置说明</div>
      <div style="color: var(--text-third-color)">结算时间：每月2号自动进行上个月的收入结算。</div>
      <div style="color: var(--text-third-color)">服务费：每月固定收取的固定直播服务费用。</div>
      <div style="color: var(--text-third-color)">
        佣金比例：计算佣金的基础比例，其它计算规则请在收入结算时手工调账。
      </div>
      <div style="color: var(--text-third-color)">是否开启：开启或关闭自动结算功能。</div>
    </div>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less" scoped>
/deep/.el-form .el-form-item__label {
  padding-right: 16px;
}
/deep/.el-form .el-form-item {
  margin-bottom: 24px;
  margin-top: 0px;
}
/deep/.el-radio__input + .el-radio__label {
  font-weight: 400;
  color: var(--text-color) !important;
}
/deep/.el-input-group__append {
  width: 50px !important;
  padding: 0px;
  text-align: center;
}
/deep/ .el-radio-group {
  column-gap: 0;
  .el-radio {
    width: 60px;
  }
}
</style>
