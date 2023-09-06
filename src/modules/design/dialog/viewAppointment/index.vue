<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 18px 18px 0px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .form-body {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-column-gap: 18px;
    grid-row-gap: 12px;
    margin-bottom: 24px;
    font-size: 12px;
    div[label] {
      &:before {
        content: attr(label) '\ff1a';
        color: var(--text-third-color);
      }
      color: var(--text-color);
    }
    .xiangguanyaoqiu,
    .pingjiajianyi {
      grid-column: 1/3 span;
    }
    .pic-grid {
      grid-column: 1/3 span;
      display: grid;
      grid-template-columns: 1fr 1fr;
      div[label] {
        &:before {
          display: block;
          padding-bottom: 12px;
        }
      }
    }
    .el-select,
    .el-date-editor,
    .el-input {
      width: 100%;
    }

    .upload-list {
      width: 100%;
      display: flex;
      align-items: center;

      .file-wrapper {
        width: 80px;
        height: 80px;
        border: 1px solid rgba(164, 178, 194, 0.5);
        position: relative;
        margin-right: 12px;
        .file,
        img {
          width: 100%;
          height: 100%;
          display: block;
          cursor: pointer;
        }
        svg {
          position: absolute;
          right: -6px;
          top: -6px;
        }
      }

      .upload-btn {
        width: 80px;
        height: 80px;
        border: 1px dashed rgba(164, 178, 194, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--text-second-color);
      }
    }
  }
  .form-footer {
    display: flex;
    justify-content: center;
    padding: 12px 0;
    margin: 24px -24px 0 -24px;
    background-color: #f4f8ff;
    button {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
