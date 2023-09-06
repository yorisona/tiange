<script src="./index.tsx"></script>
<style lang="less" scoped>
.table-box {
  a {
    font-size: 12px;
  }
}
.folder-block {
  display: flex;
  justify-content: center;
  &.folder-block-top {
    width: 200px;
    margin: -30px auto 12px;
  }
}
.tg-label-group {
  padding-top: 0;
  padding-bottom: 16px;
}
.popover-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
}
.range-box {
  border: 1px solid var(--border-line-color);
  border-radius: 2px;
  height: 28px;
  .tg-input-range {
    border: 0;
    /deep/ .el-input,
    /deep/ .el-input .el-input__inner {
      height: 25px;
    }
  }
  .input-range {
    display: flex;
    background: #ffffff;
    border: 0;
    width: 150px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
}
.good-area-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.co-status {
  display: flex;
  .point {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 7px;
    margin-right: 5px;
    &.fail {
      background: rgba(var(--fail-rgb-color), 0.6);
    }
    &.success {
      background: #33ba5d;
    }
    &.process {
      background: #ff955f;
    }
    &.block {
      background: #f04b4b;
    }
  }
  .success {
    color: var(--text-color);
  }
  .fail {
    color: var(--text-color);
  }
}
.mtg-card {
  background-color: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 0 16px;
  overflow: hidden;
}
.table-box {
  flex: 1;
  overflow: hidden;
  /deep/.el-table__body tr {
    cursor: default;
  }
}
</style>
