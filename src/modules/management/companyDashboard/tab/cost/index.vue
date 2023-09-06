<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-cost-container {
  height: 100%;
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
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
    height: 81px;
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
      height: 81px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 10px 10px 10px 14px;
      flex: 1;
      .header {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        height: 16px;
        line-height: 16px;
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
        margin-top: 4px;
        height: 40px;
        .amount {
          .value {
            font-weight: 600;
            font-size: 18px;
            color: var(--text-color);
            height: 24px;
            line-height: 24px;
          }
          .unit {
            margin-left: 2px;
            font-size: 12px;
            color: var(--text-color);
            height: 16px;
            line-height: 16px;
          }
        }
      }
      .ratio {
        // margin-left: 18px;
        margin-top: 2px;
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
    margin-top: 16px;
    font-weight: 600;
    font-size: 12px;
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
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
