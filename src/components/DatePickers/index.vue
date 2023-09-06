<script src="./index.tsx"></script>
<style lang="less" scoped>
.date-box {
  .date-box-title {
    border-bottom: solid 1px #ebeef5;
    display: flex;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 20px;
    .el-date-picker__header-label {
      flex: 1;
    }
    button {
      float: none;
      margin-top: 0;
    }
  }
  .date-box-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    padding: 12px 0 0 0;
    span {
      display: block;
      padding: 20px 0;
      cursor: pointer;
      text-align: center;
      font-size: 16px;
      &:hover {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>
