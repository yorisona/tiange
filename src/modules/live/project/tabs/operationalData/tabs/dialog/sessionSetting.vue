<script src="./sessionSetting.tsx"></script>
<style lang="less" scoped>
.dialog-wrap {
  background-color: #fff;
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 3px !important;
  }
  .time-wrap {
    display: flex;
    align-items: center;
    .identification {
      margin-left: 10px;
    }
  }
  .tip {
    font-weight: 400;
    font-size: 12px;
    color: #ff7a36;
    padding: 12px 24px 12px 15px;
    background: #fff7f3;
    margin-bottom: 20px;
    display: flex;
    gap: 4px;
    .tip-icon {
      font-size: 14px;
    }
  }
  .grid-box {
    display: grid;
    grid-template-columns: 144px 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 17px;
    max-height: 300px;
    overflow: auto;
    .ico-btn-delete {
      font-size: 16px;
      color: var(--disabled-color);
      cursor: pointer;
      margin-left: 6px;
    }
  }
  .grid-title {
    display: grid;
    grid-template-columns: 144px 1fr;
    grid-column-gap: 8px;
    margin-bottom: 8px;
  }
  .container {
    padding: 0 0 24px 24px;
  }
}
</style>
