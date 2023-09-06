<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-modify-selection-goods-page-container {
  padding: 18px 18px 24px;
  .goods-info-container {
    display: flex;
    .el-image {
      width: 70px;
      height: 70px;
      border-radius: 2px;
    }
    .goods-info {
      margin-left: 10px;
      flex: 1;
      .detail-info {
        margin-top: 6px;
        display: grid;
        gap: 6px;
        color: #888888;
        grid-template-columns: 120px 150px 1fr;
        > div {
          &:nth-child(2) {
            grid-column: span 2;
          }
        }
      }
    }
  }
  .el-form {
    margin-top: 16px;
    .el-form-item {
      margin-right: 0;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
