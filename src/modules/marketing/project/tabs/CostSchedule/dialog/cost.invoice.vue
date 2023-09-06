<!--
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 发票详情
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-20 17:02:22
-->
<template>
  <tg-block class="dialog-build-in-cost-invoice">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      :visible="visible"
      width="440px"
      top="600px"
      :close-on-click-modal="true"
      @close="close"
      @closed="closed"
    >
      <template #title>发票详情</template>
      <div style="padding: 6px 24px 24px 24px">
        <div v-for="(invoice, index) in newInvoices" :key="index">
          <div class="title">{{ `凭证${index + 1}` }}</div>
          <div class="container">
            <el-image
              style="cursor: pointer"
              class="image"
              :src="`${invoice.pic_url}?${tokenStr}`"
              @click="showImage(`${invoice.pic_url}?${tokenStr}`)"
            >
            </el-image>
            <!-- <img :src="`${invoice.pic_url}?${tokenStr}`" class="image" /> -->
            <div class="invoice-content">
              <div class="row line-clamp-1">
                <span class="label">发票号码：</span
                ><span class="value">{{ invoice.invoice_num }}</span>
              </div>
              <div class="row line-clamp-1">
                <span class="label">开票日期：</span
                ><span class="value">{{ invoice.invoice_date }}</span>
              </div>
              <div class="row line-clamp-1">
                <span class="label">开票金额：</span
                ><span class="value">{{ invoice.amount_str }}</span>
              </div>
              <div class="row line-clamp-1">
                <span class="label">开票公司：</span
                ><span class="value">{{ invoice.institution }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </tg-block>
</template>

<script src="./cost.invoice.ts"></script>
<style lang="less">
@import './cost.invoice.less';
</style>
