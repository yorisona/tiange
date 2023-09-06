<script src="./index.tsx"></script>
<style lang="less">
@import '~@/styles/utils/index.less';
.tg-dialog-cctv {
  .el-drawer {
    .el-form {
      padding-top: 20px;
      flex: auto;
      overflow-y: auto;
      overflow-y: overlay;
      max-height: calc(100vh - 90px);
    }
    .el-form-item__label {
      line-height: 16px !important;
      height: 22px !important;
      font-size: 12px;
    }
    .el-form-item__content,
    a {
      span {
        color: var(--text-third-color);
      }
      font-size: 12px;
    }
  }
  .el-checkbox {
    color: var(--text-color);
  }
}

.add-customer-drawer .el-drawer__container {
  z-index: 999 !important;
  overflow-y: auto;
  overflow-y: overlay;
  > .el-drawer {
    overflow-y: auto;
    overflow-y: overlay;
    > .el-drawer__header {
      height: 100%;
      max-height: 48px;
      padding: 0;
      .el-drawer__close-btn {
        height: 100%;
        .el-icon-close:before {
          color: var(--text-third-color);
          font-size: 13px;
          margin-right: 27px;
          vertical-align: middle;
        }
      }
    }
  }
}
.customer-header {
  .pdl(24px);
  background: #f2f7ff;
}
.add-company-btn {
  border: 1px dashed rgba(164, 178, 194, 0.5);
  width: 100%;
  span,
  .el-icon-plus {
    color: var(--text-second-color) !important;
  }
  &:hover {
    border-color: var(--theme-color) !important;
  }
}
.add-customer-drawer-inner {
  position: relative;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow-y: auto !important;
  > .drawer-form {
    flex: auto;
    overflow-y: auto;
    overflow-y: overlay;
    margin-left: 18px;
  }
  > .el-drawer-footer {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
.form-container {
  display: flex;
  flex-direction: column;
}
.company-selected-box {
  margin-bottom: 12px;
  width: 268px;
  float: left;
  margin-right: 18px;
  position: relative;
  .delete-company-btn {
    visibility: hidden;
    border: none;
    background: #d1d8e0;
    position: absolute;
    right: -5px;
    top: -8px;
    height: 16px !important;
    width: 16px;
    padding: 0 !important;
    line-height: 1;
    &.el-button--mini {
      line-height: 16px !important;
      padding: 0 !important;
    }
    &:hover {
      background: var(--error-color);
    }
    /deep/.el-icon-close:before {
      font-size: 12px;
      color: #ffffff;
    }
  }
  &:hover {
    .delete-company-btn {
      visibility: visible;
    }
  }
}
.base-item-title {
  .star {
    color: #ec1e1e;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }
  .tips {
    font-size: 12px;
    color: var(--text-third-color);
  }
  .subtitle {
    font-size: 12px;
    color: red;
  }
}
.base-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 210px));
  grid-column-gap: 24px;
  grid-row-gap: 18px;
}
.flex-line-box-shop {
  display: flex;
  .flex-line-item {
    flex: 1;
  }
  .single {
    width: calc(50% - 18px);
  }
}
.flex-line-box {
  display: flex;
  column-gap: 0;
  margin-left: 0;
  .flex-line-item {
    flex: 1;
  }
  .flex-line-item-2 {
    width: calc(50% - 36px);
  }
  .flex-line-item-4 {
    width: calc(25% - 36px);
  }
  .flex-line-item-7 {
    width: calc(14% - 36px);
  }
}
.flex-line-box-wrap {
  display: flex;
  flex-wrap: wrap;
  column-gap: 18px;
  //padding-right: 10px;
  .single {
    flex: 1;
  }
  .flex-line-item {
    width: calc(50% - 18px);
  }
  .flex-line-item-2 {
    width: calc(50% - 36px);
  }
  .flex-line-item-4 {
    width: calc(25% - 36px);
  }
  .flex-line-item-7 {
    width: calc(14% - 36px);
  }
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
.options {
  width: 100%;
  height: 60px;
  box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 100px;
}
.upload-tips {
  color: var(--text-third-color);
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
.form-title {
  color: #6a7b92;
  font-size: 14px;
  height: 22px;
  line-height: 32px;
  padding-bottom: 10px;
  text-align: left;
  vertical-align: middle;
  display: inline-block;
  padding-left: 8px;
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
  .el-checkbox__input {
    margin-top: 3px;
    margin-bottom: 16px;
  }
  .checkbox-p {
    width: 100px;
    overflow: hidden;
    margin-top: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    font-weight: 400;
    color: var(--text-color);
  }
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
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
  .file {
    width: 120px;
    height: 120px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }
    .icon {
      position: absolute;
      right: -7px;
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
  .cases {
    color: var(--theme-color);
    display: flex;
    justify-content: flex-start;
    .labels {
      color: #a4b2c2;
      width: 45px;
      text-align: right;
    }
    .text {
      color: var(--text-color);
      margin-right: 18px;
      margin-top: 6px;
      max-width: calc(100% - 105px);
      line-height: 20px;
      overflow: hidden;
      max-height: 32px;
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
      color: #a4b2c2;
    }
    .case-delete {
      color: #a4b2c2;
      font-size: 22px;
      padding-top: 7px;
    }
  }
}
.generator-kol-platform {
  display: inline-block;
  & .el-tabs {
    box-shadow: none;
    border: 1px solid #e3e7ec;
    margin-bottom: 32px;
  }
  & .el-tabs__header {
    background: #f4f7f8;
    border-bottom: 1px solid #e3e7ec;
  }
  & .el-tabs__item {
    color: #6a7b92;
  }
  & .el-tabs__content {
    padding: 11px 18px;
  }
  /deep/ .el-checkbox {
    display: inline-block;
    .checkbox-p {
      width: 100px;
      overflow: hidden;
      margin-top: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 20px;
      font-weight: 400;
      color: var(--text-color);
    }
  }
}

/deep/ .el-form-item__label {
  line-height: 20px;
}
</style>
