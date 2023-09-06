<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.approve-progress {
  max-height: 320px;
  background: white;
  border: 1px solid whitesmoke;
  width: 240px;
  .progress-header {
    height: 58px;
    line-height: 58px;
    font-size: 14px;
    color: var(--text-color);
    margin: 0 20px;
    border-bottom: #efefef solid 1px;
    font-weight: 600;
  }
  .progress-main {
    padding: 10px;
    overflow: auto;
    height: auto;
    max-height: 221px;
    padding-bottom: 0;
    margin-top: 10px;
    background-color: transparent;
    .progress-item {
      padding-top: 8px;
      border-left: 2px solid $color-primary !important;
      margin-left: 10px;
      margin-top: 10px;
      color: var(--text-color);
      .items-line {
        position: relative;
        top: -22px;
        left: -9px;
      }
      .items {
        font-size: 13px;
        display: flex;
        .item-bac {
          display: flex;
          align-items: center;
          .step-active {
            font-size: 17px;
            color: $color-primary;
            display: inline-block;
            margin-right: 10px;
          }
          .step-fail {
            background: red !important;
          }
          .step-gray {
            background: #e1e2e6 !important;
          }
          .step-name {
            display: inline-block;
            width: 163px;
          }
        }
      }
      .step-con {
        font-size: 13px;
        margin-left: 25px;
        padding: 5px 0;
      }
      .step-con-fail {
        font-size: 13px;
        margin-left: 20px;
        color: var(--error-color);
        padding: 5px;
        overflow-x: hidden;
      }
      .item-time {
        display: inline-block;
        color: var(--text-third-color);
        font-size: 12px;
        margin-left: 25px;
      }
    }
  }
}
.final-line {
  position: relative;
  left: 2px;
}
</style>

<template>
  <div class="approve-progress">
    <div class="progress-header">审批进度</div>
    <div class="progress-main">
      <div
        class="progress-item"
        v-for="(step, index) in workInfos"
        :key="index"
        :style="{
          'border-left':
            index === workInfos.length - 1 && checkStatus !== 4
              ? 'none !important'
              : !step.oa_review_result
              ? '2px solid #6e6efa'
              : '2px solid #EC4141 !important',
        }"
      >
        <div class="items-line">
          <div class="items">
            <div class="item-bac">
              <!-- <span class="step-active" :class="step.oa_review_result  ark ? 'step-fail' : ''"></span> -->
              <tg-icon
                v-if="index === workInfos.length - 1 && checkStatus === 3"
                class="step-active"
                name="ico-cross-red"
                style="position: relative; left: 1px"
              ></tg-icon>
              <tg-icon
                :class="index === workInfos.length - 1 && checkStatus !== 4 ? 'final-line' : ''"
                v-else
                class="step-active"
                name="ico-tick"
              ></tg-icon>
              <span class="step-name">{{ step.nodeName }}</span>
            </div>
          </div>
          <p class="step-con">{{ step.operatorName }}</p>
          <p class="item-time">
            {{ step.operateDate }} {{ step.operateTime.split(':')[0] }}:{{
              step.operateTime.split(':')[1]
            }}
          </p>
          <p
            class="step-con-fail"
            v-if="index === workInfos.length - 1 && (step.oa_review_result || step.remark)"
          >
            理由：{{ step.oa_review_result || step.remark }}
          </p>
        </div>
      </div>
      <div
        class="progress-item"
        style="border: none !important; height: 10px"
        v-if="checkStatus === 4"
      >
        <div class="items-line">
          <div class="items">
            <div class="item-bac">
              <tg-icon
                class="step-active"
                name="ico-waiting"
                style="margin-left: 3px; color: gray !important; font-size: 14.5px"
              ></tg-icon>
              <span
                class="step-name"
                v-if="workInfos && workInfos.length > 0"
                style="width: 130px; font-size: 13px"
                >等待{{ workInfos[workInfos.length - 1].receivedPersons }}审批</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
  </div>
</template>

<script>
import TgIcon from '@/components/IconFont/tg.vue';
export default {
  name: 'ApproveProgress',
  components: {
    TgIcon,
  },
  props: {
    // 审批流程数组
    workInfos: {
      type: Array,
      default: () => [],
    },
    // 审批状态
    checkStatus: {
      type: Number,
      default: () => 0,
    },
  },
};
</script>
