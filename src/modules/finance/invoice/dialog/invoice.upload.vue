<template>
  <div class="invoice-upload-dialog">
    <el-dialog
      class="tg-dialog-classic upload-dialog-box"
      title="上传发票"
      :visible="visible"
      width="552px"
      @close="cancel"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <tg-block class="flex-none" :bodyStyle="{ padding: '0' }" style="height: 48px">
        <tg-tabs :tabs="tabs" v-model="checkedTab" bottom />
      </tg-block>
      <computer
        v-if="checkedTab === 'computer'"
        :baseInfo="baseInfo"
        :type="baseType"
        ref="invoicePcUploadPef"
      />
      <chooseHistoryInvoice
        ref="chooseHistoryInvoiceRef"
        :baseInfo="baseInfo"
        :type="baseType"
        v-else-if="checkedTab === 'chooseHistoryInvoice'"
      ></chooseHistoryInvoice>
      <iphone
        v-else
        ref="invoiceIphoneUploadPef"
        :baseType="baseType"
        :projectType="projectType"
        :baseInfo="baseInfo"
      ></iphone>
      <div
        v-if="checkedTab === 'computer' || checkedTab === 'chooseHistoryInvoice'"
        slot="footer"
        class="dialog-footer"
      >
        <tg-button @click="cancel" class="mgr-12">取 消</tg-button>
        <tg-button type="primary" @click="submit">提 交</tg-button>
      </div>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>
<script src="./invoice.upload.ts"></script>
<style lang="less">
@import './invoice.upload.less';
</style>
