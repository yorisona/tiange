<template>
  <el-dialog
    class="tg-dialog-classic tg-dialog-vcenter-new"
    :class="[dialogClass]"
    :visible="dialogVisible"
    :width="dialogWidth"
    height="760px"
    @close="close"
    :before-close="beforeClose"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <template #title>成本结算</template>
    <div class="settlement-dialog-content">
      <div class="steps-line">
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
        @setDialogVisible="setDialogVisible"
        @submit:success="onSubmitSuccess"
        ref="stepCompRef"
      />
    </div>
  </el-dialog>
</template>

<script src="./dialog.ts"></script>

<style lang="less">
@import './dialog.less';
.settlement-dialog,
.settlement-cost-dialog {
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
