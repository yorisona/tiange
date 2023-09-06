<!--
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 打款凭证
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-21 14:54:11
-->

<template>
  <tg-block class="dialog-build-in-pay-certificate">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      :visible="visible"
      width="478px"
      top="278px"
      :close-on-click-modal="true"
      @close="close"
      @closed="closed"
    >
      <!-- 660 -->
      <template #title>打款凭证详情</template>
      <div style="padding: 24px">
        <div
          v-for="(item, index) in picList"
          :key="index"
          :style="index > 0 ? 'margin-top: 18px' : ''"
        >
          <div
            style="
              color: var(--text-color);
              font-weight: 600;
              margin-bottom: 12px;
              line-height: 18px;
            "
            class="title"
          >
            {{ `凭证${index + 1}` }}
          </div>
          <img
            style="width: 100%; height: 100%; border-radius: 10px; border: 1px solid #e8ecee"
            :src="`${item}?${tokenStr}`"
            class="image"
          />
        </div>
      </div>
    </el-dialog>
  </tg-block>
</template>

<script src="./pay.certificate.ts"></script>
<style lang="less">
@import './pay.certificate.less';
</style>
