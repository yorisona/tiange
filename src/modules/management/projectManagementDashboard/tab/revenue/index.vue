<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-revenue-container {
  height: 100%;
  padding: 16px 18px 18px;
  /deep/ .dashboard-chart {
    .empty-chart {
      height: 100%;
    }
  }
  .summary-info {
    display: flex;
    .summary-info-left {
      background: #f6f6f6;
      padding: 8px 12px;
      border-radius: 4px;
      height: 108px;
      min-width: 200px;
      .header {
        height: 20px;
        line-height: 20px;
        .header-name {
        }
        .settlement-ratio {
          margin-left: 26px;
          display: inline-block;
          padding: 2px 6px;
          background: #e4e8ee;
          border-radius: 4px;
          font-size: 12px;
          > span {
            font-weight: 600;
          }
        }
      }
      .total-revenue-info {
        height: 25px;
        line-height: 25px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .total-revenue {
          height: 25px;
          color: var(--text-color);
          font-size: 16px;
          font-weight: 600;
          > span {
            font-size: 12px;
            font-weight: 400;
          }
        }
        .ratio {
          margin-left: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          .icon {
            width: 16px;
            height: 16px;
          }
        }
      }
      .line {
        margin: 2px 0 4px;
        height: 1px;
        border-bottom: 1px dashed #d8d8d8;
      }
      .receipt-info {
        font-size: 12px;
        height: 36px;
        .receipt {
          height: 18px;
          line-height: 18px;
          .label {
            color: var(--text-third-color);
          }
          .value {
            font-size: 12px;
            font-weight: 600;
          }
        }
        .not-receipt {
          // margin-top: 4px;
        }
      }
    }
    .summary-info-right {
      flex: 1;
      display: flex;
      height: 108px;
      flex-direction: column;
      .process-info {
        margin-top: 8px;
        height: 32px;
        line-height: 32px;
        display: flex;
        align-items: center;
        margin-left: 35px;
        .process-summary {
          height: 32px;
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
          margin-left: 4px;
          flex: 1;
          .el-progress-bar__outer {
            border-radius: 2px;
            .el-progress-bar__inner {
              border-radius: 2px;
            }
          }
        }
      }
      .calculate {
        margin-top: 10px;
        display: flex;
        align-items: center;
        height: 58px;
        .operator {
          width: 35px;
          text-align: center;
          font-weight: 600;
          font-size: 24px;
          color: var(--text-third-color);
          flex-shrink: 0;
          // padding-top: 28px;
        }
        .calculate-item {
          height: 58px;
          background: #f6f6f6;
          border-radius: 4px;
          padding: 6px 12px;
          flex: 1;
          .header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            height: 18px;
            line-height: 18px;
            .header-name {
            }
            .header-value {
              color: var(--text-third-color);
              > span {
                color: var(--text-color);
                font-weight: 600;
              }
            }
          }
          .detail {
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
            height: 20px;
            line-height: 20px;
            .amount {
              .value {
                font-weight: 600;
                font-size: 16px;
                color: var(--text-color);
              }
              .unit {
                margin-left: 2px;
                font-size: 12px;
                color: var(--text-color);
              }
            }
          }
          .ratio {
            margin-left: 18px;
            font-size: 12px;
            display: flex;
            align-items: center;
            .icon {
              width: 16px;
              height: 16px;
            }
            .label {
              color: var(--text-third-color);
            }
            .value {
            }
          }
        }
      }
    }
  }
  .chart-title {
    height: 18px;
    line-height: 18px;
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .chart-title-name {
      font-weight: 600;
      font-size: 12px;
      display: flex;
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
    .chart-tips {
      margin-right: 7px;
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
  .chart-field {
    position: relative;
    margin-top: 12px;
    .chart-filter {
      position: absolute;
      right: 7px;
      top: 0;
      display: flex;
      .bar-filter {
        height: 18px;
        display: flex;
        align-items: center;
      }
      .line-filter {
        margin-left: 48px;
        display: flex;
        align-items: center;
        .line-icon {
          width: 23px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
