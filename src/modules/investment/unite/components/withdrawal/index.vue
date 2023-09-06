<script src="./index.tsx"></script>

<style lang="less" scoped>
/deep/.invoice-upload-list {
  .file-item {
    max-width: 350px;
  }
}
.withdrawal-unite {
  .withdrawal-table {
    height: calc(100vh - 168px);
    .total-box {
      display: flex;
      .total-num {
        display: flex;
        line-height: 30px;
        .label-value {
          margin-left: 35px;
          .label {
            font-size: 12px;
            color: var(--text-third-color);
          }
          .value {
            font-size: var(--small-font-size);
            color: var(--text-color);
            font-weight: 400;
            &.orange {
              color: #ff7a36;
            }
          }
        }
      }
    }
  }
  /deep/.withdrawal-table {
    .tg-card-bd {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .table-full {
      flex: 1;
      overflow: hidden;
    }
  }

  /deep/.el-table tbody > tr > td {
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
  }
  /deep/ .el-table {
    .status-box {
      display: flex;
      align-items: center;
      justify-content: center;
      .status {
        margin-right: 6px;
        cursor: default;
        color: var(--text-des-color);
        &.status-part {
          color: #ff7a36;
        }
      }
      svg {
        width: 16px;
        height: 16px;
        cursor: pointer;
        color: #6a7b92;
      }
      .svg {
        width: 16px;
        height: 16px;
        visibility: hidden;
      }
    }
  }
}
</style>
<style lang="less">
.popper-table-unite {
  .el-table__cell {
    font-size: 12px;
    line-height: 20px;
    padding: 7px 0;
  }
  thead > tr > th > .cell {
    line-height: 20px;
    padding: 0;
  }
}
</style>
