<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px;
  color: var(--text-color);

  .el-select {
    width: 100%;
  }
  .level-info {
    display: flex;
    flex-direction: column;
    //row-gap: 16px;
    font-size: 12px;
    > span:first-child {
      margin-bottom: 12px;
    }
    .label {
      color: var(--text-third-color);
    }
  }
  .revise-box {
    display: table;
    border-spacing: 0;
    border-collapse: collapse;
    margin: 12px 0;
    .th {
      & > div {
        height: 32px !important;
        background-color: rgb(246, 246, 246);
        font-weight: 600;
      }
    }
    & > div {
      display: table-row;
      font-size: 12px;
      & > div {
        width: 33.333%;
        height: 32px;
        padding: 6px;
        display: table-cell;
        border: solid 1px rgb(234, 238, 240);
        vertical-align: middle;
        text-align: center;
      }
    }
    /deep/ .input-box {
      height: 100%;
      display: flex;
      align-items: center;
      .el-form-item {
        margin-bottom: 0 !important;
        margin-right: 0 !important;
        input {
          text-align: center !important;
        }
      }
    }
  }
}
</style>
