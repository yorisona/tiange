<script src="./index.tsx"></script>
<style lang="less" scoped>
.table-box {
  a {
    font-size: 12px;
  }
}
/deep/ .tg-label-group-label {
  width: 60px;
  margin-left: -6px;
}
.search-bar {
  .maxEllipsis140 {
    width: 140px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
.search-flex-wrapper {
  display: flex;
  .filter-box {
    flex: 1;
  }
  .btn-box {
    width: 98px;
    height: 82px;
    margin-left: 24px;
    border-left: 1px solid #e3e8ec;
  }
}
.table-box.display-picture {
  display: flex;
  column-gap: 18px;
  flex-wrap: wrap;
  row-gap: 18px;
  align-content: baseline;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 18px 18px 0 18px;
  .empty-model {
    text-align: center;
    margin: 0 auto;
  }
}
.reset-div {
  width: 64px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--text-color);
  margin-top: -3px;
  cursor: pointer;
  padding-left: 4px;
  font-weight: 600;
  &:hover {
    color: #2570f1;
  }
}
.folder-block {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 32px;
  margin-bottom: 4px;
  &.folder-block-top {
    bottom: 0;
    margin-top: -30px;
  }
}
.tg-label-group {
  padding-top: 0;
  padding-bottom: 16px;
  padding-left: 6px;
}
.check-list-picture {
  & button {
    display: inline-block;
    color: var(--text-color);
    outline: none;
    border: 0;
    padding: 0;
    text-align: center;
    width: 102px;
    cursor: pointer;
    border-radius: 2px;
    background: rgba(164, 178, 194, 0.1);
    & span {
      padding-left: 5px;
    }
    &.isActive {
      color: var(--theme-color) !important;
      background: rgba(var(--theme-rgb-color), 0.1);
      .icon {
        color: var(--theme-color) !important;
      }
    }
  }
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
  padding: 18px 18px 0 18px;
  overflow: hidden;
}
.table-box {
  flex: 1;
  overflow: hidden;
  /deep/.el-table__body tr {
    cursor: pointer;
  }
}
</style>
