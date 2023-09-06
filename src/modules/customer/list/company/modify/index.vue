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
  overflow-x: hidden;
  /deep/.tg-breadcrumbs {
    flex-shrink: 0;
  }
  .page-content-container {
    padding: 16px 24px;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
    background-color: #ffffff;
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
        margin-top: 8px;
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
      .flex-line-box {
        .store-box {
          height: 55px;
          position: relative;
          .delete-store-btn {
            width: 18px;
            height: 18px;
            visibility: hidden;
            padding: 1px;
            position: absolute;
            right: -7px;
            top: 14px;
            border: none;
            background: #d1d8e0;
            line-height: 1;
            &:hover {
              background: var(--error-color);
            }
            /deep/.el-icon-close:before {
              font-size: 12px;
              color: #ffffff;
            }
          }
          &:hover {
            .delete-store-btn {
              visibility: visible;
            }
          }
        }
      }
      .shop-list-box {
        position: relative;
        max-width: 1395px;
        min-width: 680px;
        .delete-shop-btn {
          padding: 1px;
          border: none;
          width: 16px;
          height: 16px;
          background: #d1d8e0;
          position: absolute;
          right: -7px;
          top: -10px;
          line-height: 1;
          &:hover {
            background: var(--error-color);
          }
          /deep/.el-icon-close:before {
            font-size: 12px;
            color: #ffffff;
          }
        }
        .shop-list-item {
          // height: 168px;
          padding: 18px 24px;
          margin-bottom: 18px;
          border-radius: 2px;
          background: rgba(164, 178, 194, 0.09);
          display: flex;
          flex-wrap: wrap;
          column-gap: 0;
          .single {
            max-width: 324px;
            min-width: 144px;
          }
        }
        .shop-list-item:last-child {
          margin-bottom: 0;
        }
      }
      .account-container {
        background-color: rgba(164, 178, 194, 0.09);
        margin-top: 18px;
        padding: 6px 0 6px 12px;
        min-width: 680px;
        position: relative;
        /deep/ .delete-btn {
          padding: 1px;
          border: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d1d8e0;
          position: absolute;
          right: -5px;
          top: -5px;
          color: white;
          line-height: 1;
          .el-icon-close::before {
            font-size: 12px;
          }
          &:hover {
            background: var(--error-color);
          }
        }
      }
      /deep/ .add-account-btn {
        border: 1px dashed rgba(var(--fail-rgb-color), 0.3);
        color: var(--theme-color);
        margin: 18px 0;
        min-width: 680px;
        .ico-btn-add {
          color: var(--theme-color);
        }
        span {
          line-height: 27px;
        }
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
    /deep/ .el-form-item {
      margin-bottom: 8px;
    }
    /deep/ .el-form-item__content,
    a {
      font-size: 12px;
    }
    /deep/ .el-form-item__error {
      text-align: left;
    }
    .file-list {
      display: flex;
      column-gap: 18px;
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
        height: 120px;
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
    height: 50px;
    position: unset;
    z-index: 10;
    bottom: 0;
    //left: 100px;
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
  /deep/ .brand-select {
    height: auto;
    .el-input {
      height: auto;
    }
  }
}
</style>
