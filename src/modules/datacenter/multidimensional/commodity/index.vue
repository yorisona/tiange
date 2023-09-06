<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-page-container {
  .header {
    background-color: #ffffff;
    padding: 16px 0 4px 16px;
    .form-item-container {
      display: flex;
      flex-wrap: wrap;
      .form-item {
        flex: 0 0 278px;
        overflow: hidden;
        &.query-operator-item {
          flex: 1 0 318px;
        }
      }
    }
  }
  .screening-area {
    padding: 24px 16px 0 16px;
  }
  .page-body {
    margin: 12px 16px;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;

    .chart-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 16px 16px;
      grid-template-rows: repeat(auto-fit, 400px);
    }
    .no-data {
      flex: 1 1 0%;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 12px;
    }
    .tg-btn {
      align-self: flex-start;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  /deep/.tg-btn[disabled] {
    .ico-btn-add {
      color: rgba(255, 255, 255, 0.5) !important;
    }
  }
}
</style>
<style lang="less">
.tg-color-classified-dialog-custom {
  .el-dialog__body {
    overflow-x: hidden;
    overflow-y: overlay;
  }
}
</style>
