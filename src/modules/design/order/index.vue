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
  margin-bottom: 10px;
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
.box {
  min-width: 1200px;
  .empty {
    background: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .list-box {
    padding: 12px 20px;
    display: grid;
    // grid-template-columns: repeat(5, 225px);
    // grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(auto-fill, 225px);
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    .item {
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      padding: 12px;
    }
  }
}
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  height: 60px;
  background-color: #ffffff;
  margin-bottom: 12px;
  overflow: hidden;
  .formBox {
    display: flex;
    /deep/.el-form-item {
      .el-form-item__label {
        font-weight: 400;
        font-size: 14px;
        color: #646566;
      }
      flex: 0 0 278px;
      margin-bottom: 0;
      .el-input__inner {
        width: 200px;
      }
    }
  }
  .button-group {
    .redDot {
      position: relative;
      &::after {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #ff4d4f;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        right: 10px;
      }
    }
    .el-button:focus,
    .el-button:hover {
      color: var(--theme-color);
      border: 1px solid #4e8fff;
      background: #e9f1ff;
    }

    .active {
      color: var(--theme-color);
      border: 1px solid #4e8fff;
      background: #e9f1ff;
      font-weight: 500;
      font-size: 14px;
      color: var(--theme-color);
      z-index: 1;
    }
  }
}
</style>
