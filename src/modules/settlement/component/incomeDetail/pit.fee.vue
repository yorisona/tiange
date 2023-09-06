<!--
 * @Brief: 坑位费
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:31:30
-->
<template>
  <div class="tg-income-settlement-component-settlement-detail-pit-fee">
    <div class="pit-fee-content">
      <div
        class="customer-list-row"
        v-for="(company, companyIdx) in company_list"
        :key="companyIdx"
      >
        <div v-if="feeType === 1" class="row-label line-clamp-1">{{ company.company_name }}</div>
        <el-select
          v-else
          :value="company.company_name"
          size="small"
          style="margin-right: 8px; width: 233px"
          placeholder="请输入并选择供应商"
          :remote-method="getCompanyList"
          :loading="companyLoading"
          filterable
          remote
          reserve-keyword
          :ref="companyIdx === company_list.length - 1 ? 'companySelectRef' : undefined"
          @change="val => onCompanyChanged(val, companyIdx)"
        >
          <el-option
            v-for="opt in company_options"
            :value="opt.company_name"
            :label="opt.company_name"
            :key="opt.company_id"
            :disabled="isOptionDisabled(opt.company_id)"
          ></el-option>
        </el-select>
        <el-input
          :placeholder="feeType === 2 ? '填写成本' : '填写收入'"
          :value="company.income_amount"
          size="small"
          style="width: 240px"
          @input="val => onPitFeeChanged(val, companyIdx)"
        >
          <template slot="append">元</template>
        </el-input>
        <div v-if="feeType === 2" class="del-btn-container">
          <tg-icon
            name="ico-btn-delete"
            class="del-btn"
            :disabled="company_list.length === 1 && companyIdx === 0"
            @click="delCompany(companyIdx)"
          ></tg-icon>
        </div>
      </div>
    </div>
    <div :class="feeType === 1 ? 'bottom-content' : 'cost-bottom-content'">
      <tg-button
        style="margin-right: 16px"
        v-if="feeType === 2"
        icon="ico-btn-add"
        type="default"
        @click="onAdd"
        size="mini"
        >添加供应商</tg-button
      >
      <tg-button type="link" @click="onDownloadDetail" :disabled="!company_list.length"
        >下载商品明细</tg-button
      >
      <!-- <tg-button type="link" :href="pit_url" download :disabled="!company_list.length"
        >下载商品明细</tg-button
      > -->
    </div>
  </div>
</template>

<script src="./pit.fee.ts"></script>

<style lang="less">
.tg-income-settlement-component-settlement-detail-pit-fee {
  .pit-fee-content {
    overflow-y: overlay;
    padding: 10px 12px 0;
    /*max-height: 158px;*/
    .customer-list-row {
      display: flex;
      padding: 6px 0 6px;
      align-items: center;
      .row-label {
        color: var(--text-second-color);
        width: 168px;
        text-align: right;
        margin-right: 12px;
      }
      .del-btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
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
  .bottom-content,
  .cost-bottom-content {
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
