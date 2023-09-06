<script src="./LegalBulletinBoard.tsx"></script>
<style lang="less" scoped>
.depart-select-box {
  border-radius: 2px;
  border: 1px solid var(--border-line-color);
  padding: 0 4px 0 10px;
  line-height: 27px;
  height: 28px;
  display: flex;
  justify-content: space-between;
  width: 184px;
  flex: 1;
  font-size: 12px;
  &:hover {
    /deep/ .el-icon-circle-close {
      color: #c0c4cc !important;
    }
    border-color: #5c82ff;
  }
}
/deep/ .el-range-editor.el-input__inner {
  padding: 0 4px 0 10px !important;
}

.content-main {
  .chart-box {
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 16px;
    max-width: 1700px;
    .chart-box-item {
      // height: 380px;
      padding: 12px 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--border-line-div-color);
      border-radius: 8px;
      .nums-box {
        display: flex;
        width: 100%;
        align-items: center;
        .line {
          width: 1px;
          height: 32px;
          border-right: 1px solid var(--border-line-div-color);
        }
        .nums-box-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .nums-title {
            font-weight: 400;
            font-size: var(--default-font-size);
            color: var(--text-second-color);
            letter-spacing: 0;
            text-align: center;
            margin-bottom: 2px;
          }
          .nums-num {
            font-weight: 400;
            font-size: 20px;
            color: var(--text-color);
            letter-spacing: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .list-box {
    // border: 1px solid var(--border-line-div-color);
    // border-radius: 2px;
    .pagination {
      /*margin: 8px 0;*/
    }
  }
}
</style>
<style lang="less">
.project-fund-statement-tree-popper {
  max-height: 360px;
  overflow-y: auto;
}
</style>
