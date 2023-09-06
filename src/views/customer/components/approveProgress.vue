<style lang="less" scoped>
#approve-progress {
  .progress-header {
    margin-top: -18px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
    border-bottom: #efefef solid 1px;
  }
  .progress-main {
    padding-top: 18px;
    .progress-item {
      // &.status-none {}
      &.status-success {
        .progress-item-header {
          .status-icon {
            color: var(--theme-color);
          }
        }
        .progress-item-body {
          border-color: var(--theme-color);
        }
      }
      &.status-warning {
        .progress-item-header {
          .status-icon {
            color: #f34b60;
          }
        }
        .progress-item-body {
          border-color: #f34b60;
          .status-text {
            color: #f34b60;
          }
        }
      }

      .progress-item-header {
        .status-icon {
          font-size: 16px;
          vertical-align: middle;
          color: #ddd;
          &.el-icon-warning {
            font-size: 14px;
            margin-left: 1px;
          }
        }
        .header-text {
          font-size: 14px;
          margin-left: 8px;
          vertical-align: middle;
        }
        .step-time {
          font-size: 12px;
          float: right;
          color: var(--text-des-color);
          line-height: 20px;
        }
      }
      .progress-item-body {
        margin-left: 7px;
        border-left: #ddd solid 2px;
        padding-left: 20px;
        min-height: 40px;
        padding-bottom: 8px;
        .status-text {
          font-size: 12px;
          color: var(--text-des-color);
        }
        .reason-text {
          font-size: 12px;
          color: #666;
          background: #f2f2f2;
          padding: 10px;
          margin-top: 8px;
        }
      }
      &:nth-last-child(1) {
        .progress-item-body {
          border-left: none;
          min-height: initial;
        }
      }
    }
  }
}
</style>

<template>
  <div id="approve-progress">
    <div class="progress-header">审批进度</div>
    <div class="progress-main">
      <div
        v-for="(step, index) in workInfos"
        :key="index"
        :class="['progress-item', handleProgressStatus(step.result)]"
      >
        <div class="progress-item-header">
          <i
            v-if="handleProgressStatus(step.result) === 'status-success'"
            class="status-icon el-icon-circle-check"
          ></i>
          <i
            v-if="handleProgressStatus(step.result) === 'status-warning'"
            class="status-icon el-icon-warning"
          ></i>
          <span class="header-text">{{ step.user }}</span>
          <span class="step-time">{{ approveTime(step.create_time_str) }}</span>
        </div>
        <div class="progress-item-body">
          <span class="status-text">{{ step.result_str }}</span>
          <p v-if="step.comment" class="reason-text">{{ step.comment }}</p>
        </div>
      </div>
      <!-- 普通合同 -->
      <div
        v-if="
          type === 'ht' &&
          contractInfo.contract_info &&
          contractInfo.contract_info.contract_todo_str
        "
        :class="[
          'progress-item',
          { 'status-success': contractInfo.contract_info.contract_status === 2 },
        ]"
      >
        <div class="progress-item-header">
          <i class="status-icon el-icon-circle-check"></i>
          <span class="header-text">{{ contractInfo.contract_info.contract_todo_str }}</span>
        </div>
        <div class="progress-item-body">
          <!-- <span class="status-text">审核成功</span> -->
        </div>
      </div>
      <!-- 合同附件 -->
      <div
        v-if="type === 'fj' && contractInfo.contract_annex_info.length > 0"
        :class="[
          'progress-item',
          { 'status-success': contractInfo.contract_annex_info[0].contract_annex_status === 2 },
        ]"
      >
        <div class="progress-item-header">
          <i class="status-icon el-icon-circle-check"></i>
          <span class="header-text">{{
            contractInfo.contract_annex_info[0].contract_annex_todo_str
          }}</span>
        </div>
        <div class="progress-item-body">
          <!-- <span class="status-text">审核成功</span> -->
        </div>
      </div>
      <!-- 合同附件审批 -->
      <div
        v-if="type === 'fjapproval' && contractInfo.contract_annex_info"
        :class="[
          'progress-item',
          { 'status-success': contractInfo.contract_annex_info.contract_annex_status === 2 },
        ]"
      >
        <div class="progress-item-header">
          <i class="status-icon el-icon-circle-check"></i>
          <span class="header-text">{{
            contractInfo.contract_annex_info.contract_annex_todao_str
          }}</span>
        </div>
        <div class="progress-item-body">
          <!-- <span class="status-text">审核成功</span> -->
        </div>
      </div>
      <!-- <div class="progress-item">
        <div class="progress-item-header">
          <i class="status-icon el-icon-circle-check"></i>
          <span class="header-text">红掌</span>
          <span class="step-time">2019-07-26 12:11</span>
        </div>
        <div class="progress-item-body">
          <span class="status-text">审核失败</span>
          <p class="reason-text">合同金额问题合同金额问。合同金额问题合同金额问。合同金额问题合同金额问。</p>
        </div>
      </div>
      <div class="progress-item">
        <div class="progress-item-header">
          <i class="status-icon el-icon-circle-check"></i>
          <span class="header-text">益智</span>
          <span class="step-time">2019-07-26 12:11</span>
        </div>
        <div class="progress-item-body">
          <span class="status-text">已创建</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApproveProgress',
  props: {
    // 审批流程数组
    workInfos: {
      type: Array,
      default: () => [],
    },
    // 合同信息
    contractInfo: {
      type: Object,
      default: () => {
        /* do nth */
      },
    },
    // 流程类型（合同、附件）
    type: {
      type: String,
      default: 'ht',
    },
  },
  mounted() {
    // console.log(this.workInfos)
  },
  methods: {
    // 根据状态值返回对应状态的className
    handleProgressStatus(status) {
      if (
        status === 1000 ||
        status === 1002 ||
        status === 1100 ||
        status === 1102 || // 合同审核状态
        status === 2000 ||
        status === 2002 ||
        status === 2100 ||
        status === 2102 // 合同附件审核状态
      ) {
        return 'status-success';
      } else if (
        status === 1001 ||
        status === 1003 ||
        status === 1101 ||
        status === 1103 || // 合同审核状态
        status === 2001 ||
        status === 2003 ||
        status === 2101 ||
        status === 2103 // 合同附件审核状态
      ) {
        return 'status-warning';
      } else {
        return '';
      }
    },
    // 处理审核时间字符串
    approveTime(timeStr) {
      if (timeStr.length >= 16) {
        return timeStr.substr(0, 16);
      } else {
        return '';
      }
    },
  },
};
</script>
