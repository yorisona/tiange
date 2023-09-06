<script src="./index.tsx"></script>
<style lang="less" scoped>
.m-currency-edit-goods-dialog {
  padding: 24px 12px 24px 18px;
  .upload-btn {
    width: 90px;
    height: 90px;
    border: dashed 1px rgba(164, 178, 194, 0.5);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
      font-size: 28px;
      width: 28px;
      height: 28px;
      display: block;
      margin-bottom: -12px;
    }

    span {
      margin-top: 10px;
      line-height: 20px;
    }

    font-size: 12px;
    color: var(--text-second-color);
  }

  .file-list {
    margin-top: 6px;
    display: flex;
    column-gap: 18px;
    row-gap: 18px;
    align-items: flex-start;

    .file {
      width: 90px;
      height: 90px;
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

    .upload-tips {
      color: var(--text-third-color);
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: var(--theme-color);
      }

      svg {
        margin-right: 4.7px;
      }
    }
  }

  .file-tips {
    font-size: 12px;
    color: var(--text-third-color);
    line-height: 1;
    margin-top: 6px;
  }
}
</style>
