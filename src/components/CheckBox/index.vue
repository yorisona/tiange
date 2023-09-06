<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-checkbox {
  width: 100px;
  // 普通状态下
  /deep/.el-checkbox__inner {
    width: 16px;
    height: 16px;
    &:after {
      left: 5px;
      top: 2px;
    }
  }

  /deep/.el-checkbox__input.is-indeterminate {
    .el-checkbox__inner {
      &:before {
        left: 1px;
        top: 6px;
      }
    }
  }
}
</style>
