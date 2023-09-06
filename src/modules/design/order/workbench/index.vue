<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-container {
  /deep/ .gm-generally-search-bar {
    margin-bottom: 0;
  }
  /deep/ .gm-generally-form {
    padding-right: 16px;
    .gm-generally-form-item {
      flex: 0 0 204px !important;
      // &:nth-child(1) {
      //   flex: auto;
      // }
    }
    // .gm-generally-form-item-buttons {
    //   flex: 0 0 auto;
    // }
    // .el-radio-group {
    //   width: auto;
    //   column-gap: 0;
    // }
  }
  .group {
    width: 100%;
    background-color: #fff;
    margin-top: 12px;
    padding-left: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    /deep/ .el-radio-group {
      width: auto;
      column-gap: 0;
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #2570f1;
      }
    }
  }
}
.subscript-box {
  position: relative;

  .subscript {
    position: absolute;
    background-color: #ff4545;
    width: 6px;
    height: 6px;
    top: 0;
    right: -6px;
    border-radius: 6px;
    text-indent: -777px;
  }
}
.body-container {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;

  &.empty {
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .card-box {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
    padding-top: 12px;
    align-items: flex-start;
    justify-content: flex-start;
    .design-card {
      margin-right: 16px;
      margin-bottom: 16px;
      flex: 0 0 auto;
      cursor: pointer;
    }
  }
}
.pagination {
  background-color: #ffffff;
  /deep/ .el-pagination {
    margin: 15px 20px 23px 20px;
  }
}
/deep/.el-table {
  .type-name,
  .project-name {
    .cell {
      font-family: PingFang SC, Microsoft Yahei, Microsoft Sans Serif, Hiragino Sans GB, Tahoma,
        Arial, serif;
    }
  }
  tr td {
    cursor: pointer;
  }
}
.initiate-box {
  display: flex;
  align-items: center;
  height: 52px;
  background-color: #ffffff;
  padding: 0 16px;
  margin-bottom: 1px;
}
.depart-select-box {
  border-radius: 2px;
  border: 1px solid rgba(164, 178, 194, 0.5);
  padding: 0 10px;
  line-height: 27px;
  height: 28px;
  display: flex;
  justify-content: space-between;
  // width: 210px;
  flex: 1;
  font-size: 12px;
  &:hover {
    /deep/ .el-icon-circle-close {
      color: #c0c4cc !important;
    }
    border-color: #5c82ff;
  }
}
.query-field {
  padding: 16px 16px 4px;
  background: white;
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 270px;
      input {
        font-size: 12px;
      }
      .el-form-item__label {
        font-size: 12px;
      }
      &:last-of-type {
        width: auto;
      }
    }
  }
}
</style>
