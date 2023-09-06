<script src="./index.tsx"></script>
<style lang="less">
.company-cascader {
  & .el-cascader-menu__wrap {
    padding: 0;
  }

  & .el-cascader-menu {
    padding: 0 10px 0 0;
    overflow: hidden;
  }
  & .el-scrollbar__bar {
    opacity: 0 !important;
  }
}
</style>
<style lang="less" scoped>
.company-modify-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /deep/.tg-breadcrumbs {
    flex-shrink: 0;
  }
  .page-content-container {
    padding: 24px 30px 18px 30px;
    flex: 1;
    overflow: auto;
    background-color: #ffffff;
    .account-box {
      border-radius: 2px;
      margin-bottom: 18px;
      padding-top: 6px;
      padding-bottom: 6px;
      background-color: rgba(164, 178, 194, 0.09);
      position: relative;
      .el-form-item--mini {
        margin-bottom: 8px;
      }
      .delete-btn {
        padding: 1px;
        border: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #d1d8e0;
        position: absolute;
        right: -5px;
        top: -5px;
        line-height: 1;
        &:hover {
          background: var(--error-color);
        }
        /deep/.el-icon-close:before {
          font-size: 12px;
          color: #ffffff;
        }
      }
    }
    .add-account-btn {
      margin: 0 0 18px;
      text-align: center;
      display: flex;
      justify-content: center;
      border: 1px dashed rgba(60, 82, 105, 0.3);
      color: var(--theme-color) !important;
      /deep/svg {
        color: var(--theme-color);
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
        color: var(--text-color);
        font-weight: 600;
        position: relative;
        padding-left: 9px;
        margin-top: 4px;
        margin-bottom: 0;
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
        .tips {
          font-size: 12px;
          color: var(--text-third-color);
          font-weight: 400;
        }
      }
      .business-license-box {
        padding-left: 10px;
        .license-item {
          display: flex;
          margin-bottom: 10px;
          .title {
            color: var(--text-second-color);
            font-size: 12px;
          }
        }
      }
    }
    .form-block-container {
      display: flex;
      //grid-column-gap: 18px;
      margin-top: 8px;
      .block-title {
        grid-column: ~'1/foo';
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: var(--text-color);
        //font-weight: 600;
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
    /deep/ .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      column-gap: 18px;
      .el-checkbox {
        margin: 0;
        height: 24px;
        line-height: 24px;
      }
    }
    /deep/ .el-checkbox {
      display: flex;
      .checkbox-p {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    /deep/ .el-form-item__error {
      text-align: left;
    }
    .resume {
      display: flex;
      margin-bottom: 8px;
      margin-top: 4px;
      .tips {
        margin-left: 12px;
        font-size: 12px;
        color: var(--text-third-color);
        line-height: 27px;
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
  }
  .options {
    width: 100%;
    height: 60px;
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 100px;
    box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.1);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    // .el-button {
    //   padding-left: 18px;
    //   padding-right: 18px;
    //   border: 1px solid rgba(60, 82, 105, 0.3);
    // }
  }
  /deep/ .el-input__inner {
    border-radius: 2px;
  }
  /deep/ .el-textarea__inner {
    border-radius: 2px;
  }
}
</style>
