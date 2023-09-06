<script src="./taskAssignmentDialog.tsx"></script>
<style lang="less">
.taskAssignmentDialog-date-picker {
  .el-time-spinner {
    display: flex;
    justify-content: center;
  }
  .el-time-spinner__item {
    &:hover {
      background: none !important;
    }
  }
  .el-time-panel {
    width: 147px;
    .el-time-spinner {
      .el-scrollbar {
        &:nth-child(2) {
          display: none;
        }
      }
    }
  }
  .is-plain {
    background: var(--theme-color);
    color: #fff;
    border: none;
    margin-right: 12px;
    &:hover {
      background: #206bea;
      color: #fff !important;
    }
  }
}
</style>
<style lang="less" scoped>
.dialog-container {
  padding: 24px;
  /deep/ .el-form-item {
    margin: 0;
  }
}
</style>
