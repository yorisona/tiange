<script src="./index.tsx"></script>
<style lang="less" scoped>
.other-info {
  padding: 18px 30px;
  height: 100%;
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
  .form-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
    .block-title {
      grid-column: ~'1/foo';
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-color);
      position: relative;
      padding-left: 9px;
      margin-top: 6px;
      &.star {
        &::before {
          content: '*';
          position: absolute;
          left: 0;
          display: inline-block;
          height: 14px;
          color: var(--error-color);
        }
      }
    }
  }
  /deep/.el-input-group__append,
  .el-input-group__prepend {
    padding: 0 12px !important;
  }
  /deep/ .el-form-item__label {
    color: var(--text-second-color);
    font-size: 12px;
    height: 22px;
    line-height: 18px;
    padding-bottom: 6px;
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

  .form-block-container {
    display: grid;
    grid-template-columns: repeat(4, 210px);
    margin-top: 18px;
    .block-title {
      grid-column: ~'1/foo';
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: var(--text-color);
      font-weight: 600;
      position: relative;
      padding-left: 9px;
      &::before {
        content: '';
        position: absolute;
        top: 13px;
        left: 0;
        display: inline-block;
        width: 3px;
        height: 14px;
        background: var(--theme-color);
      }
    }
  }

  .upload-tips {
    color: var(--text-third-color);
  }
  .cases {
    font-size: 12px;
    color: var(--theme-color);
    display: flex;
    .label {
      color: var(--text-third-color);
    }
    .text {
      color: var(--text-color);
      margin-right: 24px;
      margin-left: 6px;
    }
    .edit {
    }
  }
  .resume {
    display: flex;
    margin-bottom: 14px;
    margin-top: -6px;
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
      width: 14px;
      height: 14px;
      &:nth-child(1) {
        height: 16px;
      }
    }
    span {
      padding: 0 6px 0 4px;
    }
  }
  /deep/ .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    column-gap: 18px;
    .el-checkbox {
      margin: 0;
    }
  }
  /deep/ .el-form-item__error {
    text-align: left;
  }
  .file-list {
    width: 270px;
    height: 140px;
    & > div {
      display: block;
      width: 100%;
      height: 100%;
    }
    /deep/ .el-upload {
      width: 100%;
      height: 100%;
    }
    .upload-btn {
      border-radius: 2px;
    }
    .file {
      height: 140px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .icon {
        position: absolute;
        right: -7px;
        top: -7px;
        width: 14px;
        height: 14px;
        cursor: pointer;
        font-size: 14px;
      }
    }

    .upload-preview {
      width: 270px;
      height: 140px;
      border-radius: 2px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: scale-down;
      }
    }
    .upload-btn {
      width: 100%;
      height: 140px;
      border: dashed 1px rgba(164, 178, 194, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .star:before {
        content: '*';
        color: var(--error-color);
      }
      i {
        font-size: 28px;
        width: 28px;
        height: 28px;
        display: block;
        margin-bottom: 8px;
      }
      font-size: 12px;
      color: var(--text-second-color);
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
