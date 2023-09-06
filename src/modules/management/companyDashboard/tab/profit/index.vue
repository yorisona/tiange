<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-profit-container {
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
  .summary-info {
    display: flex;
    .label {
    }
    .value {
      font-size: 20px;
      font-weight: 600;
    }
    .unit {
      margin-left: 4px;
    }
    .profit-ratio {
    }
    .avg-profit {
      margin-left: 30px;
    }
    .ratio {
      margin-left: 30px;
      padding-top: 3px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .icon {
        width: 16px;
        height: 16px;
      }
    }
  }
  .chart-title {
    // margin-top: 24px;
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
    margin-top: 16px;
    .chart-filter {
      position: absolute;
      right: 243px;
      top: 0;
      display: flex;
      .line-filter {
        // margin-left: 48px;
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
