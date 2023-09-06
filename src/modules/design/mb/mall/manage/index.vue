<script src="./index.tsx"></script>
<style lang="less" scoped>
/deep/ .el-table {
  .operator-btns {
    .tg-btn-link {
      margin-right: 8px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  // .el-table__row {
  //   cursor: pointer;
  // }
}

.mall-manage {
  /deep/.el-table {
    .good {
      object-fit: cover;
      width: 80px;
      height: 80px;
    }
  }
}
</style>
