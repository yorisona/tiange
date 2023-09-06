<script src="./detailIndex.tsx"></script>
<style lang="less" scoped>
.detail-box {
  padding: 16px;
  min-width: 1000px;
  overflow-x: auto;
  .title {
    font-weight: 400;
    font-size: 16px;
    color: var(--text-color);
  }
  .warp-box {
    // display: flex;
    // grid-gap: 20px;
    display: grid;
    grid-template-columns: auto 1fr;
    // grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
  /* 卡片 */
  .card {
    font-weight: 400;
    font-size: 14px;
    color: var(--text-color);
    white-space: nowrap;
    .card-title-box {
      font-weight: 600;
      font-size: 16px;
      color: var(--text-color);
      display: flex;
      align-items: center;
      // align-items: baseline;
      max-width: 420px;
      white-space: normal;
      // text-indent: 34px;
      position: relative;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .line {
      width: 100%;
      height: 1px;
      background: linear-gradient(to right, #d1d8e0 0%, #d1d8e0 50%, transparent 50%);
      background-size: 10px 1px;
      background-repeat: repeat-x;
      margin: 16px 0;
    }
    .dot {
      position: absolute;
      left: 0;
      top: 1px;
      width: 28px;
      height: 18px;
      text-indent: 0;
      overflow: hidden;
      line-height: 18px;
      font-size: 13px;
      text-align: center;
      border-radius: 4px;
      background-color: #dbddde;
      color: #fff;
    }
    .value {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-color);
      white-space: normal;
    }
    .header-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 10px;
      grid-column-gap: 16px;
    }
    .info-item {
      margin-bottom: 10px;
      max-width: 420px;
      .detail {
        height: 150px;
        max-height: 150px;
        overflow-y: auto;
        background: #f7f7f7;
        border-radius: 10px;
        padding: 12px;
        white-space: pre-line;
        word-break: break-all;
      }
    }
    .file-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 10px;
      grid-column-gap: 15px;
    }
    .permission-button-group {
      display: grid;
      grid-column-gap: 10px;
      align-items: center;
      .warning-words {
        background: #f2f2f2;
        border-radius: 5px;
        font-weight: 400;
        font-size: 14px;
        color: #3d84ff;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        // cursor: pointer;
      }
      .tg-btn {
        text-align: center;
        display: inline-block;
      }
    }
    // /deep/.el-upload-list--picture-card {
    //   margin: 0;
    //   display: inline;
    //   vertical-align: top;
    // }
    // /deep/.el-upload--picture-card {
    //   width: 64px;
    //   height: 64px;
    //   background: #f7f7f7;
    //   border: 1px solid #e6e6e6;
    //   border-radius: 5px;
    //   line-height: 0;
    //   i {
    //     font-size: 16px;
    //     color: var(--theme-color);
    //   }
    // }
    // /deep/.el-upload-list--picture-card .el-upload-list__item {
    //   width: 64px;
    //   height: 64px;
    //   background: #f7f7f7;
    //   border: 1px solid #e6e6e6;
    //   border-radius: 5px;
    //   line-height: none;
    //   i {
    //     font-size: 16px;
    //   }
    // }
    .upload-btn-box {
      /deep/.el-upload--text {
        width: 100%;
      }
    }
    .upload-box {
      width: 100%;
      .upload-list {
        display: flex;
        grid-gap: 10px;
        flex-wrap: wrap;
        width: 100%;
      }
      .file-text-box {
        display: grid;
        // margin-bottom: 14px;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 15px;
        // grid-row-gap: 10px;
      }
      .upload-list-item {
        width: 64px;
        height: 64px;
        border-radius: 5px;
        line-height: none;
        cursor: pointer;
        position: relative;
        background-color: #f4f8ff;
        &:hover {
          .mask {
            opacity: 1;
          }
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          object-fit: contain;
        }
        i {
          font-size: 16px;
        }
      }
      .upload-add-box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 64px;
        height: 64px;
        border-radius: 5px;
        border: 1px solid #e6e6e6;
        grid-gap: 5px;
        background: #f7f7f7;
        cursor: pointer;
        .upload-add-text {
          font-weight: 400;
          font-size: 12px;
          color: #3d84ff;
        }
      }
    }
    /deep/.main-box {
      padding: 0;
      .scroll-area {
        padding: 0;
      }
    }
    .time-btn {
      .icon {
        color: var(--border-line-color);
        font-size: 20px;
      }
      // &:hover {
      //   border-color: var(--theme-color);
      //   .icon {
      //     color: var(--theme-color);
      //   }
      // }
      &[disabled] {
        border-color: #e3e8ec;
        .icon {
          color: #e3e8ec;
        }
      }
    }
    .itemBox {
      display: flex;
      height: 100%;
      padding: 0 10px;
      // min-width: 1200px;
      // min-height: 208px;
      .item {
        width: 64px;
        height: 64px;
        border-radius: 2px;
        margin-right: 12px;
        position: relative;
        background-color: #e7eef9;
        &:last-child {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 2px;
          object-fit: contain;
        }
        &:hover {
          .mask {
            opacity: 1;
          }
        }
        .mask {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.4);
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          opacity: 0;
          i {
            font-size: 16px;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
