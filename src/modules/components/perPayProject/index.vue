<script src="./index.tsx"></script>

<style lang="less">
.prepay-container {
  background: transparent;
  overflow: auto;
  overflow: overlay;

  .prepay-filter-form {
    .prepay-filter-form-div {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 190px;
      }
      .btns {
        .el-form-item {
          width: 170px;
        }
      }
      .reverse-div {
        align-self: center;
        margin-bottom: 12px;
        .el-checkbox__input {
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
      }
      .prepay-filter-form-item:first-child {
        .el-form-item {
          width: 254px;
        }
      }
    }
  }
  .red-btn {
    color: var(--error-color);
  }
  .information-div {
    .tg-btn-link {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
