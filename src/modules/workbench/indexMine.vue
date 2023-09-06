<template>
  <div class="tg-page-container tg-workbench-page">
    <component class="tg-workbench-tab-pane flex-auto" :is="'mine'" />
    <LoanFormModal
      :visible="loanFormVisible"
      :approval="approval"
      @dialog:close="onLoanFormClose"
      @close="onLoanFormClose"
      @reload:loan="triggerReload('loan')"
    />
    <!--    <LoanDetailModal-->
    <!--      v-if="loanDetailVisible"-->
    <!--      :visible="loanDetailVisible"-->
    <!--      :approval="approval"-->
    <!--      @dialog:close="onLoanDetailClose"-->
    <!--      @close="onLoanDetailClose"-->
    <!--      @loan:edit="onLoanEdit"-->
    <!--      @reload:loan="triggerReload('loan')"-->
    <!--    />-->

    <PaymentDetailDialog
      v-if="loanDetailVisible"
      :visible="loanDetailVisible"
      :info="approval"
      @dialog:close="onLoanDetailClose"
      @reload:refund="triggerReload('refund')"
    />
    <RefundFormModal
      :visible="refundFormVisible"
      :approval="approval"
      @dialog:close="onRefundFormClose"
      @close="onRefundFormClose"
      @reload:refund="triggerReload('refund')"
    />
    <!--    <RefundDetailModal-->
    <!--      v-if="refundDetailVisible"-->
    <!--      :visible="refundDetailVisible"-->
    <!--      :approval="approval"-->
    <!--      @dialog:close="onLoanDetailClose"-->
    <!--      @close="onRefundDetailClose"-->
    <!--      @loan:edit="onRefundEdit"-->
    <!--      @reload:refund="triggerReload('refund')"-->
    <!--    />-->
    <RefundDetailDialog
      v-if="refundDetailVisible"
      :visible="refundDetailVisible"
      :info="approval"
      @dialog:close="onRefundDetailClose"
      @reload:refund="triggerReload('refund')"
    />

    <CustomerDetailDialog
      v-if="customerDetailVisible"
      :visible="customerDetailVisible"
      :info="approval"
      @dialog:close="onCustomerDetailClose"
      @reload:refund="triggerReload('refund')"
    />
    <Supplier
      v-if="supplierDetailVisible"
      :visible="supplierDetailVisible"
      :info="approval"
      @dialog:close="onSupplierDetailClose"
      @reload:refund="triggerReload('refund')"
    />

    <!--    <ApplicationDialog ref="applicationDialog" />-->
    <ApplicationDetail
      ref="applicationDetail"
      v-if="advanceDetailVisible"
      @close="onAdvanceDetailClose"
      @reload:application="triggerReload('application')"
    />
    <InvoicesDetail
      ref="invoicingDetail"
      v-if="invoicingDetailVisible"
      @close="onInvoicingDetailClose"
      @reload:invoices="triggerReload('invoices')"
    />
    <AdvanceDetailDialog
      v-if="advanceDetailVisible"
      :visible="advanceDetailVisible"
      ref="advanceDetailDialog"
      :info="approval"
      @dialog:close="onAdvanceDetailClose"
      @reload:application="triggerReload('advance')"
    />
    <RedDetail
      v-if="redDetailVisible"
      ref="redDetailDialog"
      @close="onRedDetailClose"
      @success="triggerReload('red')"
    />
    <VoidDetail v-if="voidDetailVisible" ref="voidDetailDialog" @close="onVoidDetailClose" />
    <UseSealApplyDetail
      v-if="useSealApplyDetailVisible"
      ref="useSealApplyDetailDialog"
      @close="onUseSeaalDetailClose"
      @success="triggerReload('seal')"
    />
    <ProjectEnd
      v-if="projectEndDetailVisible"
      ref="projectEndDetailDialog"
      @close="onProjectDetailClose"
      @success="triggerReload('end')"
    />
    <assetScrappe
      v-if="assetScrappedDetailVisible"
      ref="assetScrappedDetailDialog"
      @close="onAssetScrappedDetailClose"
      @success="triggerReload('end')"
    />
  </div>
</template>

<script src="./indexMine.tsx"></script>

<style lang="less">
@import './indexMine.less';
</style>
<style>
.tg-workbench-page-copy {
  margin-top: 0;
}
</style>
