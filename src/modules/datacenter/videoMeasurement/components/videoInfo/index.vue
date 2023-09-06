<script src="./index.tsx"></script>
<style lang="less" scoped>
.list-item {
  box-sizing: border-box;
  display: flex;
  padding: 16px;
  /*height: 227px;*/
  background: #ffffff;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 12px;
  position: relative;
  min-width: 655px;
  .tg-btn-link {
    &:hover {
      color: #2364d4;
    }
  }

  &.click {
    cursor: pointer;
  }
  &:first-of-type {
    margin-top: 0;
  }
  &.current {
    border: 1px solid #2877ff66;
    border-radius: 4px;
    &:after {
      position: absolute;
      right: -9px;
      top: 50%;
      margin-top: -8px;
      z-index: 1;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      border: 1px solid #2877ff66;
      border-bottom-style: none;
      border-left-style: none;
      transform-origin: center center;
      transform: rotate(45deg);
      background-color: #ffffff;
    }
  }
  .video {
    width: 110px;
    // background: orange;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    /deep/ .video-item {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .video-time {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      color: white;
      height: 18px;
      text-align: center;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    }
  }
  .video-info {
    flex: 1;
    // background: red;
    margin: 0 16px 0 16px;
    .video-title-field {
      display: flex;
      align-items: center;
      margin-top: 2px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 10px;
      .playback-volume {
        background: #ffe9d8;
        border-radius: 2px;
        font-size: 12px;
        color: #fb8500;
        flex: 0 0 auto;
        width: 31px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        margin-left: 16px;
      }
      .video-title {
        font-size: 14px;
      }
    }

    .video-info-content {
      display: flex;
      padding: 12px 0 0 0;
      .video-info-details {
        width: 315px;
        display: flex;
        flex-direction: column;
        .line-1 {
          height: 40px;
          display: grid;
          grid-template-columns: 40px 1fr;
          grid-column-gap: 12px;
          grid-row-gap: 2px;
          color: var(--text-third-color);
          img {
            width: 100%;
            height: 100%;
            display: block;
            grid-row-end: 2 span;
          }
          .num {
            font-weight: 600;
            font-size: 22px;
            color: #fb8500;
            line-height: 1;
            &.true {
              color: #20bf55;
            }
            &.invalid {
              color: #c1c1c1;
              line-height: 22px;
              font-size: 16px;
            }
          }
        }
        .line-2 {
          display: flex;
          align-items: flex-end;

          .block {
            width: 74px;
            height: 42px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 4px;
            padding: 3px 0 2px 0;
            &.current {
              background-color: #fef2e4;
            }
            > span {
              &:first-child {
                color: var(--text-color);
                font-weight: 600;
                font-size: 12px;
                flex: 1;
              }
              &:last-child {
                color: var(--text-third-color);
                flex: 1;
              }
            }
          }
          /deep/ .tg-btn {
            width: 42px;
            flex: 0 0 42px;
            padding: 0 !important;
            text-align: center;
            display: flex;
            justify-content: center;
          }
          .popper {
            .popper-box {
              display: flex;
            }
          }
          .playbackRate {
            &:hover {
              span:nth-child(2) {
                color: var(--theme-color) !important;
              }
            }
          }
        }
        .line-3 {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-row-gap: 2px;
          color: var(--text-third-color);
          & > div {
            height: 18px;
            line-height: 18px;
            white-space: nowrap;
          }
        }
      }
      .other-detail {
        flex: 1 0 207px;
        background: #f5f9ff;
        border-radius: 4px;
        display: grid;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(auto-fill, 42px);
        margin-left: 16px;
        grid-row-gap: 6px;
        grid-column-gap: 4px;
        padding: 9px 10px;
        .other-detail-item {
          padding: 4px 0 2px 0;
          text-align: center;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          &.current {
            background: #fef2e4;
            border-radius: 4px;
          }
        }
        .title {
          font-size: 12px;
          color: var(--text-third-color);
          line-height: 18px;
        }
        .count {
          font-size: 12px;
          color: var(--text-color);
          font-weight: 600;
          line-height: 18px;
        }
      }
    }

    .video-btn {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      cursor: pointer;
      .video-btn-title {
        font-size: 12px;
        color: var(--text-third-color);
      }
      .icon {
        font-size: 14px;
        color: var(--icon-color);
        margin-right: 4px;
      }
      &:hover {
        .video-btn-title {
          color: #2877ff;
        }
        .icon {
          color: #2877ff;
        }
      }
    }
    .video-detail {
      display: flex;
      height: 126px;
      align-items: center;
      text-align: center;
      margin-top: 16px;
      cursor: pointer;
      &:hover {
        .plays,
        .other-detail {
          background-color: #f1f6fc;
        }
      }
      .plays {
        width: 22.96%;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .title {
          margin-top: 4px;
          font-size: 14px;
          color: var(--text-third-color);
        }
        .count {
          // color: #fb8500;
          height: 28px;
          font-size: 20px;
        }
      }
      .count.current {
        color: #fb8500;
        // font-size: 20px;
      }
    }
  }
  .goods-items {
    width: 158px;
    display: flex;
    flex-direction: column;
    .goods-item-grid {
      display: grid;
      grid-template-columns: repeat(2, 70px);
      grid-gap: 8px;
      overflow: overlay;
      margin-top: 10px;
      &::-webkit-scrollbar {
        width: 6px;
      }
    }
    .goods-empty {
      margin-top: 14px;
      /deep/ .goods-empty-common {
        margin-top: 20px;
        img {
          width: 118px !important;
          height: 64px !important;
          margin-bottom: 6px !important;
        }
        div {
          color: #c1c1c1 !important;
          font-size: 12px !important;
        }
      }
    }
    .goods-item {
      width: 70px;
      height: 70px;
      // background: blue;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-sizing: content-box;
      border: 1px solid transparent;
      &:hover {
        border-color: #d8d8d8;
      }
      .hover-border {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
      // &:hover {
      //   .hover-border {
      //     border: 1px solid #d8d8d8;
      //   }
      // }
      &.no-hover {
        cursor: auto;
      }
      /deep/ .el-image {
        width: 70px;
        height: 70px;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        .el-image__error {
          font-size: 12px;
        }
      }
      > div {
        font-size: 12px;
        color: #c1c1c1;
        position: absolute;
        bottom: 4px;
        left: 6px;
        width: 58px;
      }
    }
  }
}

