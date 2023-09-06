<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-other-info-page-container {
  display: flex;
  .title {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 12px;
    color: var(--text-color);
    height: 26px;
    line-height: 26px;
    &::before {
      content: '';
      width: 3px;
      height: 14px;
      background: var(--theme-color);
      border-radius: 1px;
      margin-right: 4px;
    }
  }
  .line {
    align-self: end;
    margin: 0 16px;
    width: 2px;
    height: 298px;
    border-left: 1px dashed var(--border-line-color);
  }
  .chart-field {
    // flex: 1 0 50%;
    width: 50%;
    .filter {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      align-items: center;
      .legend-line {
        position: relative;
        &:before {
          content: ' ';
          display: inline-block;
          position: absolute;
          width: 12px;
          left: 6px;
          top: 1px;
          height: 12px;
          background: #ffffff;
          border: 1px solid var(--theme-color);
          border-radius: 50%;
        }
        &:after {
          content: ' ';
          width: 23px;
          display: inline-block;
          position: absolute;
          height: 1px;
          background: var(--theme-color);
          border-radius: 0px;
          left: 1px;
          top: 50%;
        }
        .legend-text {
          margin-left: 27px;
        }
        &.income:before {
          border: 1px solid #ff7f00;
        }
        &.income:after {
          background: #ff7f00;
        }
      }
    }
  }
  .table-container {
    // flex: 1 1 45%;
    width: calc(50% - 34px);
    .header-div {
      display: flex;
      justify-content: space-between;
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
