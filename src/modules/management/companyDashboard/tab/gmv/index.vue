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
      height: 81px;
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
        margin-top: 4px;
        .value {
          font-weight: 600;
          font-size: 20px;
          color: var(--text-color);
        }
        .unit {
          margin-left: 2px;
          color: var(--text-color);
        }
      }
    }
    .summary-info-right {
      flex: 1;
      display: flex;
      // height: 128px;
      flex-direction: column;
      .process-info {
        margin-top: 8px;
        display: flex;
        align-items: center;
        margin-left: 35px;
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
        // margin-top: 13px;
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
          height: 81px;
          background: #f6f6f6;
          border-radius: 4px;
          padding: 18px 12px 18px 16px;
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
            margin-top: 8px;
            .amount {
              .value {
                font-weight: 600;
                font-size: 18px;
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
    margin-top: 16px;
    font-weight: 600;
    font-size: 12px;
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
    margin-top: 12px;
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
