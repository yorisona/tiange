<script src="./index.tsx"></script>
<style lang="less" scoped>
.base-info {
  height: 100%;
  padding: 12px 30px;
  padding-bottom: 60px;
  overflow: auto;
  .warning-box {
    height: 40px;
    background: rgba(var(--warning-rgb-color), 0.06);
    border: 1px solid rgba(var(--warning-rgb-color), 0.5);
    border-radius: 2px;
    display: flex;
    margin-bottom: 20px;
    line-height: 40px;
    i {
      color: var(--warning-color);
      margin: 14px 7px 0 15px;
    }
    span {
      font-size: 12px;
      color: var(--text-color);
    }
  }
  .mgt-30 {
    margin-top: 12px;
  }
  .form-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 80px;
    .flex-line-box {
      column-gap: 0;
    }
  }
  .base-item-title {
    height: 40px;
    line-height: 40px;
    margin-bottom: 4px;
    display: inline-block;
    .star {
      color: var(--error-color);
    }
    .title {
      font-size: 12px;
      color: var(--text-color);
      font-weight: 600;
    }
    .tips {
      font-size: 12px;
      color: var(--text-third-color);
    }
  }
  .base-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 210px));
    grid-column-gap: 24px;
    grid-row-gap: 18px;
  }
  /deep/.el-input__inner {
    border-radius: 2px !important;
  }
  .input-more {
    /deep/.el-input__inner {
      border-radius: 2px 0 0 2px !important;
    }
    /deep/.el-input-group__append {
      border-radius: 0 2px 2px 0 !important;
    }
  }

  .upload-tips {
    color: var(--text-third-color);
  }
  .cases {
    color: var(--theme-color);
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    margin-top: 6px;
    .labels {
      color: var(--text-third-color);
      width: 45px;
      text-align: right;
    }
    .text {
      color: var(--text-color);
      margin-right: 18px;
      margin-top: 5px;
      max-width: calc(100% - 105px);
      line-height: 14px;
      overflow: hidden;
      max-height: 40px;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .operation {
      cursor: pointer;
      width: 10px;
    }
    .case-edit {
      color: var(--text-third-color);
    }
    .case-delete {
      color: var(--text-third-color);
      font-size: 22px;
      padding-top: 7px;
    }
  }
  .resume {
    display: flex;
    margin-bottom: 14px;
    .tips {
      margin-left: 12px;
      font-size: 12px;
      color: var(--text-third-color);
      line-height: 1.2;
    }
  }
  .resume-list {
    display: flex;
    align-items: center;
    row-gap: 14px;
    color: var(--text-color);
    svg {
      width: 20px;
      height: 20px;
      &:nth-child(1) {
        height: 20px;
      }
    }
    span {
      padding: 0 6px 0 4px;
    }
  }
  /deep/ .el-form-item__label {
    font-size: 12px;
    height: 22px;
    line-height: 18px;
    padding-bottom: 6px;
  }
  /deep/ .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    column-gap: 18px;
    .el-checkbox {
      margin: 0;
    }
  }
  /deep/ .el-checkbox {
    display: flex;
    .checkbox-p {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 28px;
      color: var(--text-color);
    }
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: var(--text-second-color);
  }
  /deep/ .el-form-item__error {
    text-align: left;
  }
  .file-list {
    margin-left: 8px;
    margin-top: 24px;
    display: flex;
    column-gap: 18px;
    flex-wrap: wrap;
    row-gap: 18px;
    .upload-btn {
      border-radius: 2px;
    }
    .file-wrapper {
      width: 134px;
      height: 134px;
      margin-top: 23px;
      position: relative;

      .file {
        width: 120px;
        height: 120px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        border: 1px solid var(--border-line-color);

        img {
          width: 100%;
        }
      }
      .icon {
        position: absolute;
        right: 7px;
        top: -7px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        font-size: 16px;
        color: #d1d8e0;
        border-radius: 50%;
        background-color: #fff;

        &:hover {
          color: #f04b4b !important;
        }
      }
    }

    .upload-btn {
      width: 120px;
      height: 120px;
      border: dashed 1px var(--border-line-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      i {
        font-size: 28px;
        width: 28px;
        height: 28px;
        display: block;
        margin-bottom: 8px;
      }
      font-size: 12px;
      color: var(--text-third-color);
    }
  }
}
.options {
  width: 100%;
  height: 60px;
  box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  z-index: 20;
  bottom: 0;
  overflow-y: hidden;
}
</style>
