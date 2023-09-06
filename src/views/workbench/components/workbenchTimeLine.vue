<!--
 * @Author: 肖槿
 * @Date: 2021-08-19 15:35:19
 * @Description: 详情时间线
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-31 16:52:04
 * @FilePath: \goumee-star-frontend\src\views\workbench\components\workbenchTimeLine.vue
-->
<template>
  <el-steps class="invoice-steps" direction="vertical" :active="items.length">
    <el-step v-for="(item, idx) in items" :key="item.nodeId + idx">
      <div slot="icon" v-if="stepStatus === 3 && idx === items.length - 1" class="my-icon error">
        <tg-icon name="ico-cross-red" />
      </div>
      <div slot="icon" v-else class="my-icon success">
        <tg-icon name="ico-a-chenggong2x"></tg-icon>
      </div>
      <div slot="title" class="step-title">
        <span>{{ item.nodeName }}</span>
      </div>
      <div slot="description" class="description">
        <div class="operator">
          <span>审批人：</span>
          <span>{{ item.operatorName }}</span>
        </div>
        <div
          v-if="item.remark"
          class="remark"
          :class="stepStatus === 3 && items.length - 1 === idx && 'error-text'"
        >
          <span>理由：</span>
          <span>{{ item.remark }}</span>
        </div>
        <div class="timestamp">
          <span>{{ item.approval_date }}</span>
        </div>
      </div>
    </el-step>
    <el-step
      v-if="stepStatus === 1 && items[items.length - 1] && items[items.length - 1].receivedPersons"
    >
      <div slot="icon" class="my-icon">
        <span class="num received">{{ items.length + 1 }}</span>
      </div>
      <div slot="title" class="step-title">
        <span style="color: var(--text-third-color)">{{
          items[items.length - 1].receivedPersons
        }}</span>
      </div>
      <div slot="description" class="operator received">
        <span style="color: var(--text-third-color)">待处理</span>
      </div>
    </el-step>
  </el-steps>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    stepStatus: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style lang="less">
.invoice-steps {
  display: block;
  height: auto;
  & .el-step__icon {
    border: 0;
    font-size: 17px;
  }
  & .el-step {
    min-height: 68px;
  }
  & .el-step.is-vertical .el-step__title {
    padding: 0;
  }
  & .my-icon {
    font-size: 17px;
    & .icon {
      width: 17px;
      height: 17px;
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
    }
    & .num {
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 14px;
      display: inline-block;
      background: var(--theme-color);
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
      position: relative;
      top: -2px;
      &.received {
        border: 1px solid var(--text-third-color);
        background-color: #fff;
        color: var(--text-third-color);
      }
    }
  }
  & .is-finish {
    color: #689fff;
    border-color: #689fff;
    .el-step__line {
      background-color: #689fff;
    }
    .el-step__icon {
      border-width: 1px;
      border-color: #689fff;
    }
  }
  & .step-title {
    font-size: 12px;
    color: var(--text-color);
    margin-bottom: 6px;
    font-weight: 400;
  }
  & .description {
    line-height: 1;
    font-size: 12px;
    & .operator {
      color: var(--text-third-color);
      margin-bottom: 6px;
      &.received {
        color: var(--text-color);
      }
    }
    & .remark {
      line-height: 1.5;
      color: var(--text-color);
      margin-bottom: 6px;
      &.error-text {
        color: var(--error-color);
      }
    }
    & .timestamp {
      line-height: 1;
      color: var(--text-third-color);
    }
  }
}
</style>
