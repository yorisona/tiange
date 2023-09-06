<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-container {
  .page-tips {
    display: flex;
    align-items: center;
    padding-bottom: 22px;
    color: var(--text-second-color);
    .tip {
      margin-right: 24px;
      color: var(--text-color);
    }
  }

  .dimension-box {
    &:nth-of-type(n + 1) {
      // margin-top: 18px;
    }
    .dimension-title {
      height: 40px;
      border: solid 1px #e3e8ec;
      border-bottom-style: none;
      display: flex;
      align-items: center;
      padding: 0 18px;
      .dimension-name {
        flex: 1;
        color: var(--text-color);
        display: flex;
        align-items: center;
        .tips {
          display: flex;
          align-items: center;
          color: var(--text-third-color);
          font-size: 12px;
          margin-left: 6px;
          .icon {
            font-size: 16px;
          }
        }
      }
      .dimension-operate {
        display: flex;
        align-items: center;
        .split {
          display: block;
          width: 1px;
          height: 12px;
          background: rgba(164, 178, 194, 0.3);
          margin: 0 12px;
        }
        .icon {
          font-size: 18px;
          cursor: pointer;
          color: #a4b2c2;
        }
      }
    }
    .dimension-footer {
      border: solid 1px #e3e8ec;
      border-top-style: none;
      padding: 12px 12px;
    }
    /deep/ .el-table {
      .el-table__empty-block {
        display: none;
      }
      thead > tr > th,
      .tg-body-container .el-table thead > tr > th {
        padding-top: 0;
        padding-bottom: 0;
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>
