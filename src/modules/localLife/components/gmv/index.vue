<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-gmv-container {
  height: 100%;
  padding: 0 0 8px;
  margin-top: -12px;
  /deep/ .dashboard-chart {
    .empty-chart {
      height: 100%;
    }
  }
  .summary-info {
    display: flex;
    .summary-info-left {
      width: 211px;
      height: 99px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 16px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-desc {
          font-size: 16px;
        }
        .ratio {
          font-size: 12px;
          display: flex;
          align-items: center;
          .icon {
            width: 16px;
            height: 16px;
          }
        }
      }
      .gmv {
        margin-top: 16px;
        .value {
          font-weight: 600;
          font-size: 20px;
          color: #333333;
        }
        .unit {
          margin-left: 2px;
          color: var(--text-color);
        }
      }
    }
    .summary-info-right {
      margin-left: 18px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .process-summary {
        display: flex;
        align-items: center;
        > img {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        .process-desc {
          // margin-left: 8px;
          font-size: 12px;
          color: var(--text-third-color);
          .goal-value {
            font-weight: 600;
            color: var(--text-color);
          }
          .goal-unit {
            color: var(--text-color);
          }
          .process-value {
            color: #7328ff;
          }
          .status {
            color: #7328ff;
          }
        }
      }
      /deep/ .el-progress {
        margin-top: 12px;
        .el-progress-bar__outer {
          border-radius: 2px;
          .el-progress-bar__inner {
            border-radius: 2px;
          }
        }
      }
    }
  }
  .chart-title {
    // margin-top: 24px;
    font-size: 14px;
    display: flex;
    line-height: 18px;
    height: 18px;
    align-items: center;
    &:before {
      content: ' ';
      width: 3px;
      height: 14px;
      border-radius: 1px;
      margin-right: 4px;
      background-color: #2877ff;
    }
  }
  .chart-field {
    position: relative;
    margin-top: 16px;
    .chart-tips {
      display: flex;
      align-items: center;
      position: absolute;
      right: 275px;
      top: 3px;
      .budget-tag {
        font-size: 12px;
        color: var(--text-second-color);
        display: inline-flex;
        align-items: center;
        margin-left: 16px;
        &::before {
          content: ' ';
          width: 8px;
          height: 8px;
          margin-right: 6px;
          background-color: #ed3434;
        }
      }
      .budget-tag.budget-tag-1::before {
        background-color: #ed3434;
      }
      .budget-tag.budget-tag-2::before {
        background-color: #2877ff;
      }
      .budget-tag.budget-tag-3::before {
        background-color: #20bf55;
      }
      .budget-tag.budget-tag-4::before {
        background-color: #7328ff;
      }
    }
  }
}
</style>
