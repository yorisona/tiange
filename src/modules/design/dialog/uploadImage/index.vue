<script src="./index.tsx"></script>
<style lang="less" scoped>
.el-form {
  padding: 24px 24px 6px;
  .form-body {
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
}
</style>
