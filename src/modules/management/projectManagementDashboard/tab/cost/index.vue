<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-cost-container {
  height: 100%;
  padding: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  /deep/ .empty-no-support {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    div {
      color: var(--text-third-color);
      font-size: var(--small-font-size);
    }
    img {
      width: 150px !important;
      height: 100px !important;
      margin-bottom: 10px !important;
    }
  }
  /deep/ .dashboard-chart {
    .empty-chart {
      height: 100%;
    }
  }
  .cost-info {
    display: flex;
    // align-items: center;
    .operator {
      width: 35px;
      text-align: center;
      font-weight: 600;
      font-size: 24px;
      color: var(--text-third-color);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      // padding-top: 24px;
    }
    .calculate-item {
      // height: 100px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 10px 12px;
      flex: 1;
      height: 89px;
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
        // display: flex;
        // justify-content: space-between;
        margin-top: 6px;
        height: 45px;
        .amount {
          height: 24px;
          line-height: 24px;
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
        // margin-left: 18px;
        margin-top: 6px;
        height: 16px;
        line-height: 16px;
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
  .chart-title {
    height: 18px;
    line-height: 18px;
    margin-top: 21px;
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
    margin-top: 20px;
    .chart-filter {
      position: absolute;
      right: 301px;
      top: 0;
      display: flex;
      .bar-filter {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
