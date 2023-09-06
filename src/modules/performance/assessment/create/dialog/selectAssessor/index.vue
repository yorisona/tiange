<script src="./index.tsx"></script>
<style lang="less" scoped>
.assessor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .search {
    padding: 16px 18px;
    border-bottom: solid 1px var(--border-line-div-color);
  }
  .body {
    padding: 10px 18px;
    flex: 1;
    overflow: auto;
    .el-radio-group {
      flex-direction: column;
      align-items: stretch;
    }

    .assessor-item {
      padding: 12px 0;
      border-bottom: solid 1px var(--table-border-color);
      /deep/ label {
        width: 100%;
        .el-radio__label {
          font-size: 12px;
        }
      }
    }
  }
  .footer {
    padding: 0 24px;
    height: 50px;
    background: #f4f8ff;
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
