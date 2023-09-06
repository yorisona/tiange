<script src="./index.tsx"></script>
<style lang="less">
@charset 'utf-8';

.live-display-live-daata-page-container {
  .el-form {
    padding: 24px 24px 34px;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        height: 16px;
        line-height: 16px;
        padding: 0px;
        margin-bottom: 6px;
      }
      .el-date-editor {
        width: 100%;
      }
    }
  }
  .upload-box-data {
    display: flex;
    height: 34px;
    padding-top: 2px;
  }
  .upload-box-pic {
    display: flex;
    align-items: flex-end;
    .upload-box-pic-desc {
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      margin-left: 12px;
      margin-bottom: 4px;
      color: var(--text-third-color);
    }
    .update-item {
      display: flex;
      position: relative;
      .update-item-add {
        width: 90px;
        height: 90px;
        border: 1px dashed rgba(var(--tip-icon-rgb-color), 0.5);
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:hover {
          border-color: var(--theme-color);
        }
        .update-add-icon {
          font-size: 28px;
          color: var(--text-second-color) !important;
        }
        .update-add-desc {
          margin-top: 4px;
          font-size: 12px;
          line-height: 16px;
          height: 16px;
          color: var(--text-second-color) !important;
        }
      }
      .update-item-delete {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 20px;
        cursor: pointer;
      }
      .update-item-img {
        width: 80px;
        height: 80px;
        display: block;
        object-fit: cover;
      }
    }
  }
  .file-list-box .upload-file-list .file-item {
    width: 100%;
    overflow: hidden;
  }
}
</style>
