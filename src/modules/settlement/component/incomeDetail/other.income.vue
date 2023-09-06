<!--
 * @Brief: 商广喝其他收入
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:32:07
-->
<template>
  <div class="tg-income-settlement-component-settlement-detail-other-income">
    <div class="other-income-content">
      <div
        class="customer-list-row"
        :class="
          dataForm.type === 6 || feeType === 2 ? (feeType === 2 ? 'cost-col-4' : 'col-4') : 'col-3'
        "
        v-for="(company, companyIdx) in dataFromCompanyList"
        :key="companyIdx"
      >
        <el-select
          popper-class="el-select-popper-mini"
          :value="company.company_name"
          size="mini"
          :placeholder="feeType === 2 ? '请输入并选择供应商' : '请输入并选择客户'"
          :remote-method="getCompanyList"
          :loading="companyLoading"
          filterable
          remote
          reserve-keyword
          :ref="companyIdx === dataFromCompanyList.length - 1 ? 'companySelectRef' : undefined"
          @change="val => onCompanyChanged(val, companyIdx)"
        >
          <el-option
            v-for="opt in company_list"
            :value="opt.company_name"
            :label="opt.company_name"
            :key="opt.id"
            :disabled="isOptionDisabled(opt.id)"
          ></el-option>
        </el-select>
        <el-input
          :placeholder="feeType === 2 ? '填写成本' : '填写收入'"
          :value="company.income_amount"
          @input="val => onIncomeAmountChanged(val, companyIdx)"
          size="mini"
        >
          <template slot="append">元</template>
        </el-input>
        <el-input
          v-if="dataForm.type === 6 || feeType === 2"
          :placeholder="feeType === 2 ? '填写成本说明' : '填写收入说明'"
          v-model="company.remark"
          size="mini"
          :maxlength="50"
        ></el-input>
        <div class="del-btn-container">
          <tg-icon
            name="ico-btn-delete"
            class="del-btn"
            :disabled="dataFromCompanyList.length === 1 && companyIdx === 0"
            @click="delCompany(companyIdx)"
          ></tg-icon>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <tg-button icon="ico-btn-add" type="default" @click="onAdd" size="mini">{{
        feeType === 2 ? '添加供应商' : '添加客户'
      }}</tg-button>
    </div>
  </div>
</template>

<script src="./other.income.ts"></script>

<style lang="less">
.tg-income-settlement-component-settlement-detail-other-income {
  .other-income-content {
    // overflow-y: overlay;
    padding: 5px 12px 0;
    // max-height: 142px;

    .customer-list-row {
      display: grid;
      column-gap: 8px;
      margin: 12px 0 0 0;
      &.col-3 {
        grid-template-columns: 286px 234px 18px;
      }
      &.col-4 {
        grid-template-columns: 182px 158px 172px 18px;
      }
      &.cost-col-4 {
        grid-template-columns: 216px 192px 206px 18px;
      }
      .del-btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        .del-btn {
          width: 16px;
          height: 16px;
          color: var(--text-third-color);
          cursor: pointer;
          &[disabled] {
            color: rgba(var(--text-third-rgb-color), 0.4);
          }
        }
      }
    }
  }
  .bottom-content {
    height: 64px;
    display: flex;
    align-items: center;
    margin-left: 12px;
    padding-bottom: 6px;
    .tg-btn {
      height: 28px;
      line-height: 28px;
      background: white;
    }
  }
}
</style>
