<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-05 14:51:42
-->
<template>
  <el-dialog
    class="tg-dialog-classic settlement-dialog tg-dialog-vcenter-new"
    :visible="dialogVisible"
    :width="dialogWidth"
    @close="close"
    :before-close="beforeClose"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <template #title>收入结算</template>
    <div
      class="settlement-dialog-content"
      :style="{
        width: dialogWidth,
      }"
    >
      <div class="steps-line" :style="{ width: dialogWidth }">
        <div class="steps" :class="is_virtual_receipt ? 'plus' : 'normal'">
          <template v-for="(step, stepIndex) in steps">
            <div
              class="step"
              :class="{
                finish: stepIndex < activeNumber,
                process: stepIndex === activeNumber,
                wait: stepIndex > activeNumber,
              }"
              :key="stepIndex"
            >
              <div class="step-icon" v-if="stepIndex < activeNumber">
                <tg-icon name="ico-right" />
              </div>
              <div class="step-icon" v-else>{{ stepIndex + 1 }}</div>
              <div class="step-title">{{ step.title }}</div>
            </div>
            <template v-if="stepIndex < 2">
              <div class="step-line" :key="`line-${stepIndex}`"></div>
            </template>
          </template>
        </div>
      </div>
      <component
        class="settlement-dialog-content-main"
        :is="formComponent"
        @cancel="close"
        @prev="prev"
        @next="next"
        @submit:success="onSubmitSuccess"
        ref="stepCompRef"
      />
    </div>
  </el-dialog>
</template>

<script src="./main.ts"></script>

<style lang="less">
@import './main.less';
.settlement-dialog {
  a,
  .tg-ghost-button {
    font-size: 12px !important;
    &.tg-btn-link,
    a {
      font-size: 12px !important;
    }
  }
  a[disabled],
  a.disabled {
    color: var(--text-third-color);
  }
}
</style>
<style lang="less" scoped>
/deep/.el-form .el-form-item--mini .el-form-item__content {
  line-height: 28px;
  > span {
    padding: 4px 0;
    line-height: 20px;
    display: inline-block;
  }
}
</style>
