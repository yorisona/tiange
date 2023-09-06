<template>
  <div class="data-center-collect flex-auto tg-card">
    <head-lines class="title-label" title="系统登录情况统计" />
    <data-center-list
      :list="systemLoginDataList"
      :loading="systemLoginTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="客户&供应商信息管理情况统计" />
    <data-center-list
      :list="customerSupplierManageDataList"
      :loading="customerSupplierManageTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="项目执行情况统计" />
    <data-center-list
      :list="projectDataList"
      :loading="projectTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="项目结算单统计" />
    <data-center-list
      :list="settlementDataList"
      :loading="settlementTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="开票审批情况统计" />
    <data-center-list
      :list="invoiceApplyDataList"
      :loading="invoiceApplyTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="付款审批情况统计" />
    <data-center-list
      :list="customerPayApplyDataList"
      :loading="customerPayApplyTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="合同审批情况统计" />
    <data-center-list
      :list="contractApplyDataList"
      :loading="contractApplyTableLoading"
      class="center-list-min-height"
    ></data-center-list>
    <head-lines class="title-label" title="自营店播执行情况统计" />
    <data-center-list
      :list="shopLiveDataList"
      :loading="shopLiveTableLoading"
      class="center-list-min-height"
    ></data-center-list>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
.data-center-collect {
  .title-label {
    margin: 24px 0px 12px 15px;
  }
  .collect-select {
    height: 68px;
    display: flex;
    padding: 0 18px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: 0 0 68px;
  }
  .related-project-title {
    height: 52px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      height: 13px;
      line-height: 13px;
      padding-left: 6px;
      color: var(--text-color);
      font-weight: 600;
      border-left: 2px solid var(--theme-color);
      margin-right: 18px;
    }
  }
}
</style>
