<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-video-measurement {
  flex: 1;
  overflow: hidden;
  min-width: 1486px;
  .display-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
      padding: 16px 14px 6px;
      align-items: center;
      border-bottom: 1px solid #e3e8ec;
      flex-wrap: wrap;
      /deep/ .el-date-editor .el-range__close-icon {
        display: none;
      }
      .filter-item {
        display: flex;
        align-items: center;
        margin-right: 16px;
        margin-bottom: 10px;
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
            color: var(--theme-color);
          }
          &.actived {
            color: var(--theme-color);
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
      position: relative;
      flex: 1.1 0;
      // min-width: 880px;
      display: flex;
      flex-direction: column;
      .left-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
        padding-right: 11px;
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
      flex: 1 0;
      margin-left: 13px;
      background: white;
      padding: 16px 0px 16px 16px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      border: 1px solid #2877ff66;
      border-radius: 4px;
      .associated-information {
        margin-bottom: 12px;
      }

      .goods-list {
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
        font-size: var(--default-font-size);
        padding-right: 16px;

        .good-box {
          &:nth-of-type(n + 2) {
            border-top: 1px solid #e5e5e5;
            padding-top: 16px;
          }
        }

        .good-box {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 12px;
          grid-row-gap: 12px;
          margin-bottom: 16px;

          &.empty {
            grid-template-columns: 70px 1fr;
            grid-template-rows: repeat(auto-fill, 18px);
            grid-row-gap: 6px;
            .el-image {
              width: 70px;
              height: 70px;
              grid-row-end: span 3;
            }
            .label {
              color: var(--text-second-color);
            }
          }

          .good-info {
            grid-column-end: 2 span;
            display: grid;
            grid-template-columns: 70px 6fr 5fr 5fr 5fr;
            grid-column-gap: 10px;
            grid-row-gap: 6px;
            .good-img {
              grid-row-end: span 3;
              border-radius: 2px;
            }
            .title {
              grid-column: span 4;
              font-weight: 600;
            }
            .label {
              display: flex;
              color: var(--text-second-color);
              .name {
                flex-shrink: 0;
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
            .time {
              grid-column-end: span 3;
            }
          }
          .grid-info {
            border-radius: 4px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            padding: 16px 12px;
            position: relative;
            grid-row-gap: 10px;
            grid-column-gap: 4px;
            .subscript {
              position: absolute;
              right: 0;
              top: 0;
              width: 31px;
              height: 16px;
              border-radius: 2px 4px 2px 2px;
              text-align: center;
              line-height: 16px;
            }
            &.left {
              background: #fcf8f5;
              .subscript {
                background: #ffe9d8;
                color: #fb8500;
              }
            }
            &.right {
              background: #f2f9ff;
              .subscript {
                background: #e2f2ff;
                color: #2877ff;
              }
            }
            .label {
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;
              .num {
                font-size: 16px;
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
    }
  }
  .item-label {
    font-size: var(--default-font-size);
    color: var(--text-second-color);
    flex-shrink: 0;
  }
}
</style>
