<script src="./historicalAuditRecordsDialog.tsx"></script>
<style lang="less" scoped>
@import '../detailOld.less';
// .dialog-container {
//   padding: 24px;
//   /deep/ .el-form-item {
//     margin: 0;
//   }
// }
.file-list-item {
  display: flex;
  align-items: center;
  // margin-bottom: 4px;
  /deep/ .btn {
    font-weight: 400;
    font-size: 12px;
    color: var(--theme-color);
    cursor: pointer;
  }
}

.order-detail-box {
  max-height: 280px;
}
.order-detail-box .grid-one-colums {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  .grid-box-item-two-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
