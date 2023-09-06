<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-video-measurement {
  flex: 1;
  overflow: hidden;
  min-width: 1548px;
  .section-top {
    flex-shrink: 0;
    background: white;
    .date-picker {
      height: 100%;
      padding: 16px;
      display: flex;
      align-items: center;
      /deep/ .el-date-editor {
        cursor: pointer;
        .el-range-input {
          cursor: pointer;
        }
        .el-range__close-icon {
          display: none;
        }
      }
    }
    .left-filter-field {
      display: flex;
      // flex-wrap: wrap;
      background: white;
      padding: 16px 14px 16px;
      align-items: center;
      border-bottom: 1px solid #e3e8ec;
      /deep/ .el-date-editor .el-range__close-icon {
        display: none;
      }
      .filter-item {
        display: flex;
        align-items: center;
        margin-right: 16px;
        // margin-top: 12px;
        // flex-shrink: 0;
        &:last-of-type {
          margin-right: 0;
          flex-shrink: 0;
        }
      }
    }
  }

  .section-sort {
    padding: 16px 16px 12px 16px;
    .vidoe-sort-section {
      display: flex;
      align-items: center;
      font-size: var(--default-font-size);
      color: var(--text-second-color);
      .sort-desc {
        flex-shrink: 0;
      }
      .sort-item-list {
        display: flex;
        align-items: center;
        border: 1px solid #e5e5e5;
        // padding-right: 32px;
        background: #f9fcff;
        .sort-item {
          padding: 8px 12px;
          cursor: pointer;
          color: var(--text-second-color);
          background: transparent;
          &:hover {
            color: #2877ff;
          }
          &.actived {
            color: #2877ff;
            background: white;
            box-shadow: 0 0 0 1px #e5e5e5;
          }
        }
      }
    }
  }
  .section-bottom {
    flex: 1;
    display: flex;
    overflow-x: hidden;
    padding: 0 16px;
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      background-color: #ffffff;
    }
    .bottom-left {
      flex: 1 0;
      // min-width: 880px;
      display: flex;
      flex-direction: column;
      .left-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
        padding-right: 20px;
        padding-bottom: 20px;
        .vidoe-tabs-container {
          flex-shrink: 0;
          padding: 0 16px 0;
          background: white;
          .vidoe-tabs-container-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // border-bottom: 1px solid #e3e8ec;
            .tg-tabs {
              margin-top: 16px;
            }
            .export-item {
              flex-shrink: 0;
            }
          }
          // .tab-line {
          //   position: absolute;
          //   bottom: 0;
          //   left: 16px;
          //   width: calc(100% - 32px);
          //   height: 1px;
          //   background: #e3e8ec;
          // }
        }
      }
    }
    .bottom-right {
      flex: 1 1;
      margin-left: 10px;
      background: white;
      padding: 16px 0px 16px 16px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      border: 1px solid #2877ff66;
      border-radius: 4px;
      .video-list {
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
        /deep/ .list-item {
          padding: 0 0 24px 0;
          margin-top: 0;
        }
      }
      .associated-information {
        margin-bottom: 12px;
        color: var(--text-third-color);
        b {
          font-weight: 600;
          color: var(--text-color);
        }
      }
    }
  }
  .goods-list {
    flex: 1 1 0%;
    font-size: var(--default-font-size);

    .good-box {
      &:nth-child(n + 2) {
        padding-top: 16px;
      }
    }

    .good-box {
      display: grid;
      //grid-column-gap: 12px;
      grid-row-gap: 12px;
      grid-template-columns: 1fr;
      margin-bottom: 10px;
      background-color: #ffffff;
      padding: 18px;
      position: relative;
      cursor: pointer;

      &.true {
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

      .good-info {
        display: grid;
        grid-template-columns: 70px 4fr 3fr 3fr 3fr;
        grid-column-gap: 10px;
        grid-row-gap: 6px;
        .good-img {
          grid-row-end: span 3;
          border-radius: 2px;
        }
        .title {
          grid-column: span 4;
          font-weight: 600;
          display: flex;
          //justify-content: space-between;
          align-items: center;
          .top {
            border-style: solid;
            border-width: 1px;
            border-color: rgba(var(--text-rgb-color), 0.3);
            font-size: var(--default-font-size);
            padding: 1px 4px;
            display: inline-block;
            border-radius: 2px;
            margin-right: 6px;
            color: var(--text-third-color);
            flex-shrink: 0;
            &.top-1 {
              border-color: #f43324;
              color: #f43324;
            }
            &.top-2 {
              border-color: #fb8500;
              color: #fb8500;
            }
            &.top-3 {
              border-color: #2877ff;
              color: #3a81fc;
            }
          }
        }
        .label {
          display: flex;
          color: var(--text-second-color);
          .name {
            flex-shrink: 0;
          }
          &.time {
            grid-column: span 3;
          }
          .composite-index {
            font-weight: 600;
            &.orange {
              color: #fb8500;
            }
            &.green {
              color: #20bf55;
            }
          }
          &.span-2 {
            grid-column-end: span 2;
          }
        }
      }
      .grid-info {
        border-radius: 4px;
        display: grid;
        grid-template-columns: repeat(4, auto);
        padding: 12px 16px;
        position: relative;
        background: #f6f6f6;
        grid-column-end: span 2;
        grid-column-gap: 4px;
        .label {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3px 4px;
          white-space: nowrap;
          border-radius: 4px;
          &.true {
            background-color: #2877ff30;
          }
          .num {
            font-size: var(--small-font-size);
            color: #000000;
            &.true {
              font-weight: 600;
            }
          }
          .label {
            color: #666666;
          }
        }
      }
    }
  }

  .item-label {
    font-size: var(--default-font-size);
    color: var(--text-second-color);
    flex-shrink: 0;
  }
}
</style>