.more-model-list {
  display: flex;
  flex-wrap: wrap;

  a {
    white-space: nowrap;
    padding: 0 4px;
  }
  max-width: 400px;
}

.fanPortrait {
  display: grid;
  grid-template-columns: 220px 220px;
  grid-template-rows: auto 180px;
  grid-column-gap: 8px;
  grid-row-gap: 8px;

  .title {
    color: var(--text-color);
    grid-column-end: span 2;
  }
  .chart-box {
    background: #f6f6f6;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    .chart-title {
      color: var(--text-color);
      padding: 8px 0 0 12px;
      & + div {
        flex: 1;
      }
    }
  }
  .chart {
    width: 100%;
    height: 156px;
  }
}
.age-distribution {
  display: flex;
  flex-direction: column;

  .distribution {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 15px 0;
    padding-left: 12px;

    div {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      &:last-of-type {
        margin-bottom: 0;
      }
      span {
        line-height: 12px;
        font-size: 12px;
        &:nth-child(1) {
          width: 38px;
          text-align: right;
          margin-right: 4px;
          color: var(--text-third-color);
        }
        &:nth-child(2) {
          background-image: linear-gradient(90deg, #4491f54d 0%, #4491f5 100%);
          border-radius: 2px;
          height: 12px;
        }
        &:nth-child(3) {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>

<style lang="less">
.video-tab-model-popover {
  min-width: auto;
}
.chart-box-34131745 {
  img {
    width: 100px !important;
    height: auto !important;
    margin-top: 30px;
  }
}
</style>
