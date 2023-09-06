<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-shop-goods-list-page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header-field {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      .title {
        display: flex;
        align-items: center;
        &:before {
          content: '';
          width: 3px;
          margin-right: 6px;
          height: 14px;
          background: #2877ff;
          display: inline-block;
        }
      }
    }
  }
  .goods-field {
    flex: 1;
    //margin-top: 12px;
    width: 100%;
    background: white;
    padding: 18px;
    overflow-y: auto;
    .goods-item {
      padding-bottom: 16px;
      &:not(:first-of-type) {
        margin-top: 16px;
      }
      &:not(:last-of-type) {
        border-bottom: 1px solid var(--border-line-other-color);
      }
    }
  }
  .pagination-field {
    background: white;
    width: 100%;
    border-top: 1px solid var(--border-line-other-color);
    .el-pagination {
      margin: 16px 18px;
    }
  }
}
</style>
