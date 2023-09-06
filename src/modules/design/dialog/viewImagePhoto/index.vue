<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px 24px 24px;

  .form-search {
    /deep/ .el-form {
      display: flex;
      align-items: center;

      .el-select,
      .el-input {
        width: 100%;
      }

      .el-form-item {
        display: flex;
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
          flex: 1;

          .el-form-item__content {
            width: auto;
          }
        }

        .el-form-item__label {
          white-space: nowrap;
        }

        .el-form-item__content {
          width: 160px;
        }
      }
    }
  }

  .form-body {
    /deep/ .tg-calendar-custom {
      .tg-calendar-custom-td {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img.des {
        cursor: pointer;
        width: 40%;
        height: 70px;
      }
    }

    /deep/ .el-calendar {
      .el-calendar__header {
        display: none;
      }

      .el-calendar__body {
        .el-calendar-table {
          border-collapse: collapse;

          thead th {
            border: 1px solid #ebeef5;
          }
        }
      }
    }
  }
}
</style>
