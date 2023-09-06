<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-02 15:16:45
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-management-dashboard-page-container {
  // background: white;
  flex: 1;
  padding: 0;
  margin-top: 10px;
  overflow: overlay;
  .dashboard-description {
    background: white;
    display: flex;
    justify-content: space-between;
    padding: 16px 18px 18px;
    line-height: 28px;
    .update-time {
      line-height: 27px;
      color: var(--text-third-color);
      font-size: 12px;
      margin-left: 18px;
    }
    .operators {
      display: flex;
      .time-btn {
        height: 28px;
        width: 28px;
        border: 1px solid rgba(var(--text-third-rgb-color), 0.3);
        border-radius: 14px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        .icon {
          color: var(--text-third-color);
        }
        &:hover {
          border-color: var(--theme-color);
          .icon {
            color: var(--theme-color);
          }
        }
        &[disabled] {
          border-color: var(--border-line-other-color);
          .icon {
            color: var(--border-line-other-color);
          }
        }
      }
      .display-time {
        color: var(--text-color);
        font-size: 16px;
        // font-weight: 600;
        margin: 0 12px;
      }
      .date-switch {
        margin-left: 32px;
        height: 28px;
        line-height: 28px;
        .date-switch-year {
          border-left: 1px solid var(--border-line-color);
          border-top: 1px solid var(--border-line-color);
          border-bottom: 1px solid var(--border-line-color);
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          &:hover + .date-switch-quarter {
            border-left-color: var(--theme-color);
          }
          &[selected] + .date-switch-quarter {
            border-left-color: var(--theme-color);
          }
        }
        .date-switch-quarter {
          border-left: 1px solid var(--border-line-color);
          border-top: 1px solid var(--border-line-color);
          border-bottom: 1px solid var(--border-line-color);
          &:hover + .date-switch-month {
            border-left-color: var(--theme-color);
          }
          &[selected] + .date-switch-month {
            border-left-color: var(--theme-color);
          }
        }
        .date-switch-month {
          border: 1px solid var(--border-line-color);
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .tg-btn-link {
          padding: 5px 12px;
          font-size: 12px;
          color: var(--text-color);
          &:hover {
            border-color: var(--theme-color);
          }
          &[selected] {
            border-color: var(--theme-color);
            color: var(--theme-color);
            background-color: #e9f1ff;
          }
        }
      }
    }
    .desction {
      display: flex;
      align-items: center;
      .desction-icon {
        width: 16px;
        height: 16px;
        color: #a4b2c2;
        &:hover {
          color: #a4b2c2 !important;
        }
      }
      .desction-text {
        margin-left: 6px;
        color: var(--text-color);
        font-size: var(--small-font-size);
      }
      &:hover {
        .desction-text {
          color: var(--theme-color);
        }
      }
    }
  }
  .overview-container {
    background: white;
    padding: 0 18px;
    display: grid;
    // grid-template-columns: repeat(4, auto);
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    // grid-template-rows: 138px;
    column-gap: 16px;
    &.no-per-capitaData {
      // grid-template-rows: 126px;
    }
    .overview-item {
      padding: 18px 20px 20px;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
      text-align: center;
      &:hover {
        border-color: rgba(var(--theme-rgb-color), 0.8);
        outline: 4px solid rgba(77, 161, 255, 0.07);
      }
      &[selected] {
        border-color: transparent;
        box-shadow: 0px 8px 14px -3px rgba(0, 0, 0, 0.08);
      }
      &.gmv[selected] {
        background-color: #f0f9ff;
      }
      &.income[selected] {
        background-color: #ebf7e6;
      }
      &.cost[selected] {
        background-color: #f0efff;
      }
      &.profit[selected] {
        background-color: #fff6e7;
      }
      // &.gmv {
      //   .item-icon {
      //     background-color: #f0f9ff;
      //   }
      // }
      // &.income {
      //   .item-icon {
      //     background-color: #ebf7e6;
      //   }
      // }
      // &.cost {
      //   .item-icon {
      //     background-color: #f0efff;
      //   }
      // }
      // &.profit {
      //   .item-icon {
      //     background-color: #fff6e7;
      //   }
      // }
    }
    .item-header {
      justify-content: center;
      align-items: center;
      display: flex;
      .item-title {
        margin-left: 8px;
        color: var(--text-color);
        font-size: 18px;
      }
      .item-icon {
        // width: 40px;
        // height: 40px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 16px;
          height: 16px;
        }
      }
    }
    .item-amount {
      color: var(--text-color);
      font-size: 26px;
      margin-top: 6px;
      height: 40px;
      line-height: 40px;
      display: block;
      // font-weight: 600;
      &:before {
        content: '¥';
        font-size: 16px;
        margin-right: 8px;
        // font-weight: 600;
      }
    }
    .item-average-amount {
      color: var(--text-second-color);
      margin-top: 8px;
      font-size: var(--small-font-size);
      // font-weight: 400;
      &.hidden {
        display: none;
      }
    }
  }
  .ratio-trend-charts-container {
    background: white;
    padding: 40px 24px 18px;
    display: flex;
    // margin-top: 40px;
    // display: grid;
    // grid-template-columns: minmax(330px, 520px) auto;
    // grid-template-rows: 364px;
  }
  .profix-trend-container {
    margin-top: 10px;
    background: white;
    padding: 24px 24px 0px;
  }
  .labor-project-charts-container {
    background: white;
    display: grid;
    grid-template-columns: 50.55% 1fr;
    column-gap: 32px;
    padding: 32px 24px 57px;
    .bubble-month-display {
      right: 27px;
      top: 62px;
      position: absolute;
    }
    .bubble-tips {
      // margin: 12px 0 0 10px;
      position: absolute;
      bottom: 19px;
      left: 28px;
      display: flex;
      align-items: center;
      .tip-icon {
        width: 20px;
        height: 20px;
        color: var(--warning-color);
        position: relative;
        &:before {
          position: absolute;
          top: 4px;
          left: 3px;
        }
      }
      .tip-text {
        margin-left: 2px;
        font-size: 12px;
        color: var(--text-third-color);
      }
    }
  }
  .chart-title {
    color: var(--text-color);
    font-size: var(--small-font-size);
    // font-weight: 500;
  }
  .dashboard-chart {
    display: flex;
    align-items: center;
    &.border {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
    }
  }
}
</style>

<style lang="less">
.dashboard-month-popover {
  min-width: auto !important;
  width: 100px !important;
  padding: 8px 0 !important;
  .month-list {
    font-size: 14px;
    color: var(--text-color);
    // font-weight: 500;
    text-align: right;
    > .month-list-item {
      line-height: 36px;
      padding-right: 36px;
      cursor: pointer;
      &[selected] {
        color: var(--theme-color);
      }
      &:hover {
        background-color: rgba(var(--theme-rgb-color), 0.06);
      }
      &:first-of-type {
        margin-top: 0;
      }
    }
  }
}
</style>
