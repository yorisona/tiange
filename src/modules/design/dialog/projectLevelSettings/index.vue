<script src="./index.tsx"></script>
<style lang="less" scoped>
.el-form {
  .form-body {
    padding: 24px 24px;
    height: 500px;
    overflow: auto;
    overflow: overlay;
    .Select-box {
      /deep/.el-form-item__content {
        display: flex;
      }
    }
    .form-block {
      .form-block-item {
        position: relative;
        display: grid;
        grid-template-columns: auto 342px auto 62px auto;
        grid-row-gap: 18px;
        background: #f9f9f9;
        margin-bottom: 12px;
        padding: 18px;
        align-items: center;

        .close {
          cursor: pointer;
          position: absolute;
          right: -10px;
          top: -10px;
          width: 20px;
          height: 20px;
          color: var(--border-line-color);
          &:hover {
            color: var(--error-color);
          }
        }
      }
      /deep/ .form-block-item {
        .el-form-item--mini {
          margin-right: initial;
        }
        .el-form-item {
          margin-bottom: initial;
        }
        .label-auto {
          padding-left: 16px;
        }
        .label-day {
          padding-left: 8px;
        }
        .label {
          .el-checkbox__label {
            padding-left: 6px;
            font-size: 12px;
          }
        }
      }
      .coalesce {
        grid-column-end: 3 span;
      }
    }
  }
}
</style>
