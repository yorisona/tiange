<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-02 15:00:21
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-profix-loss-statement-page-container {
  /deep/.el-select .el-tag {
    max-width: 145px;
  }
  .depart-select-box {
    border-radius: 2px;
    border: 1px solid var(--border-line-color);
    padding: 0 10px;
    line-height: 27px;
    height: 28px;
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    width: 244px;
    flex: 1;
    &:hover {
      /deep/ .el-icon-circle-close {
        color: #c0c4cc !important;
      }
      border-color: #5c82ff;
    }
  }
  .filter-field {
    display: flex;
    flex-flow: wrap;
    // grid-template-columns: repeat(auto-fit, 314px);
    // column-gap: 12px;
    // row-gap: 12px;
    padding: 4px 4px 16px 16px;
    background-color: white;
    .department-tree-icon-arrow {
      width: 25px;
      height: 100%;
      line-height: 27px;
    }
    /deep/ .department-input {
      > input {
        cursor: pointer;
        caret-color: transparent;
      }
    }
  }
  .update-div {
    display: flex;
    justify-content: flex-end;
    background: white;
    padding: 12px 16px 8px;
    align-items: center;
    .update-time {
      color: var(--text-third-color);
      font-size: 12px;
      // line-height: 32px;
      background: white;
    }
  }

  .table-field {
    flex: 1;
    background-color: white;
    overflow: hidden;
    .table-container {
      height: 100%;
      padding: 0 16px 32px;
    }
  }
  .repain-select250 {
    display: flex;
    width: 244px;
    position: relative;
    align-items: center;
    /deep/ .el-button {
      width: 244px;
      height: 28px;
      // margin-top: -6px;
      padding: 0 10px;
      text-align: left;
      position: relative;
      top: 1px;
      font-weight: normal;
      &:hover {
        border-color: #c0c4cc !important;
      }
    }
    /deep/ .select-icon {
      // margin-top: 4px;
      // position: absolute;
      margin-left: -25px;
      color: #c0c4cc;
      font-size: 14px;
      transform: rotate(0deg);
      transition: transform 0.2s linear;
    }
    .select-icon-rotate {
      transform: rotate(-180deg);
      transition: transform 0.2s linear;
    }

    .el-button {
      color: var(--text-color);
      &:focus {
        border-color: #dcdfe6;
      }
    }
    .el-button.el-button--default:not([disabled]):not(.is-disabled):not(.el-button--primary):hover {
      color: var(--text-color);
      /* color: var(--theme-color); */
    }
    /deep/ .el-checkbox__inner::after {
      top: 2px;
      left: 5px;
    }
  }
}
.user-serch-popper {
  max-height: 360px;
  overflow-y: auto;
  overflow-y: overlay;
  .tree-container {
    /deep/ .el-checkbox__inner::after {
      top: 2px;
      left: 5px;
    }
    /deep/ .el-tree-node__label {
      font-size: 12px;
    }
  }
}
</style>

<style lang="less">
.profit-loss-statement-department-tree-popper {
  max-height: 360px;
  overflow-y: auto;
}
</style>
