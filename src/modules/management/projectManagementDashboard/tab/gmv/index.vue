<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-gmv-container {
  height: 100%;
  padding: 18px;
  /deep/ .dashboard-chart {
    .empty-chart {
      height: 100%;
    }
  }
  .summary-info {
    display: flex;
    .summary-info-left {
      width: 180px;
      height: 96px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 16px 18px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
        line-height: 20px;
        .title-desc {
          font-size: 14px;
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
        margin-top: 6px;
        height: 26px;
        line-height: 26px;
        .value {
          font-weight: 600;
          font-size: 18px;
          color: var(--text-color);
        }
        .unit {
          margin-left: 4px;
          color: var(--text-color);
        }
      }
    }
    .summary-info-right {
      margin-left: 0;
      height: 96px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .process-summary {
        margin-left: 35px;
        display: flex;
        align-items: center;
        height: 32px;
        line-height: 32px;
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
        flex: 1;
        margin-top: 0;
        line-height: 12px;
        height: 12px;
        .el-progress-bar__outer {
          border-radius: 2px;
          .el-progress-bar__inner {
            border-radius: 2px;
          }
        }
      }
      .calculate {
        margin-top: 4px;
        display: flex;
        align-items: center;
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
          padding: 10px 16px;
          flex: 1;
          .header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
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
            margin-top: 2px;
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
            margin-left: 6px;
            font-size: 12px;
            display: flex;
            align-items: center;
            .icon {
              width: 14px;
              height: 14px;
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
    margin-top: 16px;
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
  .chart-field {
    position: relative;
    margin-top: 16px;
    .chart-filter {
      position: absolute;
      right: 210px;
      top: 1px;
      display: flex;
      .line-filter {
        height: 18px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
