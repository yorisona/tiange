<!--
 * @Brief: 投放成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 17:45:28
-->
<template>
  <div class="tg-cost-settlement-component-settlement-detail-put-cost">
    <div
      v-if="isLiveTbPickNew === false"
      style="
        border: 1px solid rgba(255, 122, 54, 0.5);
        border-radius: 2px;
        background-color: rgba(255, 122, 54, 0.06);
        margin: 12px 12px 0;
        padding: 6px 12px;
        display: flex;
        align-items: center;
      "
    >
      <tg-icon style="width: 16px; height: 16px" name="ico-warn"></tg-icon>
      <span style="margin-left: 4px; color: rgb(255, 122, 54); font-size: 12px">{{
        isLiveDouyinNew
          ? '项目如果没有维护抖音直播帐号或者不是在煜丰进行的投放，将无法自动获取投放金额'
          : '达人如果没有维护抖音帐号或者不是在煜丰进行的投放，将无法自动获取投放金额'
      }}</span>
    </div>
    <div class="put-cost-content">
      <div
        class="customer-list-row"
        v-for="(company, companyIdx) in dataFromCompanyList"
        :key="companyIdx"
        :style="
          isLiveDouyinNew
            ? ' grid-template-columns: 216px 192px 199px '
            : ' grid-template-columns: 216px 163px 163px 88px;'
        "
      >
        <el-select
          popper-class="el-select-popper-mini"
          :value="company.company_name"
          placeholder="请输入并选择供应商"
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
            :key="opt.company_id"
            :disabled="isCompanyOptionDisabled(opt.company_id, company.kol_id)"
          ></el-option>
        </el-select>
        <el-select
          popper-class="el-select-popper-mini"
          v-if="!isLiveDouyinNew"
          :value="company.kol_name"
          placeholder="请输入并选择达人"
          :remote-method="queryKolList"
          :loading="kolLoading"
          filterable
          remote
          reserve-keyword
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
        <el-input
          v-loading="isYuFengCompany(company.company_name) && yufengloading"
          placeholder="填写成本"
          :value="company.income_amount"
          @input="val => onCostAmountChanged(val, companyIdx)"
          :disabled="isYuFengCompany(company.company_name) && isLiveTbPickNew === false"
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
          <tg-button
            type="link"
            v-if="isYuFengCompany(company.company_name) && isLiveTbPickNew === false"
            @click="onDownloadDetail(company)"
            style="margin-left: 6px; padding: 0 5px !important"
            :disabled="
              isLiveDouyinNew
                ? !company.income_amount
                : !(company.income_amount && company.kol_name)
            "
            >下载明细</tg-button
          >
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <tg-button icon="ico-btn-add" type="default" @click="() => onAdd()" size="mini"
        >添加投放</tg-button
      >
    </div>
  </div>
</template>

<script src="./put.cost.ts"></script>

<style lang="less">
.tg-cost-settlement-component-settlement-detail-put-cost {
  .put-cost-content {
    // overflow-y: overlay;
    padding: 5px 12px 0;
    // max-height: 142px;

    .customer-list-row {
      display: grid;
      column-gap: 8px;
      margin: 12px 0 0 0;
      grid-template-columns: 216px 192px 139px 18px;
      .del-btn-container {
        display: flex;
        justify-content: flex-start;
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
      .el-input__inner {
        color: var(--text-second-color);
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
  line-height: 26px;
  height: 27px;
  font-size: 12px;
}
/deep/.el-loading-spinner .circular {
  height: 32px !important;
  width: 32px !important;
  -webkit-animation: loading-rotate 2s linear infinite;
  animation: loading-rotate 2s linear infinite;
}
/deep/.el-input,
.el-select {
  .el-input__inner {
    height: 28px;
    line-height: 27px;
    font-size: 12px;
  }
}
</style>
