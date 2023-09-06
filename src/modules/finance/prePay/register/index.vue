<script src="./index.tsx"></script>

<style lang="less">
.information-div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .tg-btn-link {
    margin-right: 8px;
    &:last-of-type {
      margin-right: 0;
    }
  }
  .red-btn {
    color: var(--error-color);
  }
}
.gm-generally-search-bar .el-checkbox__input {
  margin-top: -1px;
  .el-checkbox__inner {
    width: 12px;
    height: 12px;
    &::after {
      top: 1px;
      width: 3px;
      height: 6px;
      left: 4px;
    }
  }
}
</style>
