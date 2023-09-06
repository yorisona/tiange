<!--
 * @Author: 肖槿
 * @Date: 2021-05-19 16:57:05
 * @Description: 查看业务结算
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-14 15:30:08
 * @FilePath: \goumee-star-frontend\src\modules\finance\Settlement\components\BuessinessSettlement\index.vue
-->
<template>
  <div>
    <el-dialog
      class="tg-dialog-classic settlement-dialog-a"
      :visible="settlementVisible"
      width="942px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeHandler"
      :top="top ? top : '15vh'"
    >
      <template #title>收入结算</template>
      <div class="settlement-main">
        <merchant-settlement :readonly="true" v-if="isMerchantSettlement"></merchant-settlement>
        <settlement-detail
          v-else
          :item="currentcolumn"
          :disabledMonth="disabledMonth"
          :accountDateVisible="operatorAbled"
          @accountDateChange="onAccountDateChange"
        />
      </div>
      <template #footer>
        <tg-button-line v-if="operatorAbled" justify-content="center">
          <tg-button @click="unpassHandler">不通过</tg-button>
          <tg-button type="primary" @click="passHandler">确认结算</tg-button>
        </tg-button-line>
      </template>
    </el-dialog>
    <settlement-dialog ref="settlementDialog" @unpass="unpassReasonHandler" />
    <billPeriod ref="billPeriodRef" @save="onBillPeriodHaandler"></billPeriod>
    <tg-mask-loading :visible="confirmLoading" content="正在提交，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
