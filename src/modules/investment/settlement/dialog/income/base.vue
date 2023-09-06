<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 09:58:33
-->
<template>
  <el-dialog
    class="tg-dialog-classic settlement-investment-dialog tg-dialog-vcenter-new"
    :visible="dialogVisible"
    :width="dialogWidth"
    @close="close"
    :before-close="beforeClose"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #title>招商结算</template>
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
        class="settlement-dialog-content-base"
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

<script src="./base.ts"></script>

<style lang="less">
@charset 'utf-8';
@import '~@/styles/utils/index.less';
.settlement-investment-dialog.tg-dialog-classic {
  .settlement-dialog-content {
    display: grid;
    width: 100%;
    grid-template-rows: 73px auto;
    height: 620px;
    > .steps-line {
      width: 100%;
      display: flex;
      align-items: center;
      height: 73px;
      .pd(0 144px);
      .brd-b(rgba(var(--tip-icon-rgb-color), 0.3));
      font-weight: 600;
      user-select: none;
      > .tg-steps {
        width: 100%;
      }
    }
    > .settlement-dialog-content-base {
      display: grid;
      grid-template-rows: auto 50px;
      grid-template-columns: 1fr;
      .bottom-button-line {
        display: grid;
        grid-template-areas: '. .';
        justify-content: center;
        align-items: center;
        width: 100%;
        //column-gap: 12px;
        .bgc(#f4f8ff);
        height: 50px;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }

  .el-form-item__label {
    .pdr(12px);
    .fc(14px, var(--text-second-color));
    font-weight: 400;
  }
  .el-input-group__append {
    .pd(0 12px);
  }
  .step2-layout {
    > .step2-layout-content {
      display: grid;
      // grid-template-rows: 118px 320px 50px;
      row-gap: 18px;
      column-gap: 18px;
      .pd(19px 24px 24px);
      &.step2-content-one {
        height: 497px;
        background-color: #ffffff;
      }
      &.step2-content-two {
        height: 497px;
        background-color: #ffffff;
      }
      &.step2-content-three {
        height: 497px;
        background-color: #ffffff;
      }
      &.col-2 {
        grid-template-areas:
          'top top'
          'left right'
          'bottom bottom';
        // grid-template-columns: 1fr repeat(2, 286px) 1fr;
      }
      &.col-3 {
        grid-template-areas:
          'top top top'
          'left center right'
          'bottom bottom bottom';
        // grid-template-columns: repeat(3, 286px);
      }
      > .step2-layout-content-top {
        grid-area: top;
        // display: flex;
        // align-items: center;
      }
      > .step2-layout-content-left {
        grid-area: left;
        display: flex;
      }
      > .step2-layout-content-center {
        grid-area: center;
        display: flex;
      }
      > .step2-layout-content-right {
        grid-area: right;
        display: flex;
      }
      > .step2-layout-content-bottom {
        grid-area: bottom;
        display: flex;
        // display: flex;
        // align-items: center;
      }
    }
  }
  .step3-layout > .step3-layout-content {
    height: 497px;
  }
}

.settlement-investment-dialog {
  .steps-line {
    justify-content: center;
    > .steps {
      display: grid;
      grid-template-areas: 'step1 . step2 . step3';
      align-items: center;
      > .step {
        display: flex;
        align-items: center;
        > .step-icon {
          .wh(24px, 24px);
          .brdr(50%);
          .ta-c();
          user-select: none;
          .mgr(6px);
          svg.icon {
            .fs(16px);
          }
        }

        &.finish {
          > .step-icon {
            .brd(1px; solid; rgba(var(--theme-rgb-color), 0.8));
            > svg.icon {
              .fc(16px, rgba(var(--theme-rgb-color), 0.8));
              transform: translateY(2px);
            }
          }
          > .step-title {
            font-weight: 600;
            .fc(14px, var(--text-second-color));
          }
        }

        &.process {
          > .step-icon {
            .brd(1px; solid; rgba(var(--theme-rgb-color), 0));
            .bgc(rgba(var(--theme-rgb-color), 0.8));
            .lh(22px);
            .fgc(white);
          }
          > .step-title {
            .fc(14px, var(--text-color));
            font-weight: 600;
          }
        }
        &.wait {
          > .step-icon {
            .brd(fade(#3c5269, 40));
            .lh(22px);
            .fgc(fade(#3c5269, 40));
          }
          > .step-title {
            .fc(14px, fade(#3c5269, 30));
          }
        }
      }
      > .step-line {
        .wh(180px, 1px);
        .brd(1px; solid; rgba(var(--tip-icon-rgb-color), 0.3));
        .mg(0 6px);
      }
    }
    > .steps:not(.plus) {
      grid-template-columns: 86px 192px 86px 192px 86px;
    }
    > .steps.plus {
      grid-template-columns: 86px 192px 86px 192px 100px;
    }
  }
}
</style>
