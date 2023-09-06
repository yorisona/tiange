<script src="./batchAuthorization.tsx"></script>
<style lang="less">
.tg-dialog-wrapper {
  .tg-dialog.title-only {
    .tg-dialog-btns {
      .tg-btn.tg-btn-default:first-child {
        margin-right: 12px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.el-tree {
  color: var(--text-color);
  margin-top: 8px;
  margin-left: -10px;
  /deep/.el-tree-node__expand-icon {
    cursor: pointer;
    color: #a4b2c2;
    font-size: 14px;
  }
}
/deep/ .el-tree__empty-text {
  color: #c1c1c1;
}
/deep/ .el-tree-node__children[role='group'] {
  .el-tree-node__children[role='group'] {
    width: 378px;
    margin-left: 46px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: inherit;
    .el-tree-node__content {
      padding-left: 0 !important;
      .el-tree-node__expand-icon.is-leaf {
        width: 0;
        color: transparent;
      }
    }
  }
  // display: flex;
  // flex-wrap: wrap;
  .el-tree-node__content:hover {
    background-color: transparent;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent !important;
  }
}
/deep/.el-tree-node__content:hover {
  background-color: transparent;
}
/deep/ .el-checkbox {
  margin: 0;
  // font-weight: normal;
  // &:first-of-type {
  //   margin-left: 0;
  // }
  .el-checkbox__label {
    font-weight: 400;
    font-size: 12px;
    color: var(--text-color);
    letter-spacing: 0;
  }
}
.batchAuthorization {
  width: 1000px;
  padding: 16px 24px 21px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
  .subtitle {
    margin-bottom: 12px;
  }
}
.batchAuthorization-wrap {
  display: grid;
  grid-template-columns: 460px 1fr;
  grid-gap: 17px;
  .line {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, #e5e5e5 0%, #e5e5e5 50%, transparent 50%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
    // margin-top: 4px;
    margin-bottom: 16px;
  }
  .wrap-box {
    height: 490px;
    padding: 15px;
    overflow: auto;
    border: 1px solid var(--border-line-color);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .rt-box {
    display: flex;
    flex-direction: column;
    .rt-top {
      height: 148px;
      .btn-box {
        display: flex;
        align-items: center;
        // padding-left: 8px;
        .download {
          font-weight: 400;
          font-size: 12px;
          color: var(--theme-color);
          cursor: pointer;
        }
      }
      .subtitle {
        margin: 8px 0 16px;
        text-align: left;
        padding-left: 106px;
        color: #c1c1c1;
      }
      .edit-box {
        display: flex;
        align-items: center;
        .editBtn {
          font-weight: 400;
          font-size: 12px;
          color: var(--theme-color);
          margin-left: 12px;
          cursor: pointer;
        }
      }
    }
    .delete-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      .deleteBtn {
        font-weight: 400;
        color: var(--theme-color);
        line-height: 14px;
        cursor: pointer;
      }
    }
    .rt-bottom {
      flex: 1;
      overflow: auto;
      /deep/ .el-checkbox {
        margin: 0;
        // font-weight: normal;
        // &:first-of-type {
        //   margin-left: 0;
        // }
        .el-checkbox__label {
          font-weight: 400;
          font-size: 12px;
          color: var(--text-color);
          letter-spacing: 0;
        }
      }
      .checkBox-wrap {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        grid-row-gap: 10px;

        font-weight: 400;
        font-size: 12px;
        color: var(--text-color);
        letter-spacing: 0;
      }
    }
  }
}
</style>
