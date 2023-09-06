<script src="./editAuthorization.tsx"></script>
<style lang="less" scoped>
.el-tree {
  color: var(--text-color);
  /deep/.el-tree-node__expand-icon {
    cursor: pointer;
    color: #a4b2c2;
    font-size: 14px;
  }
}
/deep/.el-checkbox .el-checkbox__label {
  font-size: 12px;
}
/deep/ .el-tree__empty-text {
  color: #c1c1c1;
}
/deep/ .el-tree-node__children[role='group'] {
  .el-tree-node__children[role='group'] {
    width: 388px;
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
.editAuthorization-box {
  padding: 16px 24px;
  font-size: 12px;
  .header-box {
    display: grid;
    grid-template-columns: 70px 1fr;
    grid-column-gap: 12px;
    margin-bottom: 12px;
    .headPortrait {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
      }
    }
  }
  .header-itme {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    align-items: center;
    grid-template-rows: repeat(2, minmax(0, 28px));
    // grid-row-gap: 12px;
    & > div {
      height: 10px;
    }
    .label {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-third-color);
    }
    .value {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-color);
    }
  }
  .confirmReplication {
    font-weight: 400;
    font-size: 12px;
    color: var(--theme-color);
    margin-left: 10px;
    cursor: pointer;
  }
  .permissionList-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 16px;
  }
  .line {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, #e5e5e5 0%, #e5e5e5 50%, transparent 50%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
    margin-top: 4px;
    margin-bottom: 12px;
  }
  .wrap-box {
    height: 336px;
    border: 1px solid var(--border-line-color);
    border-radius: 4px;
    overflow: hidden;
    padding: 12px 0 16px 16px;
    .tree-box {
      height: 85%;
      overflow: auto;
      margin-left: -10px;
    }
  }
}
</style>
