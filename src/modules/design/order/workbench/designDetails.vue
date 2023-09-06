<script src="./designDetails.tsx"></script>
<style lang="less">
.eventCancellation-box {
  margin: 30px 39px 78px;
  font-weight: 400;
  font-size: 14px;
  color: var(--text-color);
  letter-spacing: 0;
  text-align: center;
  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(61, 132, 255, 0.1);
    height: 48px;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    .btn_cancel {
      background: #ffffff;
      border-radius: 3px;
      border: none;
      font-weight: 400;
      font-size: 12px;
      color: #ef4b4b;
      &:hover {
        background-color: #f7f7f7 !important;
        border: none !important;
        color: #ef4b4b !important;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.el-icon-plus {
  color: var(--theme-color);
}
.order_btn {
  height: 36px !important;
  border-radius: 5px !important;
}
.el-icon-circle-check {
  margin-top: 2px;
  margin-right: 2px;
}
/deep/.swiper-slide {
  img {
    width: 700px;
  }
}
/deep/.pagenation {
  text-align: center;
}
.detail-box {
  // padding: 16px;
  // min-width: 1000px;
  // overflow-x: auto;
  .mask-eventCancellation {
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
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
    cursor: pointer;
    i {
      font-size: 16px;
      color: #ffffff;
    }
  }
  .title {
    font-weight: 400;
    font-size: 16px;
    color: var(--text-color);
  }
  .tip-icon {
    margin-right: 3px;
    font-size: 15px;
  }
  /deep/.box-header {
    position: relative;
    .card-header20230203 {
      .designCancellation {
        width: 89px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: rgba(61, 132, 255, 0.4);
        border-radius: 5px;
        position: absolute;
        right: 12px;
        top: 10px;
        cursor: pointer;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0;
        transition: all 0.2s ease-in-out;
        &:hover {
          background: #3d84ff;
        }
      }
    }
  }
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
          position: absolute;
          right: -6px;
          top: -6px;
          font-size: 16px;
          color: #c5c5c5;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          display: block;
          &:hover {
            color: var(--theme-color);
          }
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
  // .progress-box {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;

  //   margin-bottom: 18px;
  //   .com() {
  //     width: 64px;
  //     height: 28px;
  //     line-height: 28px;
  //     border-radius: 5px;
  //     cursor: pointer;
  //     font-weight: 400;
  //     font-size: 14px;
  //     text-align: center;
  //     position: relative;
  //   }
  //   .comBefore() {
  //     content: '';
  //     position: absolute;
  //     top: 12px;
  //     height: 2px;
  //   }
  //   .item {
  //     .com();
  //     background: #d9d9d9;
  //     color: var(--text-des-color);
  //     &::before {
  //       .comBefore();
  //       left: -88px;
  //       width: 72px;
  //       background: rgba(153, 153, 153, 0.4);
  //     }
  //   }
  //   .open {
  //     .com();
  //     background: rgba(61, 132, 255, 0.2);
  //     color: #3d84ff;
  //     &::before {
  //       .comBefore();
  //       left: -88px;
  //       width: attr(data-width);
  //       background: rgba(61, 132, 255, 0.4);
  //     }
  //   }
  //   .open2 {
  //     .com();
  //     background: rgba(61, 132, 255, 0.2);
  //     color: #3d84ff;
  //     &::before {
  //       .comBefore();
  //       left: -250px;
  //       width: 236px;
  //       background: rgba(61, 132, 255, 0.4);
  //     }
  //   }
  //   .open1 {
  //     .com();
  //     background: rgba(61, 132, 255, 0.2);
  //     color: #3d84ff;
  //     &::before {
  //       .comBefore();
  //       left: -250px;
  //       width: 236px;
  //       background: rgba(61, 132, 255, 0.4);
  //     }
  //   }
  // }
  .flexOne {
    justify-content: flex-end;
  }
  .warp-box {
    display: flex;
    // grid-gap: 20px;
  }
  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /*  设计明细-待分配 */
  .design-details-no-order {
    .design-details-no-order-title {
      text-align: center;
      font-weight: 400;
      font-size: 15px;
      color: var(--text-color);
      letter-spacing: 0;
      margin-top: 28px;
    }
    .btn-box {
      display: flex;
      justify-content: center;
      grid-gap: 10px;
      margin-top: 28px;
    }
    .bold {
      font-weight: 600;
      font-size: 16px;
      color: var(--text-color);
      margin-top: 0;
    }
    .sub-title {
      font-weight: 400;
      font-size: 14px;
      color: var(--text-color);
      text-align: center;
      margin-top: 4px;
      color: var(--text-third-color);
      // margin-bottom: 4px;
    }
  }
}
/deep/.empty {
  padding-top: 13px;
  img {
    width: 133px !important;
    height: 75px !important;
  }
}
</style>
