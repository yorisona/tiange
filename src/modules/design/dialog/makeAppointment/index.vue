<script src="./index.tsx"></script>
<style lang="less" scoped>
.el-form {
  padding: 18px 0 0px 18px;
  .form-body {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    //grid-column-gap: 18px;
    .xiangguanyaoqiu {
      grid-column: 1/3 span;
    }
    .pic-grid {
      grid-column: 1/3 span;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding-bottom: 12px;
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
      padding-top: 6px;

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
        }
        .svg {
          background-color: #ffffff;
          position: absolute;
          right: -6px;
          top: -6px;
          width: 12px;
          height: 12px;
          overflow: hidden;
          border-radius: 12px;
          svg {
            display: block;
            width: 100%;
            height: 100%;
          }
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
}
</style>
