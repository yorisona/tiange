<template>
  <div class="tg-live-project-detail-tab-calendar">
    <el-form
      @submit.native.prevent
      :model="DataForm"
      size="mini"
      label-width="84px"
      style="padding: 33px"
      :rules="FormRules"
      ref="formRef"
    >
      <el-form-item
        class="mgt-18"
        label="库存阈值"
        style="width: 348px; line-height: 32px; height: 32px"
        prop="max_increase_stock"
      >
        <el-input
          style="width: 248px"
          @input="SaleAmountInput"
          maxlength="12"
          placeholder="请输入库存阈值"
          v-model="DataForm.max_increase_stock"
        />
      </el-form-item>
      <el-form-item
        label="消息接收人"
        prop="receiver_list"
        style="width: 348px; line-height: 32px"
        class="receiver_list"
      >
        <function-select
          multiple
          v-model="DataForm.receiver_list"
          :defaultValue="DataForm.default_receiver_list"
          style="width: 248px"
          placeholder="请选择消息接收人"
          :modeType="0"
        />
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
        padding: 15px 53px 15px 43px;
        line-height: 22px;
        font-weight: 400;
        font-size: 12px;
      "
    >
      <div style="margin-bottom: 8px">库存监控设置说明</div>
      <div style="color: var(--text-third-color)">
        监控时间：每天6:00、12:00、18:00三次获取商品库存。
      </div>
      <div style="color: var(--text-third-color)">
        库存阈值：监控库存增加量，不设置的话代表阈值为0。
      </div>
      <div style="color: var(--text-third-color)">
        消息接收人：单个商品库存两次监控库存增加数量超过阈值会推送消息到指定人员飞书。
      </div>
      <div style="color: var(--text-third-color)">是否开启：开启或者关闭库存监控功能。</div>
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
/deep/ .receiver_list {
  .el-input--suffix .el-input__inner {
    padding-right: 0 !important;
  }
  .el-select__tags {
    max-width: 100% !important;
  }
}
/deep/ .el-radio-group {
  column-gap: 0;
  .el-radio {
    width: 60px;
  }
}
</style>
