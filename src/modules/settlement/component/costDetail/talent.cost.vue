<!--
 * @Brief: 达人成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 17:45:28
-->

<template>
  <div class="tg-cost-settlement-component-settlement-detail-talent-cost">
    <div class="talent-cost-content">
      <div
        class="customer-list-row"
        v-for="(company, companyIdx) in dataFromCompanyList"
        :key="companyIdx"
      >
        <el-select
          popper-class="el-select-popper-mini"
          :value="company.kol_name"
          placeholder="请选择达人"
          :remote-method="queryKolList"
          :loading="kolLoading"
          filterable
          remote
          reserve-keyword
          :ref="companyIdx === dataFromCompanyList.length - 1 ? 'companySelectRef' : undefined"
          @change="val => onKolChanged(val, companyIdx)"
        >
          <el-option
            v-for="opt in kol_list"
            :value="opt.kol_name"
            :label="opt.kol_name"
            :key="opt.kol_id"
            :disabled="isKolOptionDisabled(opt.kol_id, company.company_id)"
          ></el-option>
        </el-select>
        <el-select
          popper-class="el-select-popper-mini"
          :value="company.company_name"
          placeholder="请输入并选择供应商"
          :remote-method="getCompanyList"
          :loading="companyLoading"
          filterable
          remote
          reserve-keyword
          :disabled="!company.kol_id"
          @change="val => onCompanyChanged(val, companyIdx)"
        >
          <el-option
            v-for="opt in company_list"
            :value="opt.company_name"
            :label="opt.company_name"
            :key="opt.company_id"
            :disabled="isCompanyOptionDisabled(opt.company_id, company.kol_id)"
          ></el-option>
        </el-select>
        <el-input
          placeholder="填写成本"
          :value="company.income_amount"
          @input="val => onCostAmountChanged(val, companyIdx)"
        >
          <template slot="append">元</template>
        </el-input>
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
      <tg-button icon="ico-btn-add" type="default" @click="onAdd" size="mini">添加达人</tg-button>
    </div>
  </div>
</template>

<script src="./talent.cost.ts"></script>

<style lang="less">
.tg-cost-settlement-component-settlement-detail-talent-cost {
  .talent-cost-content {
    // overflow-y: overlay;
    padding: 5px 12px 0;
    // max-height: 142px;

    .customer-list-row {
      display: grid;
      column-gap: 8px;
      margin: 12px 0 0 0;
      grid-template-columns: 177px 235px 199px 18px;
      .del-btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        .del-btn {
          width: 18px;
          height: 18px;
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
<style lang="less" scoped>
/deep/.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
  height: 27px;
  line-height: 26px;
  font-size: 12px;
}
/deep/.el-input,
.el-select {
  .el-input__inner {
    height: 28px !important;
    line-height: 27px;
    font-size: 12px;
  }
}
</style>
