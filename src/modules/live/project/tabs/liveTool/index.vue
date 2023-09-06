<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-live-tool-page-container {
  min-width: 1264px;
  .filter-field {
    background: white;
    //min-width: 1264px;
    .el-form {
      display: flex;
      padding: 16px 16px 0;
    }
  }
  .sort-field {
    color: var(--text-second-color);
    display: flex;
    align-items: center;
    padding: 16px 16px 12px;
    .sort-list {
      border: 1px solid var(--border-line-other-color);
      display: flex;
      background: #f9fcff;
      .item {
        padding: 8px 12px;
        display: block;
        cursor: pointer;
        &[active] {
          color: var(--theme-color);
          background: white;
          border-left: 1px solid var(--border-line-other-color);
          border-right: 1px solid var(--border-line-other-color);
        }
        &:first-of-type {
          border-left: none !important;
        }
        &:last-of-type {
          border-right: none !important;
        }
      }
    }
    .tips {
      margin-left: 18px;
      display: flex;
      align-items: center;
      line-height: 18px;
      .icon {
        color: var(--theme-color);
        font-size: 14px;
        width: 16px;
        height: 16px;
      }
      .desc {
        margin-left: 4px;
        color: var(--text-third-color);
      }
    }
  }
  .list-field {
    padding: 0 16px 28px;
    flex: 1;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 36px 1fr;
    overflow: hidden;
    .shop-goods-list,
    .plugin-goods-list {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
