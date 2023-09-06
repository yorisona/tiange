<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px 18px 18px 18px;

  /deep/ .multiple-height {
    &.el-select--mini {
      height: auto !important;
    }
    .el-input--mini {
      height: auto !important;
    }
  }

  .push-count {
    font-size: 12px;
    line-height: 28px;
  }

  .preview {
    color: var(--theme-color);
    cursor: pointer;
  }
}
</style>
