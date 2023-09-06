<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-15 11:17:04
-->
<template>
  <div class="tg-live-project-dialog-collection-refund-write-off">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="920px"
      top="278px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>{{ type === 'pay' ? '付款退款核销' : '收款退款核销' }}</template>
      <div style="height: 570px">
        <div class="write-off-amount">
          <span>{{ '退款可核销金额：' }}</span>
          <span>{{ formatAmount(notWriteOffAmount) }}</span>
        </div>
        <el-table
          v-loading="listLoading"
          :height="510"
          stripe
          :data="data"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
          <el-table-column label="本次核销金额" align="right" :width="178">
            <template slot-scope="scope">
              <div>
                <el-input
                  :value="scope.row.type_in_write_off_amount"
                  size="small"
                  :disabled="typeInInputDisabled(scope.row)"
                  @input="val => typeInAmountChanged(val, scope.$index)"
                >
                  <span slot="prefix">￥</span>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <empty-common detail-text="暂无项目"></empty-common>
          </template>
        </el-table>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button :disabled="saveDisabled" type="primary" @click="handleSaveAction"
          >保存</tg-button
        >
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./refundWriteOff.ts"></script>
<style lang="less">
@import './refundWriteOff.less';
</style>
