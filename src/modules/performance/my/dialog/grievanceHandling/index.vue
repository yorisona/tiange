<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 18px 24px 18px 24px;
  color: var(--text-color);

  .el-select {
    width: 100%;
  }

  .level-info {
    display: flex;
    flex-direction: column;

    & > div {
      margin-top: 18px;

      &:first-child {
        margin-top: 0;
      }
    }

    .label {
      color: var(--text-third-color);
    }

    .block {
      display: flex;
      flex-direction: column;
    }

    /deep/ .upload-file-list {
      .file-item {
        margin-top: 2px;
        width: 100%;

        .file-name {
          flex: none;
          white-space: nowrap;
          overflow: hidden;
          max-width: 320px;
        }
      }
    }
  }

  .adjustTheResult {
    padding-top: 18px;
    margin-bottom: 0px;
  }

  .radio-group {
    min-height: 32px;
    display: flex;
    align-items: center;
    padding-left: 12px;
  }

  .revise-box {
    display: table;
    border-spacing: 0;
    border-collapse: collapse;
    margin: 12px 0 4px 0;

    .th {
      & > div {
        height: 37px !important;
        background-color: rgb(246, 246, 246);
        font-weight: 600;
      }
    }

    & > div {
      display: table-row;

      & > div {
        width: 33.333%;
        height: 40px;
        padding: 6px;
        display: table-cell;
        border: solid 1px rgb(234, 238, 240);
        vertical-align: middle;
        text-align: center;
      }
    }

    /deep/ .input-box {
      height: 100%;
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;

        input {
          text-align: center !important;
        }
      }
    }
  }
}
</style>
