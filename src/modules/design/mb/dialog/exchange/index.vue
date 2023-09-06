<script src="./index.tsx"></script>
<style lang="less" scoped>
.exchangeGoods {
  padding: 24px 24px 0 24px;
  color: var(--text-color);

  .good-image {
    display: block;
    width: 350px;
    height: 350px;
    margin-bottom: 12px;
  }
  .good-name {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 600;
  }
  .good-desc {
    padding-top: 4px;
    font-size: 12px;
    color: var(--text-third-color);
    line-height: 17px;
  }
  .good-prize {
    padding: 12px 0 16px 0;
    /deep/ svg {
      color: #ffb703;
      margin-right: 6px;
      font-size: 16px;
    }
  }
  /deep/.el-form-item {
    margin-right: 0 !important;
    display: flex;
    font-size: 12px;
    label {
      width: auto !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      flex: 1;
      font-size: 12px;
      display: flex;
      align-items: center;
    }
    &.noline {
      .el-form-item__label {
        color: var(--text-third-color) !important;
      }
      line-height: 1;
    }
  }
  .ico-Mbi {
    &:hover {
      color: #ffb703 !important;
    }
  }
}
</style>
